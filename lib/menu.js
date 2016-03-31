var Promise = require('bluebird');
var request = require('request');
var conf = require('../config.js');
var common = require('../common/common.js');
module.exports = Menu = function () { };

Menu.prototype.createMenu = function (obj) {
    return new Promise(function (resolve, reject) {
        common.getToken()
        .then(function (token) {
            var postAsync = Promise.promisify(request.post);
            return postAsync({ url: conf.wechatRoute.createMenu.format(token), body: JSON.stringify(obj) });
        })
        .then(function (msg) {
            var result = JSON.parse(msg.body);
            if (result.errcode == 0) {
                resolve();
            } else {
                throw new Error(result.errmsg);
            }
        })
        .catch(function (err) {
            console.error('创建菜单错误:' + err);
        })
    })
}