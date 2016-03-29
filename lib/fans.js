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
 * 取消关注
 * param openid
 **/
fans.prototype.unsubscribe = function (openid) {
    fansDao.unsubscribe(openid)
    .then(function () { 
        console.log('已取消关注');
    })
    .catch(function (err) { 
        console.error('取消关注失败:' + err);
    })
}

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
    var nextOpenid = '';
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
        nextOpenid = fansList.next_openid;
        var openidList = fansList.data.openid;
        //循环同步粉丝数据进数据库
        Promise.map(openidList, function (openid) { 
            return self.fansInfo(openid);
        })
    })
    .then(function () {
        //如果已拉取的粉丝数小于总数，则要继续拉取
        if (nowCount < total) { 
            self.getFans(nowCount, nextOpenid);
        }
    })
    .catch(function (err) {
        console.error('拉取粉丝信息错误:' + err);
    })
}

/**
 * 从微信同步fans数据
 * param openid 粉丝openid
 **/
fans.prototype.fansInfo = function(openid) {
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
            resolve(msg);
        })
        .catch(function (err) {
            console.error('从微信同步fans数据失败:' + err);
            reject(err);
        })
    })
}