import { privateKeyToAddress } from "viem/accounts";



class AccountHandler {
    constructor() {
        this.accounts = [];
    }

    addAccount(privateKey) {
        this.accounts.push({
            address: privateKeyToAddress(privateKey),
            privateKey: privateKey
        });
    }

    getAccount(address) {
        return this.accounts.find(account => account.address === address);
    }
    getAllAddresses() {
        return this.accounts.map(account => account.address);
    }
    getAllAccounts() {
        return this.accounts;
    }
    getPrivateKey(address) {
        const account = this.accounts.find(account => account.address === address);
        return account.privateKey;
    }

    removeAccount(address) {
        this.accounts = this.accounts.filter(account => account.address !== address);
    }
    accountExists(address) {
        return this.accounts.some(account => account.address === address);
    }
    getAccountByAddress(address) {
        return this.accounts.find(account => account.address === address);
    }

}
const handler = new AccountHandler();
export default handler;