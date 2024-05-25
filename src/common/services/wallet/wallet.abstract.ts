import { RATE_DATA, WALLET } from "../../types/wallet/wallet.types";

// Wallet -> describe the nessesary class methods at each blockchain
export abstract class Wallet {
	coinName: string;

	constructor(coinName: string) {
		this.coinName = coinName;
	}

	protected abstract createWallet(): Promise<string>;
	protected abstract getWallet(): Promise<WALLET>;
	protected abstract getBalance(): Promise<number>;
	protected abstract sendTransaction(): Promise<string>;
	protected abstract getTransactionInfo(): Promise<any>;
	// getRate -> is call an API via http request to get rates data by coinName
	protected abstract getRate(): Promise<RATE_DATA>;
}
