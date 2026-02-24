/**
 * Script para ajustar precios de productos y costos de compras
 * 
 * Objetivo: Facilitar pruebas con precios redondos:
 * - $100,000 (productos sencillos)
 * - $200,000 (productos intermedios)
 * - $500,000 (productos premium)
 * 
 * Los costos de compra se ajustan a 60-70% del precio de venta
 */

import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(__dirname, '../data/seed/dataToSeed');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const TRANSACTIONS_FILE = path.join(DATA_DIR, 'transactions.json');

interface PriceEntry {
  listKey: string;
  grossPrice: number;
  netPrice: number;
  taxCodes: string[];
}

interface Variant {
  sku: string;
  baseCost: number;
  priceEntries: PriceEntry[];
  [key: string]: any;
}

interface Product {
  name: string;
  variants: Variant[];
  [key: string]: any;
}

interface TransactionLine {
  sku: string;
  quantity: number;
  unitPrice: number;
  taxCodes: string[];
}

interface Transaction {
  ref: string;
  kind: string;
  transactionType: string;
  lines?: TransactionLine[];
  [key: string]: any;
}

// Helper para calcular precio neto (sin IVA 19%)
function calculateNetPrice(grossPrice: number): number {
  return Math.round(grossPrice / 1.19);
}

// Asignar nivel de precio según categoría/material
function getPriceLevel(productName: string, variantSku: string): number {
  const name = productName.toLowerCase();
  const sku = variantSku.toLowerCase();
  
  // Productos premium ($200,000): Oro 18K, diamantes, zafiros
  if (sku.includes('oro18') || name.includes('diamante') || name.includes('zafiro') || name.includes('solitario')) {
    return 200000;
  }
  
  // Productos intermedios ($100,000): Oro 14K, oro blanco, perlas en oro
  if (sku.includes('oro14') || sku.includes('orob') || (sku.includes('oro') && !sku.includes('plata'))) {
    return 100000;
  }
  
  // Productos sencillos ($50,000): Plata, perlas en plata
  return 50000;
}

// Calcular costo de compra (65% del precio de venta en promedio)
function calculatePurchaseCost(salePrice: number): number {
  const costPercentage = 0.65;
  return Math.round(salePrice * costPercentage);
}

async function adjustProducts() {
  console.log('\n📦 Ajustando precios de productos...');
  
  const productsRaw = await fs.readFile(PRODUCTS_FILE, 'utf-8');
  const products: Product[] = JSON.parse(productsRaw);
  
  let variantsUpdated = 0;
  
  for (const product of products) {
    for (const variant of product.variants) {
      const targetPrice = getPriceLevel(product.name, variant.sku);
      const targetCost = calculatePurchaseCost(targetPrice);
      
      // Actualizar baseCost
      variant.baseCost = targetCost;
      
      // Actualizar todos los priceEntries
      for (const entry of variant.priceEntries) {
        let grossPrice = targetPrice;
        
        // Descuentos para listas especiales
        if (entry.listKey === 'online') {
          grossPrice = Math.round(targetPrice * 0.95); // 5% descuento online
        } else if (entry.listKey === 'wholesale') {
          grossPrice = Math.round(targetPrice * 0.85); // 15% descuento mayorista
        }
        
        entry.grossPrice = grossPrice;
        entry.netPrice = calculateNetPrice(grossPrice);
      }
      
      variantsUpdated++;
      console.log(`   ✓ ${variant.sku}: $${targetPrice.toLocaleString('es-CL')} (costo: $${targetCost.toLocaleString('es-CL')})`);
    }
  }
  
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
  console.log(`\n✅ ${variantsUpdated} variantes actualizadas en products.json`);
}

async function adjustTransactions() {
  console.log('\n💸 Ajustando costos en transacciones de compra...');
  
  const transactionsRaw = await fs.readFile(TRANSACTIONS_FILE, 'utf-8');
  const transactions: Transaction[] = JSON.parse(transactionsRaw);
  
  // Primero, cargar los nuevos costos de products.json
  const productsRaw = await fs.readFile(PRODUCTS_FILE, 'utf-8');
  const products: Product[] = JSON.parse(productsRaw);
  
  const costBySku: Map<string, number> = new Map();
  for (const product of products) {
    for (const variant of product.variants) {
      costBySku.set(variant.sku, variant.baseCost);
    }
  }
  
  // Cargar precios de venta también
  const salePriceBySku: Map<string, number> = new Map();
  for (const product of products) {
    for (const variant of product.variants) {
      // Usar el precio retail (primera entrada)
      const retailEntry = variant.priceEntries.find(e => e.listKey === 'retail');
      if (retailEntry) {
        salePriceBySku.set(variant.sku, retailEntry.netPrice);
      }
    }
  }
  
  let purchasesUpdated = 0;
  let salesUpdated = 0;
  
  for (const transaction of transactions) {
    // Actualizar COMPRAS
    if (transaction.transactionType === 'PURCHASE' && transaction.lines) {
      let newSubtotal = 0;
      
      for (const line of transaction.lines) {
        const cost = costBySku.get(line.sku);
        if (cost) {
          line.unitPrice = cost;
          newSubtotal += cost * line.quantity;
        }
      }
      
      // Recalcular totales
      transaction.subtotal = newSubtotal;
      transaction.taxAmount = Math.round(newSubtotal * 0.19);
      transaction.total = newSubtotal + transaction.taxAmount;
      
      purchasesUpdated++;
      console.log(`   ✓ ${transaction.documentNumber}: $${transaction.total.toLocaleString('es-CL')}`);
    }
    
    // Actualizar VENTAS
    if (transaction.transactionType === 'SALE' && transaction.lines) {
      let newSubtotal = 0;
      
      for (const line of transaction.lines) {
        const salePrice = salePriceBySku.get(line.sku);
        if (salePrice) {
          line.unitPrice = salePrice;
          newSubtotal += salePrice * line.quantity;
        }
      }
      
      // Recalcular totales
      transaction.subtotal = newSubtotal;
      transaction.taxAmount = Math.round(newSubtotal * 0.19);
      transaction.total = newSubtotal + transaction.taxAmount;
      
      salesUpdated++;
      console.log(`   ✓ ${transaction.documentNumber}: $${transaction.total.toLocaleString('es-CL')}`);
    }
    
    // Ajustar PAYMENT_OUT relacionados
    if (transaction.transactionType === 'PAYMENT_OUT' && transaction.relatedDocumentNumber) {
      const relatedPurchase = transactions.find(
        t => t.documentNumber === transaction.relatedDocumentNumber && t.transactionType === 'PURCHASE'
      );
      if (relatedPurchase) {
        transaction.subtotal = relatedPurchase.total;
        transaction.total = relatedPurchase.total;
      }
    }
  }
  
  await fs.writeFile(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2), 'utf-8');
  console.log(`\n✅ ${purchasesUpdated} compras y ${salesUpdated} ventas actualizadas en transactions.json`);
}

async function main() {
  try {
    console.log('🔄 Iniciando ajuste de precios...');
    console.log('═══════════════════════════════════════');
    
    await adjustProducts();
    await adjustTransactions();
    
    console.log('\n═══════════════════════════════════════');
    console.log('✨ Proceso completado exitosamente!');
    console.log('\n📋 Resumen de precios establecidos:');
    console.log('   • Productos sencillos (plata): $50,000');
    console.log('   • Productos intermedios (oro 14K): $100,000');
    console.log('   • Productos premium (oro 18K): $200,000');
    console.log('\n💰 Costos de compra ajustados a ~65% del precio venta');
    console.log('\n▶️  Ejecuta "npm run seed:flowstore" para aplicar cambios a la DB');
    
  } catch (error) {
    console.error('\n❌ Error durante el ajuste:', error);
    process.exit(1);
  }
}

main();
