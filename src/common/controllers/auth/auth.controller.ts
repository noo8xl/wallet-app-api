import {
	Controller,
	HttpCode,
	Put,
	Req,
	// UsePipes,
	// ValidationPipe,
} from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "src/common/services/auth/auth.service";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Put("/sign-up/")
	@HttpCode(201)
	// @UsePipes(new ValidationPipe())
	public async signUpNewClient(@Req() req: Request): Promise<void> {
		return await this.authService.signUpNewClient(req.body);
	}
}
