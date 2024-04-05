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
        // ethers参数
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

    async palio1() {
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
                url: `https://api.xter.io/palio/v1/user/${this.address}/prop`,
                data: { "prop_id": 1 }
            });
            return res?.data;
        } catch (error) {
            return error?.response?.data;
        }
    }

    async palio2() {
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
                url: `https://api.xter.io/palio/v1/user/${this.address}/prop`,
                data: { "prop_id": 2 }
            });
            return res?.data;
        } catch (error) {
            return error?.response?.data;
        }
    }

    async palio3() {
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
                url: `https://api.xter.io/palio/v1/user/${this.address}/prop`,
                data: { "prop_id": 3 }
            });
            return res?.data;
        } catch (error) {
            return error?.response?.data;
        }
    }

    async task_(task_id) {
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
        //喂apple
        let palio1 = await this.palio1();
        if (palio1?.err_code === 0) {
            console.log(`palio1 success:${JSON.stringify(palio1)}`)
        }else if(palio1?.err_msg === "no balance"){
            console.log(`palio1 success:${JSON.stringify(palio1)}`)
        }else{
            console.log(`palio1 error:${JSON.stringify(palio1)}`)
            fs.appendFileSync("palio1_error.txt", `${this.address}----${this.privateKey}----${this.id_token}\n`)
        }
        //喂duck
        let palio2 = await this.palio2();
        if (palio2?.err_code === 0) {
            console.log(`palio2 success:${JSON.stringify(palio2)}`)
        }else if(palio2?.err_msg === "no balance"){
            console.log(`palio2 success:${JSON.stringify(palio2)}`)
        }else{
            console.log(`palio2 error:${JSON.stringify(palio2)}`)
            fs.appendFileSync("palio2_error.txt", `${this.address}----${this.privateKey}----${this.id_token}\n`)
        }
        //喂CD
        let palio3 = await this.palio3();
        if (palio3?.err_code === 0) {
            console.log(`palio3 success:${JSON.stringify(palio3)}`)
        }else if(palio3?.err_msg === "no balance"){
            console.log(`palio3 success:${JSON.stringify(palio3)}`)
        }else{
            console.log(`palio3 error:${JSON.stringify(palio3)}`)
            fs.appendFileSync("palio3_error.txt", `${this.address}----${this.privateKey}----${this.id_token}\n`)
        }
        //领取每日
        let task11 = await this.task_(11);
        if (task11?.err_code === 0) {
            console.log(`task11 success:${JSON.stringify(task11)}`)
        }else{
            console.log(`task11 error:${JSON.stringify(task11)}`)
            fs.appendFileSync("task11_error.txt", `${this.address}----${this.privateKey}----${this.id_token}\n`)
        }

        for (let index = 0; index < 2; index++) {
            let task15 = await this.task_(15);
            if (task15?.err_code === 0) {
                console.log(`task15 success:${JSON.stringify(task15)}`)
            }else{
                console.log(`task15 error:${JSON.stringify(task15)}`)
            }
        }
    }
}


async function Run() {
    for (let i = 0; i < keyPairs.length; i++) {
        const address = keyPairs[i].address;
        const privateKey = keyPairs[i].privateKey;
        const id_token = keyPairs[i].id_token;
        console.log(`【${i}】${address}:Run...`);
        const myTask = new task(address, privateKey, id_token, 'http://user-xiaohuacc1:xiaohuacc1@pr.roxlabs.cn:4600');
        await myTask.Run();
    }
}

Run();