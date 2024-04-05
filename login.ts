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
const data = fs.readFileSync('account.txt', 'utf8');
const data_array = data.split("\n").filter(line => line.trim() !== '');
const keyPairs = [];
data_array.forEach(line => {
    const [address, privateKey] = line.trim().split('----');
    keyPairs.push({ address, privateKey });
});

class task {
    //构造函数 创建对象初始化对象属性
    constructor(address,privateKey,proxy) {
        // 固定参数
        this.proxyAgent = new HttpsProxyAgent(proxy);
        this.axios = Axios.create({
            proxy: false,
            httpsAgent: this.proxyAgent,
        });
        this.address = address;
        this.privateKey = privateKey;
        // 项目函数可调整
        this.devices = `18e9d${getRandomString(10)}-${getRandomString(15)}-26001b51-2073600-18e9d${getRandomString(10)}`
        this.identities = Buffer.from(this.devices).toString('base64');
    }

    // -------------下面是任务函数-------------------- //
    // async demo() {
    //     let res = await this.axios({
    //         method: "GET",
    //         url: `https://www.ip.cn/api/index?ip&type=0`,
    //     });
    //     logger.info(res?.data)
    // }

    // 获取登录签名信息
    async wallet_message() {
        try {
            let res = await this.axios({
                method: "GET",
                headers: {
                    'Host': 'api.xter.io',
                    'Connection': 'keep-alive',
                    'content-type': 'application/json',
                    'sensorsdatajssdkcross': `%7B%22distinct_id%22%3A%22${this.devices}%22%2C%22first_id%22%3A%22%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22identities%22%3A%22${this.identities}%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%22%2C%22value%22%3A%22%22%7D%2C%22%24device_id%22%3A%22${this.devices}%22%7D`,
                    'Authorization': '',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Accept': '*/*',
                    'Origin': 'https://xter.io',
                    'Referer': 'https://xter.io/',
                    'Accept-Language': 'zh-CN,zh;q=0.9'
                },
                url: `https://api.xter.io/account/v1/login/wallet/${this.address}`,
            });
            return res?.data?.data;
        } catch (error) {
            return error?.response?.data;
        }
    }

    // 签名信息
    async signMessage(message) {
        const wallet = new ethers.Wallet(this.privateKey);
        let signature = await wallet.signMessage(message);
        return signature;
    }

    // 登录
    async wallet_login(sign) {
        try {
            let res = await this.axios({
                method: "POST",
                headers: {
                    'Host': 'api.xter.io',
                    'Connection': 'keep-alive',
                    'content-type': 'application/json',
                    'sensorsdatajssdkcross': `%7B%22distinct_id%22%3A%22${this.devices}%22%2C%22first_id%22%3A%22%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22identities%22%3A%22${this.identities}%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%22%2C%22value%22%3A%22%22%7D%2C%22%24device_id%22%3A%22${this.devices}%22%7D`,
                    'Authorization': '',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Accept': '*/*',
                    'Origin': 'https://xter.io',
                    'Referer': 'https://xter.io/',
                    'Accept-Language': 'zh-CN,zh;q=0.9'
                },
                url: 'https://api.xter.io/account/v1/login/wallet',
                data: `{"address":"${this.address}","type":"eth","sign":"${sign}","provider":"METAMASK","invite_code":""}`
            });
            return res?.data;
        } catch (error) {
            return error?.response?.data;
        }
    }

    async Run(){

        let wallet_message = await this.wallet_message()
        if (wallet_message?.message != undefined) {
            let signMessage = await this.signMessage(wallet_message?.message);
            let wallet_login = await this.wallet_login(signMessage)
            if (wallet_login?.err_code === 0) {
                console.log(`login success:${this.address}`)
                fs.appendFileSync("login_success.txt", `${this.address}----${this.privateKey}----${wallet_login?.data?.id_token}\n`)
            }else{
                console.log(`${this.address}:${wallet_login}`)
                fs.appendFileSync("login_error.txt", `${this.address}----${this.privateKey}\n`)
            }
        }else{
            console.log(`${this.address}:${wallet_message}`)
            fs.appendFileSync("login_error.txt", `${this.address}----${this.privateKey}\n`)
        }
        

    }


}


async function Run(){
    const proxy = process.env.Xiaohua_Proxy;
    for (let i = 0; i < keyPairs.length; i++) {
        //let sleep_time = getRandomInt(1, 120)
        //console.log(new Date(), "等", sleep_time, "秒")
        //await sleep(sleep_time * 1000)
        const address = keyPairs[i].address;
        const privateKey = keyPairs[i].privateKey;
        console.log(`【${i}】${address}:Run...`);
        const myTask = new task(address,privateKey,proxy);
        await myTask.Run();
    }
}

Run();