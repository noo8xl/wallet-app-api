import { Injectable } from "@nestjs/common";

@Injectable()
export class NotificationService {
	async sendErrorMessage(str: string): Promise<void> {
		console.log(str);
	}
}
