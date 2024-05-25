import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CustomerController } from "./common/controllers/customer/customer.controller";
import { ExchangeModule } from "./modules/exchange/exchange.module";
import { WalletModule } from "./modules/wallet/wallet.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CustomerModule } from "./modules/customer/customer.module";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [
		AuthModule,
		CustomerModule,
		ExchangeModule,
		WalletModule,
		ConfigModule.forRoot({
			envFilePath: ".dev.env",
			isGlobal: true,
		}),
	],
	controllers: [AppController, CustomerController],
	providers: [AppService],
})
export class AppModule {}
