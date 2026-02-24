# 🏗️ Motor Contable con Eventos - Arquitectura Implementada

## 📋 Resumen de la Nueva Arquitectura

Se implementó un **patrón basado en eventos de dominio** para ejecutar automáticamente el motor contable sin acoplamiento directo entre servicios.

---

## 🔄 Flujo de Ejecución

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│         POST /api/capital-contributions                          │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CONTROLLER LAYER                              │
│         CapitalContributionsController                           │
│              @Post() create(@Body() data)                        │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                  APPLICATION LAYER                               │
│         CapitalContributionsService.create()                     │
│              ↓ (Crea DTO y delega)                              │
│         TransactionsService.createTransaction(dto)              │
└────────────────────┬────────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
    ┌────────┐            ┌──────────────┐
    │ Crear  │            │ Crear DB     │
    │ Trans- │            │ Transaction  │
    │ action │            │ (atómico)    │
    └────┬───┘            └──────┬───────┘
         │                       │
         └───────────┬───────────┘
                     │
                     ▼
         ┌────────────────────────┐
         │  EMITIR EVENTO         │
         │ 'transaction.created'  │
         │  (EventEmitter2)       │
         └────────────┬───────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
         ▼                         ▼
    ┌─────────────────────────────────────┐
    │      LISTENERS (Desacoplados)        │
    │  @OnEvent('transaction.created')    │
    │                                     │
    │  1. AccountingEngineListener        │
    │     └─ Ejecuta motor contable       │
    │        └─ LedgerEntriesService      │
    │           └─ Crea asientos          │
    │                                     │
    │  2. Otros listeners... (futuro)     │
    └─────────────────────────────────────┘
```

---

## 📁 Archivos Creados/Modificados

### 1. **Evento de Dominio**
**File:** `src/shared/events/transaction-created.event.ts`
```typescript
export class TransactionCreatedEvent {
  constructor(
    public readonly transaction: Transaction,
    public readonly companyId: string,
  ) {}
}
```
- Propósito: Encapsular datos que disparan reacciones
- Responsabilidad: Transportar información del evento

### 2. **Listener del Motor Contable**
**File:** `src/shared/listeners/accounting-engine.listener.ts`
```typescript
@Injectable()
export class AccountingEngineListener implements NestInterceptor {
  @OnEvent('transaction.created')
  async handleTransactionCreated(event: TransactionCreatedEvent) {
    // Ejecuta motor contable automáticamente
    await this.dataSource.transaction(async (manager) => {
      const ledgerResponse = 
        await this.ledgerService.generateEntriesForTransaction(
          event.transaction,
          event.companyId,
          manager,
        );
    });
  }
}
```
- Propósito: Reaccionar a eventos de transacción
- Responsabilidad: Ejecutar lógica contable de forma desacoplada

### 3. **Emisor de Eventos**
**File:** `src/modules/transactions/application/transactions.service.ts`
```typescript
// Antes: Llamada directa
const ledgerResponse = await this.ledgerService.generateEntriesForTransaction(...);

// Ahora: Emisión de evento (desacoplado)
this.eventEmitter.emit(
  'transaction.created',
  new TransactionCreatedEvent(savedTx, companyId),
);
```
- Propósito: Notificar a suscriptores sin conocerlos
- Responsabilidad: Crear transacción y emitir evento

### 4. **Módulo de Eventos**
**File:** `src/shared/events/events.module.ts`
```typescript
@Module({
  imports: [LedgerEntriesModule],
  providers: [AccountingEngineListener],
  exports: [AccountingEngineListener],
})
export class EventsModule {}
```
- Propósito: Centralizar listeners y eventos
- Responsabilidad: Proporcionar listeners como inyectables

### 5. **Interceptor de Logging** (Opcional)
**File:** `src/common/interceptors/transaction-logging.interceptor.ts`
- Propósito: Logging transparente de transacciones
- Responsabilidad: Observabilidad sin afectar flujo de negocio

### 6. **Configuración de EventEmitter**
**File:** `src/app.module.ts`
```typescript
imports: [
  EventEmitterModule.forRoot(),
  EventsModule,
  // ... otros módulos
]
```

---

## ✅ Beneficios de esta Arquitectura

| Aspecto | Antes | Ahora |
|--------|-------|-------|
| **Acoplamiento** | TransactionsService → LedgerEntriesService | Desacoplado vía eventos |
| **Escalabilidad** | Hard-coded a LedgerEntriesService | Múltiples listeners posibles |
| **Testing** | Debe testear todo junto | Listeners testeable aisladamente |
| **Mantenibilidad** | Cambios en transacciones afectan ledger | Independientes |
| **Resiliencia** | Si falla ledger, falla transacción | Transacción persiste, ledger retry-able |

---

## 🔌 Cómo Extender (Agregar Nuevos Listeners)

Para agregar un nuevo listener que reaccione a transacciones:

```typescript
// 1. Crear nuevo listener
@Injectable()
export class AuditTrailListener {
  @OnEvent('transaction.created')
  async handleTransactionCreated(event: TransactionCreatedEvent) {
    // Tu lógica aquí
    await this.auditService.logTransaction(event.transaction);
  }
}

// 2. Agregar a EventsModule
@Module({
  providers: [
    AccountingEngineListener,
    AuditTrailListener,  // ← Nuevo
  ],
})
export class EventsModule {}
```

---

## 🧪 Testing

Ahora es fácil testear sin el motor contable:

```typescript
// Inyectar EventEmitter mockeado
const mockEventEmitter = {
  emit: jest.fn(),
};

// TransactionsService se testea sin motor contable
const service = new TransactionsService(
  transactionsRepo,
  branchRepo,
  dataSource,
  ledgerService,
  mockEventEmitter,
);

// Verificar que se emitió el evento
expect(mockEventEmitter.emit).toHaveBeenCalledWith(
  'transaction.created',
  expect.any(TransactionCreatedEvent),
);
```

---

## 📊 Flujo Completo: Aporte de Capital

```
1. Frontend: POST /api/capital-contributions
   └─ Payload: { shareholderId, amount, bankAccountKey, notes }

2. CapitalContributionsController.create(@Body() data)
   └─ Delega a CapitalContributionsService

3. CapitalContributionsService.create(payload)
   └─ Construye DTO
   └─ Delega a TransactionsService.createTransaction(dto)

4. TransactionsService.createTransaction(dto)
   ├─ Validateta DTO
   ├─ Obtiene branch y companyId
   ├─ Inicia dataSource.transaction()
   │  ├─ Genera documentNumber
   │  ├─ Crea Transaction en BD
   │  └─ Retorna savedTx
   ├─ EMITE EVENTO: 'transaction.created'
   └─ Retorna Transaction al frontend

5. [ASYNC] AccountingEngineListener escucha evento
   ├─ Inicia nueva transacción DB
   ├─ Llama LedgerEntriesService.generateEntriesForTransaction()
   │  ├─ Valida personalización de reglas
   │  ├─ Busca AccountingRules para PAYMENT_IN
   │  ├─ Calcula asientos (debit/credit)
   │  ├─ Valida balance
   │  └─ Persiste LedgerEntries en BD
   └─ Log: "Successfully generated 2 entries"

6. Frontend recibe respuesta exitosa:
   {
     id: "...",
     documentNumber: "PAY-...",
     type: "PAYMENT_IN",
     total: 890000,
     asientos: 2
   }
```

---

## 🐛 Debugging

Para ver eventos siendo emitidos en logs:

```bash
# En .env.development
DEBUG=nestjs:*,flow-store:*
```

Logs esperados:
```
[TransactionsService] Transaction created: {...}
[TransactionsService] Event emitted: 'transaction.created'
[AccountingEngineListener] Transaction created event detected
[AccountingEngineListener] Successfully generated 2 entries
```

---

## 🚀 Próximos Pasos Posibles

1. **Otros Eventos**: AuditTrailListener, NotificationListener
2. **Event Store**: Guardar historial de eventos
3. **Sagas**: Flujos multi-transacción con compensaciones
4. **CQRS**: Separar reads/writes de forma explícita
5. **Webhooks**: Notificar sistemas externos del evento

---

**Fecha de Implementación:** 20/02/2026
**Versión:** 1.0 - Base Event-Driven Architecture
