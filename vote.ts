import Axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import fs from "fs";
import { ethers } from "ethers";
import { Buffer } from "buffer";



// 获取10位时间戳
function getRandom() {
    return Math.floor(Date.now() / 1000);
}
// 获取随机min-max数字
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
// 延迟
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//获取随机字符串
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
const data_array = data.split("\n").filter(line => line.trim() !== '');
const keyPairs = [];
data_array.forEach(line => {
    const [address, privateKey, id_token] = line.trim().split('----');
    keyPairs.push({ address, privateKey, id_token });
});



class task {
    //构造函数 创建对象初始化对象属性
    constructor(address, privateKey, id_token, proxy) {
        // 固定参数
        this.proxyAgent = new HttpsProxyAgent(proxy);
        this.axios = Axios.create({
            proxy: false,
            httpsAgent: this.proxyAgent,
        });
        this.address = address;
        this.privateKey = privateKey;
        this.id_token = id_token;
        // 项目函数可调整
        this.devices = `18e9d${getRandomString(10)}-${getRandomString(15)}-26001b51-2073600-18e9d${getRandomString(10)}`
        this.identities = Buffer.from(this.devices).toString('base64');
        this.provider = new ethers.providers.JsonRpcProvider('https://xterio.alt.technology/');
        this.wallet = new ethers.Wallet(`${this.privateKey}`, this.provider);
    }

    // -------------下面是任务函数-------------------- //
    // async demo() {
    //     let res = await this.axios({
    //         method: "GET",
    //         url: `https://www.ip.cn/api/index?ip&type=0`,
    //     });
    //     logger.info(res?.data)
    // }
    async waitHash(hash) {
        const startTime = Date.now();
        const interval = 3000; // 轮询间隔为3秒
        while (Date.now() - startTime < 10000) {
            await sleep(interval);// 轮询间隔为3秒
            try {
                const txReceipt = await this.wallet.provider.getTransactionReceipt(hash);
                if (txReceipt && txReceipt.blockNumber) {
                    // 交易已确认
                    return txReceipt;
                }
            } catch (error) {
                // 处理错误
                console.log("Error while waiting for transaction confirmation:", error);
            }
        }
        // 超时，交易未确认
        return null;
    }
    async ticket() {
        try {
            let res = await this.axios({
                method: "GET",
                headers: {
                    'Host': 'api.xter.io',
                    'Connection': 'keep-alive',
                    'content-type': 'application/json',
                    'sensorsdatajssdkcross': `%7B%22distinct_id%22%3A%22${this.devices}%22%2C%22first_id%22%3A%22%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22identities%22%3A%22${this.identities}%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%22%2C%22value%22%3A%22%22%7D%2C%22%24device_id%22%3A%22${this.devices}%22%7D`,
                    'Authorization': `${this.id_token}`,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Accept': '*/*',
                    'Origin': 'https://xter.io',
                    'Referer': 'https://xter.io/',
                    'Accept-Language': 'zh-CN,zh;q=0.9'
                },
                url: `https://api.xter.io/palio/v1/user/${this.address}/ticket`,
            });
            return res?.data;
        } catch (error) {
            return error?.response?.data;
        }
    }

    async vote(num) {
        try {
            let res = await this.axios({
                method: "POST",
                headers: {
                    'Host': 'api.xter.io',
                    'Connection': 'keep-alive',
                    'content-type': 'application/json',
                    'sensorsdatajssdkcross': `%7B%22distinct_id%22%3A%22${this.devices}%22%2C%22first_id%22%3A%22%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22identities%22%3A%22${this.identities}%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%22%2C%22value%22%3A%22%22%7D%2C%22%24device_id%22%3A%22${this.devices}%22%7D`,
                    'Authorization': `${this.id_token}`,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Accept': '*/*',
                    'Origin': 'https://xter.io',
                    'Referer': 'https://xter.io/',
                    'Accept-Language': 'zh-CN,zh;q=0.9'
                },
                url: `https://api.xter.io/palio/v1/user/${this.address}/vote`,
                data: `{"index":0,"num":${num}}`,
            });
            return res?.data;
        } catch (error) {
            return error?.response?.data;
        }
    }

    async abiFunction(total_num,expire_time,sign){
        const abi = ["function vote(uint256,uint256,uint256,uint256,bytes) public returns (bool)"];
        const iface = new ethers.utils.Interface(abi);
        const parameters = ["0",total_num,total_num,expire_time,sign];
        //console.log(parameters)
        // const parameters = ["0",1,1,1712240562,"0x7a1280a51059b0b461b58a55066ce2632c0de03391c600bb82ebcc60a9ba62745c22f12c1f4feef8ca3e9f02327176d881ee9254cd5655b6dfe4c3f60a6398c51c"];
        // console.log(parameters)
        const encodedData = await iface.encodeFunctionData("vote", parameters);
        return encodedData;
    }

    async mint_vote(signature) {
        try {
            const gasPrice = ethers.utils.parseUnits("0.002", "gwei");
            const transaction = {
                to: '0x73e987FB9F0b1c10db7D57b913dAa7F2Dc12b4f5',
                value: ethers.utils.parseEther("0"),
                maxFeePerGas: gasPrice,
                maxPriorityFeePerGas: gasPrice,
                data: signature
            };
            transaction.gasLimit = await this.wallet.estimateGas(transaction);
            const txResponse = await this.wallet.sendTransaction(transaction);
            console.log(`mint vote hash:${txResponse.hash}`);
            let txReceipt = await this.waitHash(txResponse.hash)
            if (txReceipt !== null) {
                console.log(`mint vote success hash:${txResponse.hash}`)
            } else {
                console.log(`mint vote error hash:${txReceipt}`)
                fs.appendFileSync("mint_vote_error.txt", `${this.address}----${this.privateKey}----${this.id_token}\n`)
            }
        } catch (error) {
            console.log(`mint vote error:${error}`)
            fs.appendFileSync("mint_vote_error.txt", `${this.address}----${this.privateKey}----${this.id_token}\n`)
        }
    }



    async Run() {
        let ticket = await this.ticket();
        if (ticket?.err_code === 0) {
            let num = ticket?.data?.total_ticket;
            console.log(`ticket sum:${num}`)
            let vote = await this.vote(num);
            if (vote?.err_code === 0) {
                let total_num = vote?.data?.total_num;
                let expire_time = vote?.data?.expire_time;
                let sign = vote?.data?.sign;
                let signature = await this.abiFunction(total_num,expire_time,sign)
                console.log(`vote signature:${signature}`)
                await this.mint_vote(signature);
            }else{
                console.log(`vote error:${JSON.stringify(ticket)}`)
                fs.appendFileSync("mint_vote_error.txt", `${this.address}----${this.privateKey}----${this.id_token}\n`)
            }
        }else{
            console.log(`ticket error:${JSON.stringify(ticket)}`)
            fs.appendFileSync("mint_vote_error.txt", `${this.address}----${this.privateKey}----${this.id_token}\n`)
        }
        //console.log(await this.abiFunction('13','1712240562','0x7a1280a51059b0b461b58a55066ce2632c0de03391c600bb82ebcc60a9ba62745c22f12c1f4feef8ca3e9f02327176d881ee9254cd5655b6dfe4c3f60a6398c51c'))
    }


}



async function Run() {
    const proxy = process.env.Xiaohua_Proxy;
    for (let i = 0; i < keyPairs.length; i++) {
        const address = keyPairs[i].address;
        const privateKey = keyPairs[i].privateKey;
        const id_token = keyPairs[i].id_token;
        console.log(`【${i}】${address}:Run...`);
        const myTask = new task(address, privateKey, id_token, proxy);
        await myTask.Run();
    }
}

Run();