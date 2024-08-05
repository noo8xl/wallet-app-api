import { BitcoinService } from "src/common/services/wallet/bitcoin/bitcoin.service";
import { EthereumService } from "src/common/services/wallet/ethereum/ethereum.service";
import { SolanaService } from "src/common/services/wallet/solana/solana.service";
import { TheOpenNetworkService } from "src/common/services/wallet/theOpenNetwork/theOpenNetwork.service";
import { TronService } from "src/common/services/wallet/tron/tron.service";

type BITCOIN_WALLET = {
	userId: string;
	coinName: string;
	address: string;
	privateKey: string; // Buffer -> available str value with toString()
	publicKey: string; // Buffer ->  available str value with toString()
	seedPhrase?: string; // Buffer ->  available str value with toString()
	mnemonic?: string;
	balance: number;
};

type ETHEREUM_WALLET = {
	userId: string;
	coinName: string;
	address: string;
	privateKey: string;
	publicKey: string;
	seedPhrase?: string; // Buffer ->  available str value with toString()
	mnemonic?: string;
	balance: number;
};

type TRON_WALLET = {
	userId: string;
	coinName: string;
	address: string;
	privateKey: string;
	publicKey: string;
	seedPhrase?: string; // Buffer ->  available str value with toString()
	mnemonic?: string;
	balance: number;
};

type THEOPENNETWORK_WALLET = {
	userId: string;
	coinName: string;
	address: string;
	privateKey: string; // Buffer -> available str value with toString()
	publicKey: string; // Buffer ->  available str value with toString()
	seedPhrase?: string; // Buffer ->  available str value with toString()
	mnemonic?: string;
	balance: number;
};

type SOLANA_WALLET = {
	userId: string;
	coinName: string;
	address: string;
	privateKey: string; //  Uint8Array -> available str value with toString()
	publicKey: string; //  PublicKey -> available str value with toString()
	seedPhrase?: string; // Buffer ->  available str value with toString()
	mnemonic?: string;
	balance: number;
};

type COIN_NAME_LIST = "btc" | "etc" | "trx" | "ton" | "sol";

export type WALLET =
	| BITCOIN_WALLET
	| ETHEREUM_WALLET
	| THEOPENNETWORK_WALLET
	| TRON_WALLET
	| SOLANA_WALLET;

export type WALLET_TYPE =
	| BitcoinService
	| TronService
	| TheOpenNetworkService
	| EthereumService
	| SolanaService;

export type RATE_DATA = {
	coinName: string;
	fiatName: string;
	coinBalance: number;
	fiatValue: number;
};

export type WALLET_REQUEST_DTO = {
	userId: string;
	coinName: COIN_NAME_LIST;
	address?: string;
};
