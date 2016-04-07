/**
 * 门店业务逻辑
 **/
var conf = require('../config.js');
var Promise = require('bluebird');
var common = require('../common/common.js');
var ShopDao = require('../dao/shopDao.js');
var request = require('request');
var shopDao = new ShopDao();
module.exports = Shop = function () { };

/**
 *  微信Othur获得code换取openid
 **/
Shop.prototype.getOpenid = function (code) {
    return new Promise(function (resolve,reject) {
        var requestAsync = Promise.promisify(request);
        requestAsync(conf.wechatRoute.getOpenid.format(code))
        .then(function (msg) {
            msg = JSON.parse(msg.body);
            resolve(msg.openid);
        })
        .catch(function (err) { 
            reject(err);
        })
    })
}

/**
 *  获取门店列表
 *  param begin 开始拉取的条数
 **/
Shop.prototype.getShops = function (begin) {
    var self = this;
    //门店返回的总数
    var total = 0;
    //获取token
    common.getToken()
    .then(function (token) {
        var postAsync = Promise.promisify(request.post);
        //请求微信服务器，获取门店列表
        return postAsync({ url: conf.wechatRoute.getShops.format(token), body: JSON.stringify({ begin: begin, limit: 50 }) });
    })
    .then(function (shops) {
        shopList = JSON.parse(shops.body);
        total = shopList['business_list'].length;
        Promise.map(shopList['business_list'], function (business) {
            business['base_info'].photo_list = JSON.stringify(business['base_info'].photo_list);
            return self.insertDB(business['base_info']);
        })
    })
     .then(function () {
        //如果当前拉取条数等于50，则继续拉取
        if (total == 50) {
            self.getShops(begin + 50);
        }
    })
    .catch(function (err) {
        console.error('拉取粉丝信息错误:' + err);
    })
}

/**
 *  更新门店数据库
 *  param item 数据
 **/
Shop.prototype.insertDB = function (item) {
    return new Promise(function (resolve, reject) {
        shopDao.isExists(item.poi_id)
        .then(function (exists) { 
            if (exists) {
                return shopDao.update(item);
            } else {
                return shopDao.insert(item);
            }
        })
        .then(function (msg) {
            resolve(msg);
        })
        .catch(function (err) {
            console.error('门店信息入库失败:' + err);
            reject(err);
        })
    })
}