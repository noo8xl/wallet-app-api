import { Test, TestingModule } from '@nestjs/testing';
import { CustomerDatabaseService } from './customer.database.service';

describe('CustomerDatabaseService', () => {
  let service: CustomerDatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerDatabaseService],
    }).compile();

    service = module.get<CustomerDatabaseService>(CustomerDatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
