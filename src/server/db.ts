import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
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
} from '../types/index.ts';

// Ensure data folder exists
const dataDir = path.resolve(process.env.DATA_DIR ?? path.resolve(process.cwd(), 'data'));
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'rasannadaeng.db');
export const db = new DatabaseSync(dbPath);

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON;');

// Password hashing utilities
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, combinedHash: string): boolean {
  try {
    const [salt, originalHash] = combinedHash.split(':');
    if (!salt || !originalHash) return false;
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(originalHash, 'hex'));
  } catch {
    return false;
  }
}

// Generate simple auth token
export function generateToken(userId: string, role: string): string {
  const payload = `${userId}:${role}:${Date.now()}`;
  const secret = process.env.APP_SECRET || 'rasanna-daeng-jwt-secret-2026';
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return Buffer.from(`${payload}:${hmac}`).toString('base64');
}

export function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const parts = decoded.split(':');
    if (parts.length < 4) return null;
    const [userId, role, timestamp, hmac] = parts;
    const payload = `${userId}:${role}:${timestamp}`;
    const secret = process.env.APP_SECRET || 'rasanna-daeng-jwt-secret-2026';
    const expectedHmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    if (hmac !== expectedHmac) return null;
    return { userId, role };
  } catch {
    return null;
  }
}

// Initialize tables
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      display_order INTEGER NOT NULL DEFAULT 0,
      icon TEXT,
      is_active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      category_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price INTEGER NOT NULL,
      image_url TEXT NOT NULL,
      is_available INTEGER NOT NULL DEFAULT 1,
      is_featured INTEGER NOT NULL DEFAULT 0,
      tag TEXT,
      stock INTEGER NOT NULL DEFAULT 999,
      created_at TEXT NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tables (
      id TEXT PRIMARY KEY,
      table_number TEXT UNIQUE NOT NULL,
      capacity INTEGER NOT NULL DEFAULT 4,
      is_active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS promotions (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      discount_type TEXT NOT NULL,
      discount_value INTEGER NOT NULL,
      min_spend INTEGER NOT NULL DEFAULT 0,
      max_discount INTEGER NOT NULL DEFAULT 0,
      quota INTEGER NOT NULL DEFAULT 0,
      used_count INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      valid_until TEXT
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      user_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      service_type TEXT NOT NULL,
      table_number TEXT,
      notes TEXT,
      subtotal INTEGER NOT NULL,
      discount INTEGER NOT NULL DEFAULT 0,
      discount_code TEXT,
      total INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      cancel_reason TEXT,
      payment_method TEXT NOT NULL,
      payment_status TEXT NOT NULL DEFAULT 'unpaid',
      payment_proof_url TEXT,
      verified_by TEXT,
      verified_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      price INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      notes TEXT,
      subtotal INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS order_status_history (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      status TEXT NOT NULL,
      payment_status TEXT NOT NULL,
      actor_name TEXT NOT NULL,
      actor_role TEXT NOT NULL,
      note TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS restaurant_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      name TEXT NOT NULL,
      tagline TEXT NOT NULL,
      address TEXT NOT NULL,
      phone_whatsapp TEXT NOT NULL,
      opening_hours TEXT NOT NULL,
      qris_image_url TEXT NOT NULL,
      is_restaurant_open INTEGER NOT NULL DEFAULT 1,
      announcement TEXT
    );
  `);

  seedInitialData();
}

// Seed the 20 authentic South Sulawesi dishes and initial configurations
function seedInitialData() {
  const userCount = (db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }).count;
  const now = new Date().toISOString();

  if (userCount === 0) {
    // Default Admin
    const adminPassHash = hashPassword('admin123');
    db.prepare(`
      INSERT INTO users (id, name, email, phone, password_hash, role, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run('user-admin-1', 'Admin Rasanna Daeng', 'admin@rasannadaeng.com', '081234567890', adminPassHash, 'admin', now);

    // Default Customer for easy testing
    const customerPassHash = hashPassword('daeng123');
    db.prepare(`
      INSERT INTO users (id, name, email, phone, password_hash, role, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run('user-cust-1', 'Andi Tenri Daeng', 'customer@rasannadaeng.com', '082198765432', customerPassHash, 'customer', now);
  }

  const categoryCount = (db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number }).count;
  if (categoryCount === 0) {
    const categoriesData = [
      { id: 'cat-1', name: 'Makanan Utama', slug: 'makanan-utama', display_order: 1, icon: 'Soup' },
      { id: 'cat-2', name: 'Camilan Tradisional', slug: 'camilan-tradisional', display_order: 2, icon: 'UtensilsCrossed' },
      { id: 'cat-3', name: 'Dessert & Manisan', slug: 'dessert-manisan', display_order: 3, icon: 'IceCream' },
      { id: 'cat-4', name: 'Minuman & Kopi Daeng', slug: 'minuman-kopi', display_order: 4, icon: 'Coffee' },
    ];

    const stmt = db.prepare(`
      INSERT INTO categories (id, name, slug, display_order, icon, is_active)
      VALUES (?, ?, ?, ?, ?, 1)
    `);
    for (const c of categoriesData) {
      stmt.run(c.id, c.name, c.slug, c.display_order, c.icon);
    }
  }

  const productCount = (db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number }).count;
  if (productCount === 0) {
    const productsData = [
      // 1. Makanan Utama
      {
        id: 'prod-1',
        category_id: 'cat-1',
        name: 'Ewako Coto',
        price: 38000,
        description: 'Coto otentik dengan potongan daging sapi pilihan, disajikan dengan kuah kental kaya 40 rempah tradisional nusantara di Manado.',
        image_url: '/src/assets/images/coto_makassar_bowl_1794359576133.jpg',
        is_available: 1,
        is_featured: 1,
        tag: 'Favorit',
      },
      {
        id: 'prod-2',
        category_id: 'cat-1',
        name: 'Daeng Konro',
        price: 48000,
        description: 'Iga sapi empuk berdaging tebal disiram kuah rempah kluwek hitam pekat khas racikan Manado yang gurih dan wangi.',
        image_url: '/src/assets/images/sop_konro_iga_1794359577471.jpg',
        is_available: 1,
        is_featured: 1,
        tag: 'Best Seller',
      },
      {
        id: 'prod-3',
        category_id: 'cat-1',
        name: 'Mantap Pallu Basa',
        price: 35000,
        description: 'Daging sapi empuk berpadu kuah kaldu rempah gurih dengan taburan serundeng kelapa sangrai wangi khas Manado.',
        image_url: '/src/assets/images/pallu_basa_bowl_1794362832117.jpg',
        is_available: 1,
        is_featured: 1,
        tag: 'Favorit',
      },
      {
        id: 'prod-4',
        category_id: 'cat-1',
        name: 'Ewako Saudara',
        price: 32000,
        description: 'Sop daging sapi khas Pangkep dengan kuah kaldu rempah berpadu susu dan bihun yang gurih menyegarkan.',
        image_url: '/src/assets/images/sop_saudara_1794364573929.jpg',
        is_available: 1,
        is_featured: 0,
        tag: 'Khas Bugis',
      },
      {
        id: 'prod-5',
        category_id: 'cat-1',
        name: 'Daeng Palekko',
        price: 42000,
        description: 'Olahan bebek cincang empuk berbumbu cabai rawit pedas menyengat dan asam mangga muda khas Pinrang.',
        image_url: '/src/assets/images/bebek_palekko_1794364548252.jpg',
        is_available: 1,
        is_featured: 1,
        tag: 'Pedas Nampol',
      },
      {
        id: 'prod-6',
        category_id: 'cat-1',
        name: 'Rasanna Parape',
        price: 55000,
        description: 'Ikan bakar segar pesisir Manado berlumur bumbu parape manis legit asam gurih kaya rempah.',
        image_url: '/src/assets/images/ikan_bakar_parape_1794364520904.jpg',
        is_available: 1,
        is_featured: 0,
        tag: 'Rekomendasi',
      },

      // 2. Camilan Tradisional
      {
        id: 'prod-7',
        category_id: 'cat-2',
        name: 'Ewako Jalangkote',
        price: 8000,
        description: 'Pastel renyah khas racikan Manado berisi tauge, wortel, bihun, dan telur rebus, dicocol ke saus lombok cair pedas asam.',
        image_url: '/src/assets/images/jalangkote_makassar_1794359579071.jpg',
        is_available: 1,
        is_featured: 1,
        tag: 'Favorit',
      },
      {
        id: 'prod-8',
        category_id: 'cat-2',
        name: 'Daeng Otak-Otak',
        price: 10000,
        description: 'Otak-otak ikan tenggiri segar yang dipanggang dalam daun pisang wangi, disantap dengan sambal kacang kental.',
        image_url: '/src/assets/images/otak_otak_bakar_1794364588793.jpg',
        is_available: 1,
        is_featured: 1,
        tag: 'Tradisional',
      },

      // 3. Dessert & Manisan
      {
        id: 'prod-9',
        category_id: 'cat-3',
        name: 'Daeng Ijo',
        price: 25000,
        description: 'Pisang raja manis dibalut adonan tepung pandan hijau lembut, disajikan bersama bubur sumsum gurih, es serut, dan sirup DHT merah.',
        image_url: '/src/assets/images/es_pisang_ijo_1794359577868.jpg',
        is_available: 1,
        is_featured: 1,
        tag: 'Best Seller',
      },
      {
        id: 'prod-10',
        category_id: 'cat-3',
        name: 'Ewako Epe Bakar',
        price: 20000,
        description: 'Pisang raja bakar dipipihkan lalu disiram saus gula merah aren kental beraroma durian legit atau taburan keju.',
        image_url: '/src/assets/images/pisang_epe_bakar_1794362848982.jpg',
        is_available: 1,
        is_featured: 1,
        tag: 'Favorit',
      },
      {
        id: 'prod-11',
        category_id: 'cat-3',
        name: 'Mantap Jipallu',
        price: 22000,
        description: 'Kue tradisional berempah nusantara di Manado bercita rasa manis legit dengan aroma gula aren kelapa dan rempah santan.',
        image_url: '/src/assets/images/kue_dange_1794364624796.jpg',
        is_available: 1,
        is_featured: 0,
        tag: 'Manis Legit',
      },
      {
        id: 'prod-12',
        category_id: 'cat-3',
        name: 'Daeng Barongko',
        price: 12000,
        description: 'Kudapan pusaka Bugis terbuat dari pisang halusan, santan, dan telur yang dikukus lembut dalam bungkusan daun pisang.',
        image_url: '/src/assets/images/kue_barongko_1794364607703.jpg',
        is_available: 1,
        is_featured: 1,
        tag: 'Warisan',
      },
      {
        id: 'prod-13',
        category_id: 'cat-3',
        name: 'Ewako Bayao',
        price: 15000,
        description: 'Kue putu cangkir manis legit gula merah hangat bertabur kelapa parut gurih khas tanah Daeng.',
        image_url: '/src/assets/images/kue_barongko_1794364607703.jpg',
        is_available: 1,
        is_featured: 0,
        tag: 'Manis Gurih',
      },
      {
        id: 'prod-14',
        category_id: 'cat-3',
        name: 'Rasanna Dange',
        price: 14000,
        description: 'Kudapan bakar ketan hitam dan kelapa muda renyah khas Pangkep yang gurih harum menggugah selera.',
        image_url: '/src/assets/images/kue_dange_1794364624796.jpg',
        is_available: 1,
        is_featured: 0,
        tag: 'Tradisional',
      },

      // 4. Minuman & Kopi Daeng
      {
        id: 'prod-15',
        category_id: 'cat-4',
        name: 'Ewako Sarabba',
        price: 18000,
        description: 'Minuman kesehatan hangat khas racikan Manado racikan jahe merah, santan kental, kuning telur, gula aren, dan rempah wangi.',
        image_url: '/src/assets/images/sarabba_drink_1794359579262.jpg',
        is_available: 1,
        is_featured: 1,
        tag: 'Best Seller',
      },
      {
        id: 'prod-16',
        category_id: 'cat-4',
        name: 'Daeng Teh Tarik',
        price: 10000,
        description: 'Teh pekat racikan khas kedai pesisir dengan paduan susu manis kental yang ditarik hingga berbusa lembut.',
        image_url: '/src/assets/images/teh_tarik_gelas_1794364688563.jpg',
        is_available: 1,
        is_featured: 0,
        tag: 'Segar',
      },
      {
        id: 'prod-17',
        category_id: 'cat-4',
        name: 'Rasanna Jeruk',
        price: 12000,
        description: 'Perasan jeruk nipis dan jeruk purut segar disajikan dingin dengan es, sangat menyegarkan sehabis bersantap coto di Manado.',
        image_url: '/src/assets/images/es_jeruk_nipis_1794364670355.jpg',
        is_available: 1,
        is_featured: 0,
        tag: 'Segar Dingin',
      },
      {
        id: 'prod-18',
        category_id: 'cat-4',
        name: 'Ewako Kopi Toraja',
        price: 15000,
        description: 'Kopi Arabika Toraja pilihan diseduh di Manado dengan aroma floral dan karamel yang mantap.',
        image_url: '/src/assets/images/kopi_toraja_1794364640151.jpg',
        is_available: 1,
        is_featured: 1,
        tag: 'Kopi Khas',
      },
      {
        id: 'prod-19',
        category_id: 'cat-4',
        name: 'Daeng Markisa',
        price: 18000,
        description: 'Sirup markisa Malino asli dingin menyegarkan dengan bulir buah dan rasa asam manis alami.',
        image_url: '/src/assets/images/es_sirup_markisa_1794364655702.jpg',
        is_available: 1,
        is_featured: 1,
        tag: 'Favorit Dingin',
      },
      {
        id: 'prod-20',
        category_id: 'cat-4',
        name: 'Mantap Susu',
        price: 14000,
        description: 'Susu sapi murni hangat berpadu dengan rempah pala dan cengkeh harum penghangat tubuh.',
        image_url: '/src/assets/images/susu_rempah_hangat_1794364706420.jpg',
        is_available: 1,
        is_featured: 0,
        tag: 'Hangat Rempah',
      },
    ];

    const prodStmt = db.prepare(`
      INSERT INTO products (id, category_id, name, description, price, image_url, is_available, is_featured, tag, stock, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 999, ?)
    `);

    for (const p of productsData) {
      prodStmt.run(p.id, p.category_id, p.name, p.description, p.price, p.image_url, p.is_available, p.is_featured, p.tag, now);
    }
  }

  // Seed restaurant tables
  const tableCount = (db.prepare('SELECT COUNT(*) as count FROM tables').get() as { count: number }).count;
  if (tableCount === 0) {
    const tableStmt = db.prepare('INSERT INTO tables (id, table_number, capacity, is_active) VALUES (?, ?, ?, 1)');
    for (let i = 1; i <= 12; i++) {
      const num = i < 10 ? `0${i}` : `${i}`;
      tableStmt.run(`tbl-${i}`, `Meja ${num}`, i % 2 === 0 ? 4 : 2);
    }
  }

  // Seed vouchers
  const promoCount = (db.prepare('SELECT COUNT(*) as count FROM promotions').get() as { count: number }).count;
  if (promoCount === 0) {
    const promoStmt = db.prepare(`
      INSERT INTO promotions (id, code, discount_type, discount_value, min_spend, max_discount, quota, used_count, is_active, valid_until)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    `);
    promoStmt.run('promo-1', 'EWAKO10', 'percentage', 10, 50000, 15000, 500, 12, '2027-12-31');
    promoStmt.run('promo-2', 'DAENGHEMAT', 'fixed', 10000, 60000, 10000, 300, 24, '2027-12-31');
  }

  // Seed restaurant settings
  const settingsCount = (db.prepare('SELECT COUNT(*) as count FROM restaurant_settings').get() as { count: number }).count;
  if (settingsCount === 0) {
    db.prepare(`
      INSERT INTO restaurant_settings (id, name, tagline, address, phone_whatsapp, opening_hours, qris_image_url, is_restaurant_open, announcement)
      VALUES (1, ?, ?, ?, ?, ?, ?, 1, ?)
    `).run(
      'Rasanna Daeng',
      'Cita Rasa Otentik Anging Mammiri',
      'Jl. Raya Politeknik, Kampus Politeknik Negeri Manado, Buha, Kec. Mapanget, Kota Manado, Sulawesi Utara 95252',
      '0812-4567-8910',
      'Setiap Hari, 09:00 - 22:00 WITA',
      '/logo_rasanna_daeng.svg',
      'Selamat datang di Rasanna Daeng! Nikmati kehangatan 40 rempah leluhur di Politeknik Negeri Manado.'
    );
  }

  // Seed 2 initial sample orders so Admin Dashboard starts with real, meaningful data
  const orderCount = (db.prepare('SELECT COUNT(*) as count FROM orders').get() as { count: number }).count;
  if (orderCount === 0) {
    const orderId1 = 'order-seed-1';
    db.prepare(`
      INSERT INTO orders (id, order_number, user_id, customer_name, customer_phone, service_type, table_number, notes, subtotal, discount, discount_code, total, status, payment_method, payment_status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      orderId1,
      'RD-20261110-8812',
      'user-cust-1',
      'Andi Tenri Daeng',
      '082198765432',
      'dine_in',
      'Meja 04',
      'Kuah coto kental, sambal dipisah',
      86000,
      8600,
      'EWAKO10',
      77400,
      'preparing',
      'qris',
      'paid',
      new Date(Date.now() - 3600000).toISOString(),
      now
    );

    db.prepare(`
      INSERT INTO order_items (id, order_id, product_id, product_name, price, quantity, notes, subtotal)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run('item-1', orderId1, 'prod-1', 'Ewako Coto', 38000, 2, 'Daging campur empuk', 76000);

    db.prepare(`
      INSERT INTO order_items (id, order_id, product_id, product_name, price, quantity, notes, subtotal)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run('item-2', orderId1, 'prod-16', 'Daeng Teh Tarik', 10000, 1, 'Dingin sedikit manis', 10000);

    db.prepare(`
      INSERT INTO order_status_history (id, order_id, status, payment_status, actor_name, actor_role, note, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run('hist-1', orderId1, 'preparing', 'paid', 'Admin Rasanna Daeng', 'admin', 'Pembayaran QRIS diverifikasi, pesanan diteruskan ke dapur', now);
  }
}

// Initialize on module load
initDatabase();
