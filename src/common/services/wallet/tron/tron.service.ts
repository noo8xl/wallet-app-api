import TronWeb from "tronweb";

import {
	RATE_DATA,
	WALLET,
	WALLET_REQUEST_DTO,
} from "../../../types/wallet/wallet.types";
import { Wallet } from "../wallet.abstract";
import axios from "axios";
import { Helper } from "../../../../common/helpers/helper";

export class TronService extends Wallet {
	coinName: string;
	private readonly tronApiKey = ""; // conf
	private userId: string;
	private address: string;

	constructor(
		private readonly helper: Helper,
		dto: WALLET_REQUEST_DTO,
	) {
		super(dto.coinName);
		this.userId = dto.userId;
		this.coinName = dto.coinName;
		this.address = dto.address;
	}

	async createWallet(): Promise<string> {
		// https://www.npmjs.com/package/tronweb

		const tronWeb = new TronWeb({
			fullHost: "https://api.trongrid.io/",
			headers: { "TRON-PRO-API-KEY": this.tronApiKey },
		});

		const trxAccount = await tronWeb.createAccount();

		console.log(`
      Generated wallet: 
      - address : ${trxAccount.address.base58},
      - privKey : ${trxAccount.privateKey},
      - pubKey : ${trxAccount.publicKey}
   `);

		const wt: WALLET = {
			userId: this.userId,
			coinName: "Tron",
			address: trxAccount.address.base58,
			privateKey: trxAccount.privateKey,
			publicKey: trxAccount.publicKey,
			balance: 0,
		};

		// await database.saveWallet(trxObject)

		return wt.address.toString();
	}

	async getBalance(): Promise<number> {
		const reqUrl: string = `https://apilist.tronscan.org/api/account?address=${this.address}`;
		const payload = { address: this.address };
		let trxNetworkCoinBalance: number;
		const coinData: any = await axios({
			method: "GET",
			url: reqUrl,
			headers: payload,
		});
		console.log("coinData => ", coinData);
		const dataArray: any = coinData.data.tokens;
		console.log("received data  => ", coinData.data.tokens);
		for (let i = 0; i < dataArray.length; i++)
			trxNetworkCoinBalance = +dataArray[i].balance / 1_000_000;

		return Number(trxNetworkCoinBalance);
	}

	async getWallet(): Promise<WALLET> {
		let wt: WALLET;
		return wt;
	}

	async sendTransaction(): Promise<string> {
		const rate: RATE_DATA = await this.getRate();

		const cryptoValToFiat: number = rate.fiatValue * rate.coinBalance;
		console.log("cryptoValToFiat => ", cryptoValToFiat);
		// const notifData: string =
		//     `Found address with balance at ${this.domainName} with value: ${this.balance}.` +
		//     `All transactions was sent! You can see detail here: \n ` +
		// `https://tronscan.org/#/address/${this.address}`
		if (cryptoValToFiat <= 50) {
			// send 100% balance to owner if usd val < 50
			// await new FeeCalculator(transaction data to calc fee ).calculateFeeInNetwork() < ----
			// await send()  // from this.fromAddress to paymentArray[0].wallet
			//   .then(async () => { await Telegram.sendTransactionInfo(this.OWNER_TELEGRAM_ID, notifData) })
			//   .then(async () => { await Telegram.sendTransactionInfo(this.INFO_TELEGRAM_ID, notifData) })
			//   .catch((e:any) => { throw new Error(e) })
			return "";
		} else {
			// sending coins to all wallets in one transaction
			// calculate fee
			return "";
		}
	}

	async getTransactionInfo(): Promise<any> {
		return "";
	}

	async getRate(): Promise<RATE_DATA> {
		const coinNameForUrl: string = await this.helper.getCoinApiName(
			this.coinName,
		);
		const fiatName: string = ""; // await db get user details (fiat name )

		const getRateUrl: string = `https://api.coingecko.com/api/v3/simple/price?ids=${coinNameForUrl}&vs_currencies=${fiatName}`;
		const balance: number = await this.getBalance();

		const d = await axios(getRateUrl)
			.then(res => {
				return res.data;
			})
			.catch(e => {
				if (e) {
					throw new Error(e);
				}
			});

		const rateData: RATE_DATA = {
			coinName: this.coinName,
			fiatName: fiatName,
			coinBalance: balance,
			fiatValue: d[coinNameForUrl][fiatName],
		};

		console.log("rate obj is -> ", rateData);

		return rateData;
	}
}
