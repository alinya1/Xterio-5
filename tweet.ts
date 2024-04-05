import Axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import { ethers } from "ethers";
import fs from "fs";


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
    }

    // -------------下面是任务函数-------------------- //
    // async demo() {
    //     let res = await this.axios({
    //         method: "GET",
    //         url: `https://www.ip.cn/api/index?ip&type=0`,
    //     });
    //     logger.info(res?.data)
    // }

    async xterio_task(task_id) {
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
                url: `https://api.xter.io/palio/v1/user/${this.address}/task`,
                data: `{"task_id":${task_id}}`
            });
            return res?.data;
        } catch (error) {
            return error?.response?.data;
        }
    }

    async Run() {

        let x1 = await this.xterio_task(17);
        if (x1?.err_cdoe === 0) {
            console.log(`17 success:${JSON.stringify(x1)}`)
        } else {
            console.log(`17 error:${JSON.stringify(x1)}`)
            fs.appendFileSync("x1_error.txt", `${this.address}----${this.privateKey}----${this.id_token}\n`)
        }

        let x2 = await this.xterio_task(18);
        if (x2?.err_cdoe === 0) {
            console.log(`18 success:${JSON.stringify(x2)}`)
        } else {
            console.log(`18 error:${JSON.stringify(x2)}`)
            fs.appendFileSync("x2_error.txt", `${this.address}----${this.privateKey}----${this.id_token}\n`)
        }

        let x3 = await this.xterio_task(13);
        if (x3?.err_cdoe === 0) {
            console.log(`13 success:${JSON.stringify(x3)}`)
        } else {
            console.log(`13 error:${JSON.stringify(x3)}`)
            fs.appendFileSync("x3_error.txt", `${this.address}----${this.privateKey}----${this.id_token}\n`)
        }

        let x4 = await this.xterio_task(14);
        if (x4?.err_cdoe === 0) {
            console.log(`14 success:${JSON.stringify(x4)}`)
        } else {
            console.log(`14 error:${JSON.stringify(x4)}`)
            fs.appendFileSync("x4_error.txt", `${this.address}----${this.privateKey}----${this.id_token}\n`)
        }


    }


}

/*
* Pet Your Palio:11
* Cumulative Petting:15
* Claim Al Chat Boost:12
* Follow XterioGames on X:17
* Share Al Chatting Resylt:18
* Retweet a Tweet:13
* Like This Tweet:14
* 16
*/
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