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

/**
 * 获取卡券详细信息
 * param cardid 卡券id
 **/
card.prototype.getCardInfo = function (cardid) {
    var cardInfo = {};
    return new Promise(function (resolve, reject) {
        common.getToken()
        .then(function (token) {
            var data = { card_id: cardid };
            var postAsync = Promise.promisify(request.post);
            return postAsync({ url: conf.wechatRoute.getCardInfo.format(token), body: JSON.stringify(data) });
        })
        .then(function (msg) {
            var card = JSON.parse(msg.body);
            if (card.errcode == 0) {
                //解析数据并拼装
                var node = card.card.card_type.toLowerCase();
                cardInfo.cardid = card.card[node].base_info.id;
                cardInfo.cardtype = card.card.card_type;
                cardInfo.cardname = card.card[node].base_info.title;
                cardInfo.quantity = card.card[node].base_info.sku.quantity;
                cardInfo.total_quantity = card.card[node].base_info.sku.total_quantity;
                cardInfo.status = card.card[node].base_info.status;
                return cardDao.isExists(cardInfo.cardid);
            } else { 
                throw new Error('微信返回错误code:' + card.errcode + ';错误信息:' + card.errmsg);
            }
        })
        .then(function (exists) {
            //如果存在则更新数据库卡券数据,否则做插入动作;
            if (exists) {
                return cardDao.updateCard(cardInfo);
            } else {
                return cardDao.insertCard(cardInfo);
            }
        })
        .then(function () { 
            resolve();
        })
        .catch(function (err) {
            console.error('获取卡券详细信息错误:' + err);
            reject(err);
        })
    })
}

/**
 * 获取卡券列表
 * param offset 偏移量
 * param statusArray 卡券状态
 **/
card.prototype.getCardList = function (offset, statusArray) {
    //该商户名下卡券ID总数。
    var total = 0;
    var self = this;
    common.getToken()
        .then(function (token) {
        var data = { offset: offset, count: 10, status_list: statusArray };
        var postAsync = Promise.promisify(request.post);
        return postAsync({ url: conf.wechatRoute.getCardList.format(token), body: JSON.stringify(data) });
    })
        .then(function (msg) {
        var result = JSON.parse(msg.body);
        //微信正确返回信息
        if (result.errcode == 0) {
            total = result.total_num;
            //偏移量
            offset = result.card_id_list.length;
            Promise.map(result.card_id_list, function (cardid) {
                return self.getCardInfo(cardid);
            })
        } else {
            throw new Error('微信返回错误code:' + result.errcode + ';错误信息:' + result.errmsg);
        }
    })
        .then(function () {
        //如果偏移量小于总数，则循环拉取卡券列表
        if (offset < total) {
            self.getCardList(offset, statusArray);
        }
    })
        .catch(function (err) {
        console.error('上传Logo至微信错误:' + err);
    })
}