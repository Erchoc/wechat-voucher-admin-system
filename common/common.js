//公用函数

var Promise = require('bluebird');
var request = Promise.promisify(require("request"));
var conf = require('../config.js');
//字符串格式化
String.prototype.format = function (args) {
    if (arguments.length > 0) {
        var result = this;
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                var reg = new RegExp("({" + key + "})", "g");
                result = result.replace(reg, args[key]);
            }
        } 
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] == undefined) {
                    return "";
                } 
                else {
                    var reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
        return result;
    } 
    else {
        return this;
    }
}

/**
 * 获取token
 **/
function getToken() {
    return new Promise(function (resolve, reject) {
        redis.get('token')
        .then(function (token) {
            if (!token) {
                return request(conf.wechatRoute.getToken);
            } else {
                resolve(token)
            };
        }).then(function (wechatRes) {
            //如果wechatRes有值，说明有从微信获取token回来
            if (wechatRes) {
                var accessToken = JSON.parse(wechatRes.body).access_token;
                //微信token为7200过期，这里设置了7000以防万一
                redis.setex('token', 7000, accessToken);
                resolve(accessToken);
            }
        }).catch(function (err) {
            reject('获取token失败:' + err);
        })
    })
}
exports.getToken = getToken;


/**
 *  获取api_ticket
 **/
function getTicket() {
    return new Promise(function (resolve, reject) {
        var accessToken = '';
        getToken()
        .then(function (token) {
            accessToken = token;
        })
        .then(function () {
            return redis.get('apiTicket');
        })
        .then(function (apiTicket) {
            if (!apiTicket) {
                return request(conf.wechatRoute.getTicket.format(accessToken));
            } else {
                resolve(apiTicket);
            }
        }).then(function (wechatRes) {
            //如果wechatRes有值，说明有从微信获取token回来
            if (wechatRes) {
                var result = JSON.parse(wechatRes.body);
                if (result.errcode == 0) {
                    var apiTicket = result.ticket;
                    //微信token为7200过期，这里设置了7000以防万一
                    redis.setex('apiTicket', 7000, apiTicket);
                    resolve(apiTicket);
                } else { 
                    throw new Error(result.errcode + ';' + result.errmsg);
                }
            }
        }).catch(function (err) {
            reject('获取apiTicket失败:' + err);
        })
    })
}
exports.getTicket = getTicket;

/**
 *  生成发送卡券的签名
 **/
function signature(apiTicket,timestamp,cardid) {
    var array = [];
    array.push(apiTicket);
    array.push(timestamp);
    array.push(cardid);

    var str = array.sort().toString().replace(/,/g, '');
    var crypto = require('crypto');
    var md5sum = crypto.createHash('sha1');
    md5sum.update(str, 'utf-8');
    str = md5sum.digest('hex');
    return str;
}
exports.signature = signature;

/*
** randomWord 产生任意长度随机字母数字组合
** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
*/
function randomWord(randomFlag, min, max) {
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    
    // 随机产生
    if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
    }
    for (var i = 0; i < range; i++) {
        pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
}
exports.randomWord = randomWord;
