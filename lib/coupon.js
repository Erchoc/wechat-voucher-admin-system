/**
 * 卡券逻辑
 **/
var conf = require('../config.js');
var Promise = require('bluebird');
var request = require("request");
var common = require('../common/common.js');
var fs = require('fs');
var CouponDao = require('../dao/couponDao.js');
var couponDao = new CouponDao();

module.exports = Coupon = function () { };

/**
 * 上传Logo至微信
 * param filePath 文件路径
 **/
Coupon.prototype.uploadLogo = function (filePath) {
    return new Promise(function (resolve, reject) {
        common.getToken()
        .then(function (token) {
            var formData = { buffer: fs.createReadStream(filePath) };
            var postAsync = Promise.promisify(request.post);
            return postAsync({ url: conf.wechatRoute.uploadLogo.format(token), formData: formData });
        })
        .then(function (msg) {
            var url = JSON.parse(msg.body).url;
            return couponDao.insertLogo({ url: url });
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
Coupon.prototype.getCouponInfo = function (cardid) {
    var cardInfo = {};
    return new Promise(function (resolve, reject) {
        common.getToken()
        .then(function (token) {
            var data = { card_id: cardid };
            var postAsync = Promise.promisify(request.post);
            return postAsync({ url: conf.wechatRoute.getCouponInfo.format(token), body: JSON.stringify(data) });
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
                return couponDao.isExists(cardInfo.cardid);
            } else {
                throw new Error('微信返回错误code:' + card.errcode + ';错误信息:' + card.errmsg);
            }
        })
        .then(function (exists) {
            //如果存在则更新数据库卡券数据,否则做插入动作;
            if (exists) {
                return couponDao.updateCoupon(cardInfo);
            } else {
                return couponDao.insertCoupon(cardInfo);
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
Coupon.prototype.getCouponList = function (offset, statusArray) {
    //该商户名下卡券ID总数。
    var total = 0;
    var self = this;
    common.getToken()
        .then(function (token) {
        var data = { offset: offset, count: 10, status_list: statusArray };
        var postAsync = Promise.promisify(request.post);
        return postAsync({ url: conf.wechatRoute.getCouponList.format(token), body: JSON.stringify(data) });
    })
        .then(function (msg) {
        var result = JSON.parse(msg.body);
        //微信正确返回信息
        if (result.errcode == 0) {
            total = result.total_num;
            //偏移量
            offset = result.card_id_list.length;
            Promise.map(result.card_id_list, function (cardid) {
                return self.getCouponInfo(cardid);
            })
        } else {
            throw new Error('微信返回错误code:' + result.errcode + ';错误信息:' + result.errmsg);
        }
    })
        .then(function () {
        //如果偏移量小于总数，则循环拉取卡券列表
        if (offset < total) {
            self.getCouponList(offset, statusArray);
        }
    })
        .catch(function (err) {
        console.error('获取卡券列表错误:' + err);
    })
}

/**
 * 发放卡券
 * param toUser 发送的Openid，可以是单个，多个时为array
 * cardid 发送卡券id
 **/
Coupon.prototype.grantCoupon = function (toUser, cardid) {
    var accessToken = '';
    return new Promise(function (resolve, reject) {
        common.getToken()
        .then(function (token) {
            accessToken = token;
            return common.getTicket();
        })
        .then(function (ticket) {
            var timestamp = Date.parse(new Date()) / 1000;
            var signature = common.signature(ticket, timestamp, cardid);
            //组装请求微信数据
            var card_ext = {};
            card_ext.code = '';
            card_ext.openid = '';
            card_ext.timestamp = timestamp;
            card_ext.singature = signature;
            var wxcard = {};
            wxcard.card_id = cardid;
            wxcard.card_ext = JSON.stringify(card_ext);
            var obj = {};
            obj.touser = toUser;
            obj.msgtype = 'wxcard';
            obj.wxcard = wxcard;
            var postAsync = Promise.promisify(request.post);
            return postAsync({ url: conf.wechatRoute.grantCoupon.format(accessToken), body: JSON.stringify(obj) });
        })
        .then(function (result) {
            var resData = JSON.parse(result.body);
            if (resData.errcode == 0) {
                resolve();
            } else {
                throw new Error(resData.errcode + ';' + resData.errmsg);
            }
        })
        .catch(function (err) {
            console.error('发放卡券错误:' + err);
            reject(err);
        })
    })
}