import { Response } from "express";
import { NotificationApi } from "../../api/notificationCall.api";
import { Injectable } from "@nestjs/common";
// import { Inject } from "@nestjs/common";

// ApiError -> handle an API errors
@Injectable()
export class ErrorException {
	private res: Response;
	constructor(private readonly notification: NotificationApi) {}

	public async UnauthorizedError(): Promise<void> {
		this.res.status(401);
		this.res.json({ message: "Unauthorized error." });
		this.res.end();
	}

	//res?: express.Response,
	public async PermissionDenied(action: string): Promise<void> {
		console.log("res inst at api error is -> ", this.res);

		await this.notification.sendErrorMessage(
			`Catch permission denied error at ${action}.`,
		);
		this.res.status(403);
		this.res.json({ message: "Permission denied." });
		this.res.end();
	}

	public async BadRequest(action?: string): Promise<void> {
		await this.notification.sendErrorMessage(`Catch an error. ${action}.`);
		this.res.status(400);
		this.res.json({ message: `${!action ? "Bad request." : action}` });
		this.res.end();
	}

	public async ServerError(action: string): Promise<void> {
		await this.notification.sendErrorMessage(`${action} was failed.`);
		// this.res.status(500)
		// this.res.json({message: "Internal server error."})
		// this.res.end()
	}

	public async NotFoundError(): Promise<void> {
		this.res.status(404);
		this.res.json({ message: "Not found." });
		this.res.end();
	}

	// ############################################################################################## //

	private sendErrorMessage(): any {}
}
