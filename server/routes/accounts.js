import express from 'express';
import { generatePrivateKey, privateKeyToAddress } from "viem/accounts";
import AccountHandler from "../models/accounts.js";
const router = express.Router();


router.get('/list', async (req, res) => {
    res.json({
        status: "success",
        addresses: AccountHandler.getAllAddresses(),
    });
});

router.post('/addAccounts', async (req, res) => {
    console.log("addAccounts", req.body);
    const { accounts } = req.body;
    for (let i = 0; i < accounts.length; i++) {
        AccountHandler.addAccount(accounts[i]);
    }

    res.json({
        status: "success",
    });
});
router.post('/delete', async (req, res) => {
    console.log("addAccounts", req.body);
    const { address } = req.body;

    AccountHandler.removeAccount(address)

    res.json({
        status: "success",
    });
});
router.post('/get', async (req, res) => {
    console.log("addAccounts", req.body);
    const { address } = req.body;
    const privateKey = AccountHandler.getPrivateKey(address);
    res.json({
        status: "success",
        privateKey: privateKey
    });
});


export default router;
