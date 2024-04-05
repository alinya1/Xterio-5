import { ethers } from "ethers";
import axios from "axios";
import fs from "fs";
import { Buffer } from "buffer";

import Logger from "@youpaichris/logger";
const logger = new Logger();


// 工具函数
function getRandom() {
    return Math.floor(Date.now() / 1000);
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function getRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}


//读取私钥文件
const data = fs.readFileSync('login_success.txt', 'utf8');
const data_array = data.split("\n").filter(line => line.trim() !== ''); // 去除空行
const keyPairs = [];
data_array.forEach(line => {
    const [address, privateKey] = line.trim().split('----');
    keyPairs.push({ address, privateKey });
});
// console.log(keyPairs);

const provider = new ethers.providers.JsonRpcProvider('https://xterio.alt.technology/');


async function mint(privateKey) {
    const wallet = new ethers.Wallet(`${privateKey}`, provider);
    const gasPrice = ethers.utils.parseUnits("0.002", "gwei"); // 设置 Gas Price 为 10 Gwei
    const transaction = {
        to: '0xBeEDBF1d1908174b4Fc4157aCb128dA4FFa80942',
        value: ethers.utils.parseEther("0"),
        maxFeePerGas: gasPrice,
        maxPriorityFeePerGas:gasPrice,
        data: '0x48f206fc'
    };
    transaction.gasLimit = await wallet.estimateGas(transaction);
    const txResponse = await wallet.sendTransaction(transaction);
    console.log(`mint hash:${txResponse.hash}`);
    await txResponse.wait();
    console.log(`mint success hash:${txResponse.hash}`);
}

async function Run() {
    for (let i = 0; i < keyPairs.length; i++) {
        const accountAddress = keyPairs[i].address;
        const privateKey = keyPairs[i].privateKey;
        logger.info(`【${i}】${accountAddress}:Run...`);
        try {
            await mint(privateKey);
        }
        catch (e) {
            console.log(`${accountAddress}:${e}`)
            fs.appendFileSync("mint_error.txt", `${accountAddress}----${privateKey}----${id_token}\n`)
        }
    }
}

Run();