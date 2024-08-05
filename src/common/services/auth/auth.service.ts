import { Inject, Injectable } from "@nestjs/common";
import { AUTH_CLIENT_DTO } from "src/common/dtos/auth/signUp.dto";
import { ErrorException } from "src/common/exceptions/exceprion.handleError";
import { Helper } from "src/common/helpers/helper";
// import { CacheService } from "../cache/cache.service";
import { CUSTOMER } from "src/common/types/customer/customer.types";
import { CustomerDatabaseService } from "../database/customer.database/customer.database.service";

@Injectable()
export class AuthService {
	constructor(
		@Inject() private readonly helper: Helper,
		@Inject() private readonly errorHandler: ErrorException,
		// private readonly cacheService: CacheService,
		@Inject() private readonly customerDb: CustomerDatabaseService,
	) {}

	public async signUpNewClient(clientDto: AUTH_CLIENT_DTO): Promise<void> {
		const customer: CUSTOMER = await this.customerDb.findUserByEmailFilter(
			clientDto.userEmail,
		);
		if (customer)
			return await this.errorHandler.BadRequest("User already exists.");

		// generate an API key for user
		const API_KEY: string = await this.helper.generatePassword(64);
		const userDto: CUSTOMER = {
			// userId?: string
			userEmail: clientDto.userEmail,
			domainName: clientDto.domainName,
			companyName: clientDto.companyName,
			apiKey: API_KEY,
			fiatName: "USD",
			telegramId: clientDto.telegramId, // is a nessesary option !-
			isActive: true,
			createdAt: 0, // will update in db service
			updatedAt: 0, // will update in db service
		};

		console.log("userDto -> ", userDto);
		return await this.customerDb.saveNewClient(userDto);
	}

	// // signInClient ->  validate user session use cache and api key
	// public async signInClient(clientDto: AUTH_CLIENT_DTO): Promise<void> {
	// 	// const filter = { apiKey: clientDto.apiKey };
	// 	let c: CACHE_DTO = await this.cacheService.getCachedData(clientDto.apiKey);
	// 	if (!c) {
	// 		const candidate: CUSTOMER = await this.customerDb.findUserByKeyFilter(
	// 			clientDto.apiKey,
	// 		);
	// 		if (!candidate)
	// 			return await this.errorHandler.PermissionDenied(
	// 				"Key to the API checker",
	// 			);
	// 	}
	// }
}
