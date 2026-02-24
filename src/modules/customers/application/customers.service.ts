import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, IsNull, Not } from 'typeorm';
import { Customer } from '@modules/customers/domain/customer.entity';
import { Person } from '@modules/persons/domain/person.entity';
import { Transaction, TransactionType, PaymentStatus } from '@modules/transactions/domain/transaction.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { SearchCustomersDto } from './dto/search-customers.dto';

enum PersonType {
  NATURAL = 'NATURAL',
  BUSINESS = 'BUSINESS',
}

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const { personType, firstName, lastName, businessName, documentNumber, documentType, email, phone, address, creditLimit, paymentDayOfMonth, notes } =
      createCustomerDto;

    let person: Person | null = null;

    if (documentNumber) {
      person = await this.personRepository.findOne({
        where: { documentNumber },
        withDeleted: true,
      });

      if (person) {
        const existingCustomer = await this.customerRepository.findOne({
          where: { personId: person.id },
          withDeleted: true,
        });

        if (existingCustomer && !existingCustomer.deletedAt) {
          throw new ConflictException('Ya existe un cliente con ese documento.');
        }

        if (existingCustomer && existingCustomer.deletedAt) {
          existingCustomer.deletedAt = undefined as any;
          existingCustomer.isActive = true;
          existingCustomer.creditLimit = creditLimit || 0;
          existingCustomer.paymentDayOfMonth = paymentDayOfMonth || 5;
          existingCustomer.notes = notes || undefined;
          await this.customerRepository.save(existingCustomer);

          person.deletedAt = undefined as any;
          person.type = personType as any;
          person.firstName = firstName;
          person.lastName = lastName || undefined;
          person.businessName = businessName || undefined;
          person.documentType = documentType as any;
          person.email = email || undefined;
          person.phone = phone || undefined;
          person.address = address || undefined;
          await this.personRepository.save(person);

          const creditInfo = await this.calculateAvailableCredit(existingCustomer.id);
          const displayName = this.buildDisplayName(person);

          return {
            success: true,
            customer: {
              customerId: existingCustomer.id,
              personId: existingCustomer.personId,
              displayName,
              documentType: person.documentType || null,
              documentNumber: person.documentNumber || null,
              email: person.email || null,
              phone: person.phone || null,
              address: person.address || null,
              creditLimit: creditInfo.creditLimit,
              usedCredit: creditInfo.usedCredit,
              availableCredit: creditInfo.availableCredit,
              paymentDayOfMonth: existingCustomer.paymentDayOfMonth,
              createdAt: existingCustomer.createdAt,
              updatedAt: existingCustomer.updatedAt,
            },
          };
        }
      }
    }

    if (!person) {
      person = this.personRepository.create({
        type: personType as any,
        firstName,
        lastName: lastName || undefined,
        businessName: businessName || undefined,
        documentType: documentType as any || null,
        documentNumber: documentNumber || undefined,
        email: email || undefined,
        phone: phone || undefined,
        address: address || undefined,
      });
      await this.personRepository.save(person);
    } else {
      person.deletedAt = undefined as any;
      person.type = personType as any;
      person.firstName = firstName;
      person.lastName = lastName || undefined;
      person.businessName = businessName || undefined;
      person.documentType = documentType as any || null;
      person.documentNumber = documentNumber || undefined;
      person.email = email || undefined;
      person.phone = phone || undefined;
      person.address = address || undefined;
      await this.personRepository.save(person);
    }

    const customer = this.customerRepository.create({
      personId: person.id,
      creditLimit: creditLimit || 0,
      currentBalance: 0,
      paymentDayOfMonth: paymentDayOfMonth || 5,
      isActive: true,
      notes: notes || undefined,
    });
    await this.customerRepository.save(customer);

    const displayName = this.buildDisplayName(person);

    return {
      success: true,
      customer: {
        customerId: customer.id,
        personId: customer.personId,
        displayName,
        documentType: person.documentType || null,
        documentNumber: person.documentNumber || null,
        email: person.email || null,
        phone: person.phone || null,
        address: person.address || null,
        creditLimit: customer.creditLimit,
        usedCredit: 0,
        availableCredit: customer.creditLimit,
        paymentDayOfMonth: customer.paymentDayOfMonth,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
      },
    };
  }

  async update(customerId: string, updateData: any) {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
      relations: ['person'],
    });

    if (!customer) {
      return { success: false, error: 'Cliente no encontrado' };
    }

    // Update customer fields
    if (updateData.creditLimit !== undefined) {
      customer.creditLimit = updateData.creditLimit;
    }
    if (updateData.paymentDayOfMonth !== undefined) {
      customer.paymentDayOfMonth = updateData.paymentDayOfMonth;
    }
    if (updateData.notes !== undefined) {
      customer.notes = updateData.notes;
    }
    if (updateData.isActive !== undefined) {
      customer.isActive = updateData.isActive;
    }

    const updated = await this.customerRepository.save(customer);

    return {
      success: true,
      customer: {
        customerId: updated.id,
        creditLimit: updated.creditLimit,
        paymentDayOfMonth: updated.paymentDayOfMonth,
        notes: updated.notes,
        isActive: updated.isActive,
        updatedAt: updated.updatedAt,
      },
    };
  }

  async delete(customerId: string) {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });

    if (!customer) {
      return { success: false, error: 'Cliente no encontrado' };
    }

    // Soft delete (marcar como inactivo)
    customer.isActive = false;
    await this.customerRepository.save(customer);

    return {
      success: true,
      message: 'Cliente eliminado correctamente',
    };
  }

  // Restored methods required by controllers

  async findOne(id: string) {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['person'],
      withDeleted: false,
    });

    if (!customer) return null;

    const creditInfo = await this.calculateAvailableCredit(customer.id);

    return {
      customerId: customer.id,
      personId: customer.personId,
      displayName: this.buildDisplayName(customer.person || null),
      documentType: customer.person?.documentType || null,
      documentNumber: customer.person?.documentNumber || null,
      email: customer.person?.email || null,
      phone: customer.person?.phone || null,
      address: customer.person?.address || null,
      creditLimit: creditInfo.creditLimit,
      usedCredit: creditInfo.usedCredit,
      availableCredit: creditInfo.availableCredit,
      paymentDayOfMonth: customer.paymentDayOfMonth,
      isActive: !!customer.isActive,
      notes: customer.notes || null,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }

  async getPayments(customerId: string) {
    const payments = await this.transactionRepository.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
      take: 50,
    });

    const mapped = payments.map((p) => ({
      id: p.id,
      documentNumber: (p as any).documentNumber || null,
      type: (p as any).transactionType || null,
      status: (p as any).status || null,
      total: Number((p as any).total ?? 0),
      paymentMethod: (p as any).paymentMethod || null,
      createdAt: p.createdAt,
    }));

    return {
      success: true,
      total: mapped.length,
      payments: mapped,
    };
  }

  async search(dto: SearchCustomersDto) {
    const { query = '', page = 1, pageSize = 10 } = dto;

    const qb = this.customerRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.person', 'person')
      .where('1=1');

    if (query && query.trim().length > 0) {
      const q = `%${query.trim()}%`;
      qb.andWhere(
        '(person.firstName LIKE :q OR person.lastName LIKE :q OR person.businessName LIKE :q OR person.documentNumber LIKE :q)',
        { q },
      );
    }

    qb.orderBy('c.createdAt', 'DESC').skip((page - 1) * pageSize).take(pageSize);

    const [items, total] = await qb.getManyAndCount();

    const customers = items.map((c) => {
      const creditLimit = Number(c.creditLimit || 0);
      const currentBalance = Number(c.currentBalance || 0);
      const availableCredit = Math.max(0, creditLimit - currentBalance);

      return {
        customerId: c.id,
        personId: c.personId,
        displayName: this.buildDisplayName(c.person || null),
        documentNumber: c.person?.documentNumber || null,
        email: c.person?.email || null,
        phone: c.person?.phone || null,
        creditLimit,
        currentBalance,
        availableCredit,
        paymentDayOfMonth: c.paymentDayOfMonth || null,
        isActive: !!c.isActive,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      };
    });

    return { success: true, page, pageSize, total, customers };
  }

  async getPendingPayments(customerId: string) {
    // Return a list of pending transactions/payments for the customer. Minimal implementation for now.
    const pending = await this.transactionRepository.find({
      where: { customerId, paymentStatus: Not(PaymentStatus.PAID) },
      order: { createdAt: 'DESC' },
      take: 50,
    });

    // Map quotas if present; keep shape compatible with callers
    const mapped = pending.map((p) => ({
      transactionId: p.id,
      documentNumber: (p as any).documentNumber ?? null,
      transactionDate: p.createdAt,
      total: Number(p.total || 0),
      quotas: (p as any).quotas || [],
    }));

    return mapped;
  }

  async getPurchases(customerId: string, status?: string) {
    const where: any = { customerId, transactionType: TransactionType.PURCHASE };
    if (status) where.status = status;

    const purchases = await this.transactionRepository.find({ where, order: { createdAt: 'DESC' }, take: 100 });

    return purchases.map((p) => ({
      id: p.id,
      documentNumber: (p as any).documentNumber ?? null,
      status: p.status,
      total: Number(p.total || 0),
      createdAt: p.createdAt,
    }));
  }

  private buildDisplayName(person: Person | null): string {
    if (!person) {
      return 'Cliente sin nombre';
    }

    if (person.businessName && person.businessName.trim().length > 0) {
      return person.businessName.trim();
    }

    const names = [person.firstName, person.lastName].filter((value) => value && value.trim().length > 0);
    if (names.length > 0) {
      return names.join(' ').trim();
    }

    return person.firstName?.trim() || 'Cliente sin nombre';
  }

  private async calculateAvailableCredit(customerId: string) {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });

    if (!customer) return { creditLimit: 0, usedCredit: 0, availableCredit: 0 };

    const creditLimit = Number(customer.creditLimit || 0);
    const usedCredit = Number(customer.currentBalance || 0);
    const availableCredit = Math.max(0, creditLimit - usedCredit);

    return { creditLimit, usedCredit, availableCredit };
  }
}
