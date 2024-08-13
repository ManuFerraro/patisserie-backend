import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AddressService extends PrismaClient implements OnModuleInit{
  private readonly logger = new Logger('AddressService');

  constructor() {
    super()
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');
  }

  create(createAddressDto: CreateAddressDto) {
    return 'This action adds a new address';
  }

  findAll() {
    return `This action returns all address`;
  }

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }
}
