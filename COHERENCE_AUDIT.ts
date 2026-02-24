/**
 * AUDITORIA DE COHERENCIA - Backend vs Reglas Contables
 * 
 * Documento interno para rastrear inconsistencias y actualizaciones necesarias
 * Generado: 2026-02-20
 */

export const COHERENCE_AUDIT = {
  // ==============================================
  // PROBLEMAS IDENTIFICADOS
  // ==============================================

  issues: [
    {
      id: 'ISSUE-001',
      severity: 'CRITICAL',
      title: 'TransactionsService NO crea transacciones, solo busca',
      description:
        'El servicio solo tiene métodos search() y findOne(). ' +
        'Los servicios específicos (CapitalContributionsService, CashDepositsService, etc) ' +
        'crean transacciones directamente sin pasar por un pipeline central.',
      impact: 'Imposible validar y generar asientos de forma consistente',
      regulation: 'Contraría a regla CENTRAL: "Todo debe pasar por LedgerEntriesService"',
      solution:
        'Crear TransactionsService.createTransaction(dto) que sea el ÚNICO punto de entrada',
    },

    {
      id: 'ISSUE-002',
      severity: 'CRITICAL',
      title: 'Servicios específicos NO llaman a LedgerEntriesService',
      description:
        'CapitalContributionsService, CashDepositsService, BankTransfersService, ' +
        'BankWithdrawalsService guardan transacciones directamente: ' +
        'transactionRepository.save(tx). Nunca generan LedgerEntry.',
      impact: 'No hay asientos contables para ninguna transacción',
      regulation: 'Viola Regla de Partida Doble y Devengado',
      solution: 'Todos deben inyectar TransactionsService y delegar creación',
    },

    {
      id: 'ISSUE-003',
      severity: 'CRITICAL',
      title: 'Validaciones V1-V10 NO están implementadas en ningún lado',
      description:
        'Las validaciones de saldo (banco, caja), deuda cliente, periodo cerrado, ' +
        'etc. NO existen. Cualquiera puede crear transacción sin validar restricciones contables.',
      impact: 'Integridad contable comprometida',
      regulation: 'Contraría todas las validaciones definidas en accounting-rules.md',
      solution:
        'Implementar en LedgerEntriesService.preValidateTransaction() y ' +
        'llamar ANTES de persistir',
    },

    {
      id: 'ISSUE-004',
      severity: 'HIGH',
      title: 'CashSessionsService tiene lógica dispersa',
      description:
        'CashSessionsService tiene 786 líneas con múltiples responsabilidades: ' +
        'abrir sesión, cerrar sesión, crear ventas, grabar transacciones, todo mezclado.',
      impact: 'Difícil de testear, mantenible, coherente',
      regulation: 'Viola SRP (Single Responsibility Principle)',
      solution:
        'Separar: CashSessionsService (abrir/cerrar sesión) ' +
        '+ SalesService (crear ventas, las cuales generan transacciones)',
    },

    {
      id: 'ISSUE-005',
      severity: 'HIGH',
      title: 'PaymentsService mezcla PAYMENT_IN y PAYMENT_OUT',
      description:
        'Hay un solo PaymentsService que crea ambos tipos. ' +
        'Debería existir coherencia: PAYMENT_IN (cobranza), PAYMENT_OUT (pagos).',
      impact: 'Difícil de rastrear quién cobró qué y quién pagó qué',
      regulation: 'Viola principio de trazabilidad contable',
      solution:
        'Separar o al menos documentar claramente cada tipo de pago ' +
        'y su transactionType',
    },

    {
      id: 'ISSUE-006',
      severity: 'MEDIUM',
      title: 'Metadata flags existen pero NO se usan en reglas',
      description:
        'Los servicios CREAN metadata con flags (capitalContribution, cashDeposit, etc) ' +
        'pero LedgerEntriesService NO usa estos flags para decidir qué regla aplicar.',
      impact: 'Reglas contables NO se aplican correctamente',
      regulation: 'Contraría matched rules matching en ReglaA, RuleB, etc.',
      solution:
        'LedgerEntriesService.matchRules() debe inspeccionar metadata ' +
        'y usar para filtrar reglas aplicables',
    },

    {
      id: 'ISSUE-007',
      severity: 'MEDIUM',
      title: 'No hay tipos DTO coherentes',
      description:
        'No hay CreateTransactionDto unificado. ' +
        'Cada servicio tiene sus propios payloads (createCapitalContribution, etc).',
      impact: 'Imposible tener validación clara en nivel DTO',
      regulation: 'Viola principio DDD (Domain-Driven Design)',
      solution:
        'Crear CreateTransactionDto base que contenga todos los campos posibles, ' +
        'con validación por transactionType',
    },

    {
      id: 'ISSUE-008',
      severity: 'MEDIUM',
      title: 'DocumentNumber se genera aleatoriamente en cada servicio',
      description:
        'CapitalContributionsService, CashDepositsService, BankTransfersService, ' +
        'etc. generan documentNumber de forma independiente. ' +
        'No hay correlativo único por sucursal y tipo.',
      impact: 'Auditoría compleja, posibles duplicados numéricos',
      regulation: 'Contraría estándar contable de correlativo único',
      solution:
        'Centralizar generación en TransactionsService.generateDocumentNumber(' +
        'branchId, transactionType)',
    },

    {
      id: 'ISSUE-009',
      severity: 'MEDIUM',
      title: 'AccountingAccountService NO es usado por nada',
      description:
        'El módulo accounting-accounts existe pero NO hay servicio que use ' +
        'para validar que cuentas existen antes de crear transacciones.',
      impact: 'Se pueden crear asientos con accountIds que no existen',
      regulation: 'Contraría integridad referencial',
      solution:
        'LedgerEntriesService debe validar que debitAccountId y ' +
        'creditAccountId existen en AccountingAccount antes de hacer INSERT',
    },

    {
      id: 'ISSUE-010',
      severity: 'LOW',
      title: 'ReportesContables NO existen',
      description:
        'No hay endpoints para generar Balance Sheet, Trial Balance, ' +
        'Diario General, etc.',
      impact: 'No se puede auditar/verificar contabilidad',
      regulation: 'Requerido para cumplimiento tributario',
      solution:
        'Crear AccountingReportsService con métodos para ' +
        'getBalanceSheet(), getTrialBalance(), getJournal(), etc.',
    },
  ],

  // ==============================================
  // SERVICIOS CRITICOS A ACTUALIZAR
  // ==============================================

  servicesToUpdate: {
    'TransactionsService': {
      status: 'CRITICAL',
      description: 'Debe ser el punto central de creación',
      methods: [
        'createTransaction(dto: CreateTransactionDto): Promise<Transaction>', // NUEVO
        'preValidateTransaction(tx: Transaction): Promise<ValidationError[]>', // NEW / move from LedgerEntriesService
        'generateDocumentNumber(branchId: string, txType: TransactionType): Promise<string>', // NEW
        'search(dto: SearchTransactionsDto): existing OK',
        'findOne(id: string): existing OK',
      ],
      needsInjection: ['LedgerEntriesService'],
    },

    'CapitalContributionsService': {
      status: 'HIGH',
      description: 'Debe usar TransactionsService.createTransaction()',
      methods: [
        'create(payload) → debe llamar a TransactionsService.createTransaction({})',
      ],
      deprecates: ['transactionRepository.save() directo'],
    },

    'CashDepositsService': {
      status: 'HIGH',
      description: 'Debe usar TransactionsService.createTransaction()',
      methods: [
        'create(payload) → debe llamar a TransactionsService.createTransaction({})',
      ],
      deprecates: ['transactionRepository.save() directo'],
    },

    'BankTransfersService': {
      status: 'HIGH',
      description: 'Debe usar TransactionsService.createTransaction()',
      methods: [
        'create(payload) → debe llamar a TransactionsService.createTransaction({})',
      ],
      deprecates: ['transactionRepository.save() directo'],
    },

    'BankWithdrawalsService': {
      status: 'HIGH',
      description: 'Debe usar TransactionsService.createTransaction()',
      methods: [
        'create(payload) → debe llamar a TransactionsService.createTransaction({})',
      ],
      deprecates: ['transactionRepository.save() directo'],
    },

    'CashSessionsService': {
      status: 'HIGH',
      description: 'Debe separar responsabilidades y usar TransactionsService',
      methods: [
        'openSession(dto): crear CASH_SESSION_OPENING transaction via TransactionsService',
        'closeSession(dto): crear CASH_SESSION_CLOSING transaction via TransactionsService',
        'createSaleTransaction(dto): crear SALE transaction via TransactionsService',
      ],
      deprecates: [
        'transactionRepository.save() directo',
        'transactionLineRepository.save() directo',
      ],
    },

    'PaymentsService': {
      status: 'HIGH',
      description: 'Debe usar TransactionsService para PAYMENT_IN y PAYMENT_OUT',
      methods: [
        'createMultiplePayments(dto) → cada payment debe llamar TransactionsService.createTransaction()',
      ],
      deprecates: ['transactionRepository.save() directo'],
    },

    'LedgerEntriesService': {
      status: 'HIGH',
      description: 'Ya implementado, pero necesita mejoras',
      improvements: [
        'Implementar getAccountBalance() con query real',
        'Implementar getPersonBalance() con query real',
        'Añadir logs structured para auditoría',
        'Añadir EventEmitter para triggers',
      ],
    },
  },

  // ==============================================
  // DTOs NUEVOS A CREAR
  // ==============================================

  dtosNeeded: [
    'CreateTransactionDto (union type con todos los campos)',
    'ValidateTransactionDto (para pre-checks)',
    'GenerateDocumentNumberDto',
    'CreatePaymentInDto (cobranza específica)',
    'CreatePaymentOutDto (pago específico)',
  ],

  // ==============================================
  // TIPO DE COHERENCIA A LOGRAR
  // ==============================================

  coherenceGoal: `
    FLUJO IDEAL POST-ACTUALIZACIÓN:

    1. Controller recibe POST /transactions
       └─ DTO validate + sanitize

    2. ServicioEspecifico.create(payload)
       └─ Opcional: lógica específica del dominio
       └─ Llamar: TransactionsService.createTransaction(createTxDto)

    3. TransactionsService.createTransaction()
       A. Generar documentNumber único
       B. Crear entity Transaction
       C. Guardar en BD
       D. Llamar: LedgerEntriesService.generateEntriesForTransaction()

    4. LedgerEntriesService.generateEntriesForTransaction()
       A. Fase 1: Validaciones V1-V10
          - Saldo banco/caja
          - Deuda cliente/proveedor
          - Período abierto
          - etc.
       B. Fase 2: Matching de reglas
          - Buscar AccountingRule por transactionType
          - Inspeccionar metadata para filtros adicionales
       C. Fase 3: Generar asientos
          - N LedgerEntry (pares DEBE/HABER)
       D. Fase 4: Validar balance
          - DEBE = HABER ± 0.01
       E. Fase 5: Persistir
          - INSERT LedgerEntry en BD

    5. Retornar a Controller
       - Transacción creada ✓
       - Asientos generados ✓
       - Todo auditado ✓

    GARANTÍAS:
    ✓ Partida doble siempre
    ✓ Validaciones contables siempre
    ✓ Coherencia centralizad
    ✓ Auditoria completa
  `,

  // ==============================================
  // PLAN DE IMPLEMENTACION
  // ==============================================

  implementationPlan: [
    {
      phase: 1,
      name: 'DTOs y Tipos',
      tasks: [
        'Crear CreateTransactionDto base con discriminated union por transactionType',
        'Crear tipos DTO específicos para cada transacción (CapitalContribution, CashDeposit, etc)',
        'Crear ValidateTransactionDto',
        'Validar con decoradores (class-validator)',
      ],
    },
    {
      phase: 2,
      name: 'TransactionsService Refactor',
      tasks: [
        'Añadir createTransaction(dto) method',
        'Implementar generateDocumentNumber()',
        'Inyectar LedgerEntriesService',
        'Integrar flujo: save → validate → generateLedger → return',
      ],
    },
    {
      phase: 3,
      name: 'LedgerEntriesService Completar',
      tasks: [
        'Implementar getAccountBalance() con query',
        'Implementar getPersonBalance() con query',
        'Mejorar matchRules() para inspeccionar metadata',
        'Añadir structured logging',
      ],
    },
    {
      phase: 4,
      name: 'Actualizar Servicios Específicos',
      tasks: [
        'CapitalContributionsService → usar TransactionsService',
        'CashDepositsService → usar TransactionsService',
        'BankTransfersService → usar TransactionsService',
        'BankWithdrawalsService → usar TransactionsService',
        'CashSessionsService → usar TransactionsService',
        'PaymentsService → usar TransactionsService',
      ],
    },
    {
      phase: 5,
      name: 'Tests E2E',
      tasks: [
        'Test: Crear SALE → generar asientos',
        'Test: Crear PAYMENT_IN → validar saldo cliente',
        'Test: Crear PAYMENT_OUT → validar saldo banco',
        'Test: Crear CASH_SESSION_OPENING → validar saldo caja',
        'Test: Balance sheet correcta',
        'Test: Journal entries auditables',
      ],
    },
    {
      phase: 6,
      name: 'Reportes Contables',
      tasks: [
        'Crear AccountingReportsService',
        'Implementar getBalanceSheet()',
        'Implementar getTrialBalance()',
        'Implementar getJournal()',
        'Endpoints REST GET /accounting/balance-sheet, etc',
      ],
    },
  ],

  // ==============================================
  // TIMELINE ESTIMADO
  // ==============================================

  timeline: {
    phase1DTOs: '2-3 horas',
    phase2Refactor: '3-4 horas',
    phase3Ledger: '2-3 horas',
    phase4Services: '4-6 horas',
    phase5Tests: '3-4 horas',
    phase6Reports: '2-3 horas',
    totalDays: '2-3 días',
  },
};

export const COHERENCE_SUMMARY = `
ESTADO ACTUAL: Fragmentado ❌
- Servicios crean transacciones independientemente
- NO hay asientos generados
- NO hay validaciones
- Contabilidad inconsistente

ESTADO DESEADO: Coherente ✓
- TransactionsService es punto central
- Todo pasa por LedgerEntriesService
- Validaciones V1-V10 activas
- Asientos generados automáticamente
- Auditoría completa

COSTO: Moderado (2-3 días de factorización + refactor limpio)
BENEFICIO: Crítico (Integridad contable del sistema completa)

PRIORIDAD: CRÍTICA - Sin esto, el sistema no es contable.
`;
