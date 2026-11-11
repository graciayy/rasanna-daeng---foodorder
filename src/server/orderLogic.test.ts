import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateOrderPricing,
  generateOrderNumber,
  canTransitionOrderStatus,
  canTransitionPaymentStatus,
} from './orderLogic.ts';
import { Promotion } from '../types/index.ts';

test('calculateOrderPricing calculates correct subtotal without promo', () => {
  const items = [
    { price: 38000, quantity: 2 }, // Ewako Coto
    { price: 8000, quantity: 3 },  // Ewako Jalangkote
  ];
  const result = calculateOrderPricing(items);
  assert.equal(result.subtotal, 100000);
  assert.equal(result.discount, 0);
  assert.equal(result.total, 100000);
  assert.equal(result.appliedCode, undefined);
});

test('calculateOrderPricing applies percentage discount with cap correctly', () => {
  const items = [{ price: 200000, quantity: 1 }];
  const promo: Promotion = {
    id: 'promo-1',
    code: 'EWAKO10',
    discountType: 'percentage',
    discountValue: 10, // 10% of 200,000 = 20,000
    minSpend: 50000,
    maxDiscount: 15000, // Capped at 15,000
    quota: 100,
    usedCount: 5,
    isActive: true,
  };
  const result = calculateOrderPricing(items, promo);
  assert.equal(result.subtotal, 200000);
  assert.equal(result.discount, 15000);
  assert.equal(result.total, 185000);
  assert.equal(result.appliedCode, 'EWAKO10');
});

test('calculateOrderPricing rejects promo if below minSpend', () => {
  const items = [{ price: 30000, quantity: 1 }];
  const promo: Promotion = {
    id: 'promo-2',
    code: 'DAENGHEMAT',
    discountType: 'fixed',
    discountValue: 10000,
    minSpend: 50000,
    maxDiscount: 0,
    quota: 50,
    usedCount: 0,
    isActive: true,
  };
  const result = calculateOrderPricing(items, promo);
  assert.equal(result.subtotal, 30000);
  assert.equal(result.discount, 0);
  assert.equal(result.total, 30000);
  assert.match(result.discountError || '', /Minimal belanja/);
});

test('generateOrderNumber generates unique format RD-YYYYMMDD-XXXX', () => {
  const fixedDate = new Date('2026-11-12T10:00:00Z');
  const orderNum = generateOrderNumber(fixedDate, 'TEST');
  assert.equal(orderNum, 'RD-20261112-TEST');
});

test('canTransitionOrderStatus validates lifecycle', () => {
  assert.equal(canTransitionOrderStatus('pending', 'confirmed'), true);
  assert.equal(canTransitionOrderStatus('confirmed', 'preparing'), true);
  assert.equal(canTransitionOrderStatus('preparing', 'ready'), true);
  assert.equal(canTransitionOrderStatus('ready', 'completed'), true);
  assert.equal(canTransitionOrderStatus('pending', 'rejected'), true);
  assert.equal(canTransitionOrderStatus('completed', 'pending'), false);
});

test('canTransitionPaymentStatus validates payment verification flow', () => {
  assert.equal(canTransitionPaymentStatus('unpaid', 'pending_verification'), true);
  assert.equal(canTransitionPaymentStatus('pending_verification', 'paid'), true);
  assert.equal(canTransitionPaymentStatus('pending_verification', 'rejected'), true);
  assert.equal(canTransitionPaymentStatus('paid', 'unpaid'), false);
});
