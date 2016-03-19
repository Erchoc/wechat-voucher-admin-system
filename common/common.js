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
            }
            resolve(token);
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