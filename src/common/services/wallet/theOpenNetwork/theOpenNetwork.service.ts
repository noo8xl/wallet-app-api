// import TonWeb from "tonweb";
import { WalletContractV4, TonClient, Address } from "@ton/ton";
import { mnemonicNew, KeyPair, mnemonicToWalletKey } from "ton-crypto";
import { Wallet } from "../wallet.abstract";
import {
	RATE_DATA,
	WALLET,
	WALLET_REQUEST_DTO,
} from "../../../types/wallet/wallet.types";
import { Helper } from "../../../../common/helpers/helper";
import axios from "axios";

export class TheOpenNetworkService extends Wallet {
	coinName: string;
	private userId: string;
	private address: string;

	private readonly workchain: number = 0; // Usually you need a workchain 0
	private readonly network: string = "testnet";
	// private readonly network: string = "mainnet"
	private readonly client: TonClient = new TonClient({
		endpoint: this.network,
	});

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
		// https://ton-community.github.io/tutorials/01-wallet/

		const mnemonics: string[] = await mnemonicNew();
		const keyPair: KeyPair = await mnemonicToWalletKey(mnemonics);

		// Create wallet contract
		const wallet = WalletContractV4.create({
			workchain: this.workchain,
			publicKey: keyPair.publicKey,
		});

		const wt: WALLET = {
			userId: this.userId,
			coinName: "TheOpenNetwork",
			address: wallet.address.toString(),
			privateKey: keyPair.secretKey.toString(),
			publicKey: keyPair.publicKey.toString(),
			balance: 0,
		};

		return wt.address;
	}

	async getBalance(): Promise<number> {
		const balance: bigint = await this.client.getBalance(
			Address.parse(this.address),
		);
		console.log("balance => ", balance);
		return Number(balance);
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
		// `https://tonscan.org/address/${this.address}`
		if (cryptoValToFiat <= 50) {
			// // send 100% balance to owner if usd val < 50
			// await walletContract.sendTransfer({
			//   secretKey: this.keyData.privateKey, // addressFrom private key  < -
			//   seqno, messages: [
			//     internal({
			//       to: paymentArray[0].wallet, // wallet address
			//       value: String(paymentArray[0].wallet), // string | bigint
			//       body: "receive ton", // optional comment
			//       bounce: false,
			//     })
			//   ]})
			//   .then(async () => { await Telegram.sendTransactionInfo(this.OWNER_TELEGRAM_ID, notifData) })
			//   .then(async () => { await Telegram.sendTransactionInfo(this.INFO_TELEGRAM_ID, notifData) })
			//   .catch((e:any) => { throw new Error(e) })
			//   .finally(() => {console.log("sending complete.");
			//   })
			// wait until confirmed
			// let currentSeqno = seqno;
			// while (currentSeqno == seqno) {
			//   console.log("waiting for transaction to confirm...");
			//   setTimeout(()=> {}, 1500);
			//   currentSeqno = await walletContract.getSeqno();
			// }
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
