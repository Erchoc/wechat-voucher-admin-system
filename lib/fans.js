/**
 * 粉丝业务逻辑
 **/
var conf = require('../config.js');
var Promise = require('bluebird');
var request = Promise.promisify(require("request"));
var common = require('../common/common.js');
var FansDao = require('../dao/fansDao.js');
var fansDao = new FansDao();
module.exports = fans = function () { };

/**
 * 拉取粉丝信息
 * param  newCount 已拉取的fans数量
 * param  token 访问令牌
 * param  nextOpenid 下一次拉取的开始Openid
 **/
fans.prototype.getFans = function (nowCount, nextOpenid) {
    var self = this;
    //粉丝总数
    var total = 0;
    //获取token
    common.getToken()
    .then(function (token) {
        //请求微信服务器，获取fans列表
        return request(conf.wechatRoute.getFans.format(token, nextOpenid))
    })
    .then(function (fansList) {
        fansList = JSON.parse(fansList.body);
        nowCount += fansList.count;
        total = fansList.total;
        var openidList = fansList.data.openid;
        Promise.map(openidList, function (openid) { 
            return fansInfo(openid);
        })
    })
    .catch(function (err) {
        console.error('拉取粉丝信息错误:' + err);
    })
}

/**
 * 从微信同步fans数据
 * param openid 粉丝openid
 **/
function fansInfo(openid) {
    var fanInfo = {};
    return new Promise(function (resolve, reject) {
        //获取token
        common.getToken()
        .then(function (token) { 
            return request(conf.wechatRoute.getFansInfo.format(token, openid));
        })
        .then(function (wechatRes) {
            fanInfo = JSON.parse(wechatRes.body);
            //查询数据库是否存在该粉丝数据
            return fansDao.isExists(fanInfo.openid);
        })
        .then(function (exists) {
            //如果存在则更新数据库粉丝数据,否则做插入动作;
            if (exists) { 
                return fansDao.update(fanInfo);
            } else { 
                return fansDao.insert(fanInfo);
            }
        })
        .then(function (msg) {
            console.log(msg);
            resolve(msg);
        })
        .catch(function (err) {
            console.error('从微信同步fans数据失败:' + err);
            reject(err);
        })
    })
}