import { Test, TestingModule } from "@nestjs/testing";
import { WalletDatabaseService } from "./wallet.database.service";

describe("WalletDatabaseService", () => {
	let service: WalletDatabaseService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [WalletDatabaseService],
		}).compile();

		service = module.get<WalletDatabaseService>(WalletDatabaseService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
