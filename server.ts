import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import os from 'os';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import {
  db,
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
} from './src/server/db.ts';
import {
  calculateOrderPricing,
  generateOrderNumber,
  canTransitionOrderStatus,
  canTransitionPaymentStatus,
} from './src/server/orderLogic.ts';
import {
  User,
  Category,
  Product,
  Order,
  OrderItem,
  OrderStatusHistory,
  Promotion,
  RestaurantTable,
  RestaurantSettings,
  OrderStatus,
  PaymentStatus,
} from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Update existing products with authentic photos & Politeknik Negeri Manado address
try {
  db.prepare("UPDATE products SET image_url = '/src/assets/images/pallu_basa_bowl_1794362832117.jpg' WHERE name LIKE '%Pallu Basa%'").run();
  db.prepare("UPDATE products SET image_url = '/src/assets/images/pisang_epe_bakar_1794362848982.jpg' WHERE name LIKE '%Epe%'").run();
  db.prepare("UPDATE products SET image_url = '/src/assets/images/sop_saudara_1794364573929.jpg' WHERE name LIKE '%Saudara%'").run();
  db.prepare("UPDATE products SET image_url = '/src/assets/images/bebek_palekko_1794364548252.jpg' WHERE name LIKE '%Palekko%'").run();
  db.prepare("UPDATE products SET image_url = '/src/assets/images/ikan_bakar_parape_1794364520904.jpg' WHERE name LIKE '%Parape%'").run();
  db.prepare("UPDATE products SET image_url = '/src/assets/images/otak_otak_bakar_1794364588793.jpg' WHERE name LIKE '%Otak%'").run();
  db.prepare("UPDATE products SET image_url = '/src/assets/images/kue_barongko_1794364607703.jpg' WHERE name LIKE '%Barongko%' OR name LIKE '%Bayao%'").run();
  db.prepare("UPDATE products SET image_url = '/src/assets/images/kue_dange_1794364624796.jpg' WHERE name LIKE '%Dange%' OR name LIKE '%Jipallu%'").run();
  db.prepare("UPDATE products SET image_url = '/src/assets/images/teh_tarik_gelas_1794364688563.jpg' WHERE name LIKE '%Teh Tarik%'").run();
  db.prepare("UPDATE products SET image_url = '/src/assets/images/es_jeruk_nipis_1794364670355.jpg' WHERE name LIKE '%Jeruk%'").run();
  db.prepare("UPDATE products SET image_url = '/src/assets/images/kopi_toraja_1794364640151.jpg' WHERE name LIKE '%Toraja%'").run();
  db.prepare("UPDATE products SET image_url = '/src/assets/images/es_sirup_markisa_1794364655702.jpg' WHERE name LIKE '%Markisa%'").run();
  db.prepare("UPDATE products SET image_url = '/src/assets/images/susu_rempah_hangat_1794364706420.jpg' WHERE name LIKE '%Susu%'").run();
  db.prepare(`
    UPDATE restaurant_settings 
    SET address = 'Jl. Raya Politeknik, Kampus Politeknik Negeri Manado, Buha, Kec. Mapanget, Kota Manado, Sulawesi Utara 95252',
        announcement = 'Selamat datang di Rasanna Daeng! Nikmati kehangatan 40 rempah leluhur di Politeknik Negeri Manado.'
    WHERE id = 1
  `).run();
  db.prepare("UPDATE products SET description = REPLACE(description, 'Makassar', 'Manado') WHERE description LIKE '%Makassar%'").run();
  db.prepare("UPDATE products SET description = REPLACE(description, 'Sulawesi Selatan', 'Manado') WHERE description LIKE '%Sulawesi Selatan%'").run();
} catch (e) {
  // ignore
}

// Body parsers - allow base64 images up to 10MB
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Local Network Information Endpoint for Phone / Wi-Fi testing
app.get('/api/network-info', (_req: Request, res: Response) => {
  const interfaces = os.networkInterfaces();
  const addresses: string[] = [];
  for (const k of Object.keys(interfaces)) {
    for (const net of interfaces[k] || []) {
      if (net.family === 'IPv4' && !net.internal) {
        addresses.push(net.address);
      }
    }
  }
  return res.json({
    port: PORT,
    localIps: addresses,
    laptopUrl: `http://localhost:${PORT}`,
    phoneUrls: addresses.map((ip) => `http://${ip}:${PORT}`),
  });
});

// Ensure uploads directory exists
const uploadsDir = path.resolve(process.env.DATA_DIR ?? path.resolve(process.cwd(), 'data'), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Auth Middleware
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    name: string;
    email: string;
  };
}

function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Silakan login terlebih dahulu' });
  }

  const token = authHeader.split(' ')[1];
  const verified = verifyToken(token);
  if (!verified) {
    return res.status(401).json({ error: 'Sesi login tidak valid atau sudah kedaluwarsa' });
  }

  const user = db.prepare('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?').get(verified.userId) as any;
  if (!user) {
    return res.status(401).json({ error: 'Pengguna tidak ditemukan' });
  }

  req.user = {
    id: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  };
  next();
}

function adminOnlyMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  authMiddleware(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Akses ditolak: Hanya admin yang diizinkan' });
    }
    next();
  });
}

function optionalAuthMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const verified = verifyToken(token);
    if (verified) {
      const user = db.prepare('SELECT id, name, email, phone, role FROM users WHERE id = ?').get(verified.userId) as any;
      if (user) {
        req.user = { id: user.id, role: user.role, name: user.name, email: user.email };
      }
    }
  }
  next();
}

// ==========================================
// 1. AUTHENTICATION ROUTES
// ==========================================

app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password minimal 6 karakter' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
    if (existing) {
      return res.status(400).json({ error: 'Email sudah terdaftar. Silakan login.' });
    }

    const userId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const passHash = hashPassword(password);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (id, name, email, phone, password_hash, role, created_at)
      VALUES (?, ?, ?, ?, ?, 'customer', ?)
    `).run(userId, name.trim(), cleanEmail, phone.trim(), passHash, now);

    const token = generateToken(userId, 'customer');

    return res.json({
      success: true,
      token,
      user: {
        id: userId,
        name: name.trim(),
        email: cleanEmail,
        phone: phone.trim(),
        role: 'customer',
        createdAt: now,
      },
    });
  } catch (err: any) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Gagal melakukan registrasi' });
  }
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password wajib diisi' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail) as any;

    if (!user || !verifyPassword(password, user.password_hash)) {
      return res.status(400).json({ error: 'Email atau password salah' });
    }

    const token = generateToken(user.id, user.role);

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.created_at,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Gagal melakukan login' });
  }
});

app.get('/api/auth/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = db.prepare('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?').get(req.user!.id) as any;
    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }
    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.created_at,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal memuat profil' });
  }
});

// ==========================================
// 2. CATEGORIES & PRODUCTS ROUTES
// ==========================================

app.get('/api/categories', (_req: Request, res: Response) => {
  try {
    const rows = db.prepare('SELECT id, name, slug, display_order as displayOrder, icon, is_active as isActive FROM categories WHERE is_active = 1 ORDER BY display_order ASC').all();
    return res.json({ categories: rows });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal memuat kategori' });
  }
});

app.get('/api/products', (req: Request, res: Response) => {
  try {
    const { category, search, availableOnly, featured } = req.query;
    let query = `
      SELECT p.id, p.category_id as categoryId, c.name as categoryName, p.name, p.description,
             p.price, p.image_url as imageUrl, p.is_available as isAvailable,
             p.is_featured as isFeatured, p.tag, p.stock, p.created_at as createdAt
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (category && category !== 'all') {
      query += ' AND (c.slug = ? OR p.category_id = ?)';
      params.push(category, category);
    }

    if (search && typeof search === 'string' && search.trim()) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }

    if (availableOnly === 'true' || availableOnly === '1') {
      query += ' AND p.is_available = 1';
    }

    if (featured === 'true' || featured === '1') {
      query += ' AND p.is_featured = 1';
    }

    query += ' ORDER BY p.is_featured DESC, p.created_at ASC';

    const rows = db.prepare(query).all(...params).map((p: any) => ({
      ...p,
      isAvailable: Boolean(p.isAvailable),
      isFeatured: Boolean(p.isFeatured),
    }));

    return res.json({ products: rows });
  } catch (err) {
    console.error('Fetch products error:', err);
    return res.status(500).json({ error: 'Gagal memuat produk' });
  }
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  try {
    const row = db.prepare(`
      SELECT p.id, p.category_id as categoryId, c.name as categoryName, p.name, p.description,
             p.price, p.image_url as imageUrl, p.is_available as isAvailable,
             p.is_featured as isFeatured, p.tag, p.stock, p.created_at as createdAt
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `).get(req.params.id) as any;

    if (!row) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }

    return res.json({
      product: {
        ...row,
        isAvailable: Boolean(row.isAvailable),
        isFeatured: Boolean(row.isFeatured),
      },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal memuat detail produk' });
  }
});

// Admin Product Management
app.post('/api/products', adminOnlyMiddleware, (req: Request, res: Response) => {
  try {
    const { categoryId, name, description, price, imageUrl, isAvailable, isFeatured, tag, stock } = req.body;

    if (!categoryId || !name || !price) {
      return res.status(400).json({ error: 'Kategori, nama produk, dan harga wajib diisi' });
    }

    const id = `prod-${Date.now()}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO products (id, category_id, name, description, price, image_url, is_available, is_featured, tag, stock, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      categoryId,
      name.trim(),
      description ? description.trim() : '',
      parseInt(price, 10),
      imageUrl || '/src/assets/images/coto_makassar_bowl_1794359576133.jpg',
      isAvailable ? 1 : 0,
      isFeatured ? 1 : 0,
      tag || null,
      stock !== undefined ? parseInt(stock, 10) : 999,
      now
    );

    return res.json({ success: true, productId: id });
  } catch (err: any) {
    console.error('Create product error:', err);
    return res.status(500).json({ error: 'Gagal menambahkan produk' });
  }
});

app.put('/api/products/:id', adminOnlyMiddleware, (req: Request, res: Response) => {
  try {
    const { categoryId, name, description, price, imageUrl, isAvailable, isFeatured, tag, stock } = req.body;

    db.prepare(`
      UPDATE products
      SET category_id = ?, name = ?, description = ?, price = ?, image_url = ?,
          is_available = ?, is_featured = ?, tag = ?, stock = ?
      WHERE id = ?
    `).run(
      categoryId,
      name.trim(),
      description ? description.trim() : '',
      parseInt(price, 10),
      imageUrl,
      isAvailable ? 1 : 0,
      isFeatured ? 1 : 0,
      tag || null,
      stock !== undefined ? parseInt(stock, 10) : 999,
      req.params.id
    );

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal memperbarui produk' });
  }
});

app.patch('/api/products/:id/availability', adminOnlyMiddleware, (req: Request, res: Response) => {
  try {
    const { isAvailable } = req.body;
    db.prepare('UPDATE products SET is_available = ? WHERE id = ?').run(isAvailable ? 1 : 0, req.params.id);
    return res.json({ success: true, isAvailable: Boolean(isAvailable) });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengubah ketersediaan produk' });
  }
});

app.delete('/api/products/:id', adminOnlyMiddleware, (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal menghapus produk' });
  }
});

// Category CRUD
app.post('/api/categories', adminOnlyMiddleware, (req: Request, res: Response) => {
  try {
    const { name, slug, displayOrder, icon } = req.body;
    const id = `cat-${Date.now()}`;
    db.prepare(`
      INSERT INTO categories (id, name, slug, display_order, icon, is_active)
      VALUES (?, ?, ?, ?, ?, 1)
    `).run(id, name.trim(), slug.trim(), displayOrder || 0, icon || 'Utensils');
    return res.json({ success: true, id });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal menambah kategori' });
  }
});

app.delete('/api/categories/:id', adminOnlyMiddleware, (req: Request, res: Response) => {
  try {
    const productCount = (db.prepare('SELECT COUNT(*) as count FROM products WHERE category_id = ?').get(req.params.id) as any).count;
    if (productCount > 0) {
      return res.status(400).json({ error: 'Kategori masih memiliki produk, tidak dapat dihapus' });
    }
    db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal menghapus kategori' });
  }
});

// Image Upload Endpoint (supports base64 data url)
app.post('/api/upload', (req: Request, res: Response) => {
  try {
    const { dataUrl, filename } = req.body;
    if (!dataUrl) {
      return res.status(400).json({ error: 'Data gambar diperlukan' });
    }

    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Format data gambar tidak valid' });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    if (buffer.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'Ukuran file maksimal 5MB' });
    }

    const ext = mimeType.includes('png') ? 'png' : mimeType.includes('webp') ? 'webp' : 'jpg';
    const safeName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = path.join(uploadsDir, safeName);

    fs.writeFileSync(filePath, buffer);

    return res.json({
      success: true,
      url: `/uploads/${safeName}`,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: 'Gagal menyimpan gambar' });
  }
});

// ==========================================
// 3. PROMOTIONS & TABLES
// ==========================================

app.get('/api/promotions', (_req: Request, res: Response) => {
  try {
    const rows = db.prepare('SELECT * FROM promotions WHERE is_active = 1').all();
    return res.json({ promotions: rows });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal memuat promosi' });
  }
});

app.post('/api/promotions/verify', (req: Request, res: Response) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Kode voucher wajib diisi' });
    }

    const promo = db.prepare('SELECT * FROM promotions WHERE UPPER(code) = UPPER(?) AND is_active = 1').get(code.trim()) as any;
    if (!promo) {
      return res.status(404).json({ error: 'Kode voucher tidak ditemukan atau sudah tidak aktif' });
    }

    const promotionObj: Promotion = {
      id: promo.id,
      code: promo.code,
      discountType: promo.discount_type,
      discountValue: promo.discount_value,
      minSpend: promo.min_spend,
      maxDiscount: promo.max_discount,
      quota: promo.quota,
      usedCount: promo.used_count,
      isActive: Boolean(promo.is_active),
    };

    const dummyItems = [{ price: parseInt(subtotal, 10) || 0, quantity: 1 }];
    const calculation = calculateOrderPricing(dummyItems, promotionObj);

    if (calculation.discountError) {
      return res.status(400).json({ error: calculation.discountError });
    }

    return res.json({
      valid: true,
      code: promo.code,
      discount: calculation.discount,
      minSpend: promo.min_spend,
      discountType: promo.discount_type,
      discountValue: promo.discount_value,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal memverifikasi voucher' });
  }
});

app.get('/api/tables', (_req: Request, res: Response) => {
  try {
    const rows = db.prepare('SELECT id, table_number as tableNumber, capacity, is_active as isActive FROM tables WHERE is_active = 1 ORDER BY table_number ASC').all();
    return res.json({ tables: rows });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal memuat daftar meja' });
  }
});

app.get('/api/settings', (_req: Request, res: Response) => {
  try {
    const settings = db.prepare('SELECT name, tagline, address, phone_whatsapp as phoneWhatsapp, opening_hours as openingHours, qris_image_url as qrisImageUrl, is_restaurant_open as isRestaurantOpen, announcement FROM restaurant_settings WHERE id = 1').get() as any;
    return res.json({
      settings: {
        ...settings,
        isRestaurantOpen: Boolean(settings.isRestaurantOpen),
      },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal memuat pengaturan restoran' });
  }
});

app.put('/api/settings', adminOnlyMiddleware, (req: Request, res: Response) => {
  try {
    const { name, tagline, address, phoneWhatsapp, openingHours, qrisImageUrl, isRestaurantOpen, announcement } = req.body;
    db.prepare(`
      UPDATE restaurant_settings
      SET name = ?, tagline = ?, address = ?, phone_whatsapp = ?, opening_hours = ?,
          qris_image_url = ?, is_restaurant_open = ?, announcement = ?
      WHERE id = 1
    `).run(
      name,
      tagline,
      address,
      phoneWhatsapp,
      openingHours,
      qrisImageUrl,
      isRestaurantOpen ? 1 : 0,
      announcement || ''
    );
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal menyimpan pengaturan' });
  }
});

// ==========================================
// 4. ORDERS & CHECKOUT ENGINE
// ==========================================

app.post('/api/orders', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      customerName,
      customerPhone,
      serviceType,
      tableNumber,
      notes,
      items,
      paymentMethod,
      discountCode,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Keranjang pesanan masih kosong' });
    }

    if (!customerName || !customerPhone) {
      return res.status(400).json({ error: 'Nama dan nomor WhatsApp wajib diisi' });
    }

    if (serviceType === 'dine_in' && !tableNumber) {
      return res.status(400).json({ error: 'Nomor meja wajib dipilih untuk pesanan Dine-in' });
    }

    if (paymentMethod !== 'cash' && paymentMethod !== 'qris') {
      return res.status(400).json({ error: 'Metode pembayaran tidak valid' });
    }

    // Step 1: Re-fetch every item from database for price & availability integrity
    const verifiedItems: {
      productId: string;
      productName: string;
      price: number;
      quantity: number;
      notes: string;
      subtotal: number;
    }[] = [];

    for (const item of items) {
      const prod = db.prepare('SELECT id, name, price, is_available, stock FROM products WHERE id = ?').get(item.productId) as any;
      if (!prod) {
        return res.status(400).json({ error: `Produk dengan ID ${item.productId} tidak ditemukan` });
      }
      if (!prod.is_available) {
        return res.status(400).json({ error: `Maaf, produk "${prod.name}" saat ini sedang habis` });
      }

      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const sub = prod.price * qty;

      verifiedItems.push({
        productId: prod.id,
        productName: prod.name,
        price: prod.price,
        quantity: qty,
        notes: item.notes ? String(item.notes).trim() : '',
        subtotal: sub,
      });
    }

    // Step 2: Handle Promotion Voucher if provided
    let promotionObj: Promotion | null = null;
    if (discountCode) {
      const promoRow = db.prepare('SELECT * FROM promotions WHERE UPPER(code) = UPPER(?) AND is_active = 1').get(discountCode.trim()) as any;
      if (promoRow) {
        promotionObj = {
          id: promoRow.id,
          code: promoRow.code,
          discountType: promoRow.discount_type,
          discountValue: promoRow.discount_value,
          minSpend: promoRow.min_spend,
          maxDiscount: promoRow.max_discount,
          quota: promoRow.quota,
          usedCount: promoRow.used_count,
          isActive: Boolean(promoRow.is_active),
        };
      }
    }

    // Step 3: Server Authoritative Pricing Calculation
    const pricing = calculateOrderPricing(verifiedItems, promotionObj);

    // Step 4: Atomic DB Insertions
    const orderId = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const orderNumber = generateOrderNumber();
    const now = new Date().toISOString();

    const paymentStatus: PaymentStatus = paymentMethod === 'cash' ? 'unpaid' : 'pending_verification';

    db.exec('BEGIN TRANSACTION;');
    try {
      db.prepare(`
        INSERT INTO orders (
          id, order_number, user_id, customer_name, customer_phone, service_type,
          table_number, notes, subtotal, discount, discount_code, total,
          status, payment_method, payment_status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)
      `).run(
        orderId,
        orderNumber,
        req.user!.id,
        customerName.trim(),
        customerPhone.trim(),
        serviceType,
        serviceType === 'dine_in' ? tableNumber : null,
        notes ? notes.trim() : null,
        pricing.subtotal,
        pricing.discount,
        pricing.appliedCode || null,
        pricing.total,
        paymentMethod,
        paymentStatus,
        now,
        now
      );

      const itemStmt = db.prepare(`
        INSERT INTO order_items (id, order_id, product_id, product_name, price, quantity, notes, subtotal)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (let i = 0; i < verifiedItems.length; i++) {
        const it = verifiedItems[i];
        itemStmt.run(`item-${orderId}-${i}`, orderId, it.productId, it.productName, it.price, it.quantity, it.notes, it.subtotal);
      }

      // Initial history entry
      db.prepare(`
        INSERT INTO order_status_history (id, order_id, status, payment_status, actor_name, actor_role, note, created_at)
        VALUES (?, ?, 'pending', ?, ?, 'customer', 'Pesanan berhasil dibuat oleh pelanggan', ?)
      `).run(`hist-${Date.now()}`, orderId, paymentStatus, customerName.trim(), now);

      // Increment voucher usage if applied
      if (pricing.appliedCode) {
        db.prepare('UPDATE promotions SET used_count = used_count + 1 WHERE UPPER(code) = UPPER(?)').run(pricing.appliedCode);
      }

      db.exec('COMMIT;');
    } catch (txError) {
      db.exec('ROLLBACK;');
      throw txError;
    }

    return res.json({
      success: true,
      order: {
        id: orderId,
        orderNumber,
        total: pricing.total,
        subtotal: pricing.subtotal,
        discount: pricing.discount,
        paymentMethod,
        paymentStatus,
        status: 'pending',
      },
    });
  } catch (err: any) {
    console.error('Order creation error:', err);
    return res.status(500).json({ error: 'Gagal membuat pesanan: ' + (err.message || 'Kesalahan server') });
  }
});

app.get('/api/orders', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const isAdmin = req.user!.role === 'admin';
    const { status, serviceType, paymentStatus, search } = req.query;

    let query = `
      SELECT o.*,
             (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as itemCount
      FROM orders o
      WHERE 1=1
    `;
    const params: any[] = [];

    if (!isAdmin) {
      // Customer can ONLY view their own orders!
      query += ' AND o.user_id = ?';
      params.push(req.user!.id);
    }

    if (status && status !== 'all') {
      query += ' AND o.status = ?';
      params.push(status);
    }

    if (serviceType && serviceType !== 'all') {
      query += ' AND o.service_type = ?';
      params.push(serviceType);
    }

    if (paymentStatus && paymentStatus !== 'all') {
      query += ' AND o.payment_status = ?';
      params.push(paymentStatus);
    }

    if (search && typeof search === 'string') {
      query += ' AND (o.order_number LIKE ? OR o.customer_name LIKE ? OR o.customer_phone LIKE ?)';
      const s = `%${search.trim()}%`;
      params.push(s, s, s);
    }

    query += ' ORDER BY o.created_at DESC';

    const rows = db.prepare(query).all(...params).map((o: any) => ({
      id: o.id,
      orderNumber: o.order_number,
      userId: o.user_id,
      customerName: o.customer_name,
      customerPhone: o.customer_phone,
      serviceType: o.service_type,
      tableNumber: o.table_number,
      notes: o.notes,
      subtotal: o.subtotal,
      discount: o.discount,
      discountCode: o.discount_code,
      total: o.total,
      status: o.status,
      cancelReason: o.cancel_reason,
      paymentMethod: o.payment_method,
      paymentStatus: o.payment_status,
      paymentProofUrl: o.payment_proof_url,
      createdAt: o.created_at,
      updatedAt: o.updated_at,
      itemCount: o.itemCount,
    }));

    return res.json({ orders: rows });
  } catch (err) {
    console.error('List orders error:', err);
    return res.status(500).json({ error: 'Gagal memuat daftar pesanan' });
  }
});

app.get('/api/orders/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id) as any;
    if (!order) {
      return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
    }

    // Role check: customer cannot view others' orders
    if (req.user!.role !== 'admin' && order.user_id !== req.user!.id) {
      return res.status(403).json({ error: 'Akses ditolak: Anda tidak memiliki izin untuk melihat pesanan ini' });
    }

    const items = db.prepare(`
      SELECT oi.*, p.image_url as imageUrl
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `).all(req.params.id).map((it: any) => ({
      id: it.id,
      orderId: it.order_id,
      productId: it.product_id,
      productName: it.product_name,
      price: it.price,
      quantity: it.quantity,
      notes: it.notes,
      subtotal: it.subtotal,
      imageUrl: it.imageUrl,
    }));

    const history = db.prepare('SELECT * FROM order_status_history WHERE order_id = ? ORDER BY created_at ASC').all(req.params.id).map((h: any) => ({
      id: h.id,
      orderId: h.order_id,
      status: h.status,
      paymentStatus: h.payment_status,
      actorName: h.actor_name,
      actorRole: h.actor_role,
      note: h.note,
      createdAt: h.created_at,
    }));

    return res.json({
      order: {
        id: order.id,
        orderNumber: order.order_number,
        userId: order.user_id,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        serviceType: order.service_type,
        tableNumber: order.table_number,
        notes: order.notes,
        subtotal: order.subtotal,
        discount: order.discount,
        discountCode: order.discount_code,
        total: order.total,
        status: order.status,
        cancelReason: order.cancel_reason,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        paymentProofUrl: order.payment_proof_url,
        verifiedBy: order.verified_by,
        verifiedAt: order.verified_at,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        items,
        statusHistory: history,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal memuat detail pesanan' });
  }
});

// Admin Status Updates
app.patch('/api/orders/:id/status', adminOnlyMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, note, cancelReason } = req.body;
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id) as any;
    if (!order) {
      return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
    }

    if (!canTransitionOrderStatus(order.status, status)) {
      return res.status(400).json({ error: `Transisi status tidak diizinkan dari "${order.status}" ke "${status}"` });
    }

    const now = new Date().toISOString();
    db.prepare(`
      UPDATE orders
      SET status = ?, cancel_reason = ?, updated_at = ?
      WHERE id = ?
    `).run(status, cancelReason || order.cancel_reason, now, req.params.id);

    db.prepare(`
      INSERT INTO order_status_history (id, order_id, status, payment_status, actor_name, actor_role, note, created_at)
      VALUES (?, ?, ?, ?, ?, 'admin', ?, ?)
    `).run(
      `hist-${Date.now()}`,
      req.params.id,
      status,
      order.payment_status,
      req.user!.name,
      note || `Status pesanan diubah menjadi ${status}`,
      now
    );

    return res.json({ success: true, status });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal memperbarui status pesanan' });
  }
});

// Payment Verification (Admin)
app.patch('/api/orders/:id/payment', adminOnlyMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { paymentStatus, note } = req.body;
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id) as any;
    if (!order) {
      return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
    }

    if (!canTransitionPaymentStatus(order.payment_status, paymentStatus)) {
      return res.status(400).json({ error: `Transisi status pembayaran tidak diizinkan dari "${order.payment_status}" ke "${paymentStatus}"` });
    }

    const now = new Date().toISOString();
    db.prepare(`
      UPDATE orders
      SET payment_status = ?, verified_by = ?, verified_at = ?, updated_at = ?
      WHERE id = ?
    `).run(paymentStatus, req.user!.name, now, now, req.params.id);

    db.prepare(`
      INSERT INTO order_status_history (id, order_id, status, payment_status, actor_name, actor_role, note, created_at)
      VALUES (?, ?, ?, ?, ?, 'admin', ?, ?)
    `).run(
      `hist-${Date.now()}`,
      req.params.id,
      order.status,
      paymentStatus,
      req.user!.name,
      note || `Pembayaran diverifikasi oleh admin sebagai ${paymentStatus}`,
      now
    );

    return res.json({ success: true, paymentStatus });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal memperbarui status pembayaran' });
  }
});

// Customer QRIS Proof Upload
app.post('/api/orders/:id/payment-proof', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { proofUrl } = req.body;
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id) as any;
    if (!order) {
      return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
    }

    if (order.user_id !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Akses ditolak' });
    }

    const now = new Date().toISOString();
    db.prepare(`
      UPDATE orders
      SET payment_proof_url = ?, payment_status = 'pending_verification', updated_at = ?
      WHERE id = ?
    `).run(proofUrl, now, req.params.id);

    db.prepare(`
      INSERT INTO order_status_history (id, order_id, status, payment_status, actor_name, actor_role, note, created_at)
      VALUES (?, ?, ?, 'pending_verification', ?, 'customer', 'Pelanggan mengunggah bukti pembayaran QRIS. Menunggu verifikasi admin.', ?)
    `).run(`hist-${Date.now()}`, req.params.id, order.status, req.user!.name, now);

    return res.json({ success: true, paymentStatus: 'pending_verification' });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengunggah bukti pembayaran' });
  }
});

// ==========================================
// 5. ADMIN DASHBOARD & REPORTS
// ==========================================

app.get('/api/admin/dashboard', adminOnlyMiddleware, (_req: Request, res: Response) => {
  try {
    const totalOrders = (db.prepare('SELECT COUNT(*) as count FROM orders').get() as any).count;
    
    // Today's orders
    const today = new Date().toISOString().slice(0, 10);
    const todayOrders = (db.prepare("SELECT COUNT(*) as count FROM orders WHERE created_at LIKE ?").get(`${today}%`) as any).count;

    // Verified revenue: strictly from orders that have payment_status = 'paid'
    const revRow = db.prepare("SELECT COALESCE(SUM(total), 0) as rev FROM orders WHERE payment_status = 'paid'").get() as any;
    const verifiedRevenue = revRow.rev || 0;

    // Pending orders waiting for confirmation
    const pendingOrdersCount = (db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'").get() as any).count;

    // Active products count
    const activeProductsCount = (db.prepare("SELECT COUNT(*) as count FROM products WHERE is_available = 1").get() as any).count;

    // Sales chart data for last 7 days
    const salesChart: { date: string; revenue: number; orderCount: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().slice(0, 10);
      const daySales = db.prepare(`
        SELECT COALESCE(SUM(total), 0) as rev, COUNT(*) as cnt
        FROM orders
        WHERE created_at LIKE ? AND payment_status = 'paid'
      `).get(`${dayStr}%`) as any;

      salesChart.push({
        date: dayStr,
        revenue: daySales.rev || 0,
        orderCount: daySales.cnt || 0,
      });
    }

    // Top selling products
    const topSellingProducts = db.prepare(`
      SELECT oi.product_name as productName, SUM(oi.quantity) as quantity, SUM(oi.subtotal) as revenue
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.payment_status = 'paid'
      GROUP BY oi.product_name
      ORDER BY quantity DESC
      LIMIT 5
    `).all().map((r: any) => ({
      productName: r.productName,
      quantity: r.quantity,
      revenue: r.revenue,
    }));

    // Recent orders
    const recentOrders = db.prepare(`
      SELECT id, order_number as orderNumber, customer_name as customerName,
             customer_phone as customerPhone, service_type as serviceType,
             table_number as tableNumber, total, status, payment_method as paymentMethod,
             payment_status as paymentStatus, created_at as createdAt
      FROM orders
      ORDER BY created_at DESC
      LIMIT 6
    `).all();

    return res.json({
      stats: {
        totalOrders,
        todayOrders,
        verifiedRevenue,
        pendingOrdersCount,
        activeProductsCount,
        salesChart,
        topSellingProducts,
        recentOrders,
      },
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    return res.status(500).json({ error: 'Gagal memuat statistik dashboard' });
  }
});

// Admin Reports with CSV Export
app.get('/api/admin/reports', adminOnlyMiddleware, (req: Request, res: Response) => {
  try {
    const { startDate, endDate, format } = req.query;
    let query = `
      SELECT o.id, o.order_number, o.created_at, o.customer_name, o.customer_phone,
             o.service_type, o.table_number, o.subtotal, o.discount, o.total,
             o.payment_method, o.payment_status, o.status
      FROM orders o
      WHERE 1=1
    `;
    const params: any[] = [];

    if (startDate) {
      query += ' AND o.created_at >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND o.created_at <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY o.created_at DESC';
    const rows = db.prepare(query).all(...params) as any[];

    if (format === 'csv') {
      let csv = 'Nomor Pesanan,Tanggal,Pelanggan,WhatsApp,Layanan,Meja,Subtotal,Diskon,Total,Metode Pembayaran,Status Pembayaran,Status Pesanan\n';
      for (const r of rows) {
        csv += `"${r.order_number}","${r.created_at}","${r.customer_name}","${r.customer_phone}","${r.service_type}","${r.table_number || '-'}","${r.subtotal}","${r.discount}","${r.total}","${r.payment_method}","${r.payment_status}","${r.status}"\n`;
      }
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="laporan-penjualan-rasanna-daeng.csv"');
      return res.send(csv);
    }

    // Summary calculation
    const totalTransactions = rows.length;
    const paidRows = rows.filter((r) => r.payment_status === 'paid');
    const totalRevenue = paidRows.reduce((sum, r) => sum + r.total, 0);

    return res.json({
      summary: {
        totalTransactions,
        paidTransactions: paidRows.length,
        totalRevenue,
      },
      orders: rows,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal memuat laporan' });
  }
});

// Admin Customers Management
app.get('/api/admin/customers', adminOnlyMiddleware, (_req: Request, res: Response) => {
  try {
    const customers = db.prepare(`
      SELECT u.id, u.name, u.email, u.phone, u.created_at as createdAt,
             COUNT(o.id) as totalOrders,
             COALESCE(SUM(CASE WHEN o.payment_status = 'paid' THEN o.total ELSE 0 END), 0) as totalSpent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE u.role = 'customer'
      GROUP BY u.id
      ORDER BY totalSpent DESC
    `).all();

    return res.json({ customers });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal memuat daftar pelanggan' });
  }
});

// ==========================================
// 6. DEV / VITE SPA INTEGRATION
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Rasanna Daeng berjalan di http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
  process.exit(1);
});
