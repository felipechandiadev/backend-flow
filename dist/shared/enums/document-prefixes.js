"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOCUMENT_PREFIXES = void 0;
const transaction_entity_1 = require("../../modules/transactions/domain/transaction.entity");
exports.DOCUMENT_PREFIXES = {
    [transaction_entity_1.TransactionType.SALE]: 'VENTA-',
    [transaction_entity_1.TransactionType.PURCHASE]: 'COMPRA-',
    [transaction_entity_1.TransactionType.PURCHASE_ORDER]: 'ORDEN-COMPRA-',
    [transaction_entity_1.TransactionType.SALE_RETURN]: 'DEVOLUCION-VENTA-',
    [transaction_entity_1.TransactionType.PURCHASE_RETURN]: 'DEVOLUCION-COMPRA-',
    [transaction_entity_1.TransactionType.TRANSFER_OUT]: 'TRANSFERENCIA-SALIDA-',
    [transaction_entity_1.TransactionType.TRANSFER_IN]: 'TRANSFERENCIA-ENTRADA-',
    [transaction_entity_1.TransactionType.ADJUSTMENT_IN]: 'AJUSTE-ENTRADA-',
    [transaction_entity_1.TransactionType.ADJUSTMENT_OUT]: 'AJUSTE-SALIDA-',
    [transaction_entity_1.TransactionType.PAYMENT_IN]: 'PAGO-RECIBIDO-',
    [transaction_entity_1.TransactionType.PAYMENT_OUT]: 'PAGO-EMITIDO-',
    [transaction_entity_1.TransactionType.SUPPLIER_PAYMENT]: 'PAGO-PROVEEDOR-',
    [transaction_entity_1.TransactionType.EXPENSE_PAYMENT]: 'PAGO-GASTO-',
    [transaction_entity_1.TransactionType.PAYMENT_EXECUTION]: 'EJECUCION-PAGO-',
    [transaction_entity_1.TransactionType.CASH_DEPOSIT]: 'DEPOSITO-EFECTIVO-',
    [transaction_entity_1.TransactionType.OPERATING_EXPENSE]: 'GASTO-OPERATIVO-',
    [transaction_entity_1.TransactionType.CASH_SESSION_OPENING]: 'APERTURA-CAJA-',
    [transaction_entity_1.TransactionType.CASH_SESSION_CLOSING]: 'CIERRE-CAJA-',
    [transaction_entity_1.TransactionType.CASH_SESSION_WITHDRAWAL]: 'RETIRO-CAJA-',
    [transaction_entity_1.TransactionType.CASH_SESSION_DEPOSIT]: 'DEPOSITO-CAJA-',
    [transaction_entity_1.TransactionType.PAYROLL]: 'NOMINA-',
    [transaction_entity_1.TransactionType.BANK_WITHDRAWAL_TO_SHAREHOLDER]: 'EGRESO-BANCARIO-SOCIO-',
};
//# sourceMappingURL=document-prefixes.js.map