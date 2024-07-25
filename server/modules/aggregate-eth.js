import { createWalletClient, http, createPublicClient, formatUnits, parseUnits } from "viem";
import { base } from "viem/chains";
import { privateKeyToAccount } from 'viem/accounts';
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

// EXAMPLE

const PRIVATE_KEY = process.argv[2];
const Account = privateKeyToAccount(PRIVATE_KEY);
const AGGREGATE_TO = "0x0000000000000000000000000000000000000000";

const publicClient = createPublicClient({
    chain: base,
    transport: http(),
});

const walletClient = createWalletClient({
    chain: base,
    transport: http(),
});
const min_transfer = parseUnits("0.000001", 18);

((async () => {
    try {
        const ethBalance = await publicClient.getBalance({ address: Account.address });
        console.log(Account.address, "balance", formatUnits(ethBalance, 18));

        if (ethBalance < min_transfer) return;

        const gasPrice = (await publicClient.getGasPrice()) * 101n / 100n
        const gas = await publicClient.estimateGas({
            account: Account.address,
            to: AGGREGATE_TO
        });

        const hash = await walletClient.sendTransaction({
            nonce: await publicClient.getTransactionCount({ address: Account.address }, {
                blockTag: "latest"
            }),
            account: Account,
            to: AGGREGATE_TO,
            gas: gas,
            gasPrice: gasPrice,
            value: ethBalance - ((gas * gasPrice) * 104n / 100n)
        })
        console.log("hash", hash);

    } catch (error) {
        console.log("aggr fail", error);
    }
    process.exit(4);
})())