/**
 * 卡券逻辑
 **/
var conf = require('../config.js');
var Promise = require('bluebird');
var request = require("request");
var common = require('../common/common.js');
var fs = require('fs');
var CardDao = require('../dao/cardDao.js');
var cardDao = new CardDao();

module.exports = card = function () { };

/**
 * 上传Logo至微信
 * param filePath 文件路径
 **/
card.prototype.uploadLogo = function (filePath) {
    return new Promise(function (resolve, reject) {
        common.getToken()
        .then(function (token) {
            var formData = { buffer: fs.createReadStream(filePath) };
            var postAsync = Promise.promisify(request.post);
            return postAsync({ url: conf.wechatRoute.uploadLogo.format(token), formData: formData });
        })
        .then(function (msg) {
            var url = JSON.parse(msg.body).url;
            return cardDao.insertLogo({ url: url });
        })
        .then(function (result) {
            resolve(result);
        })
        .catch(function (err) {
            console.error('上传Logo至微信错误:' + err);
            reject(err);
        })
    })
}