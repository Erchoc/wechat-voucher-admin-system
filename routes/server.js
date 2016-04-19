/**
 * 服务器(用来接收微信推送的事件)
 **/
var Promise = require('bluebird');
var request = require('request');
var Fans = require('../lib/fans');
var fans = new Fans();
var Consume = require('../lib/consume');
var consume = new Consume();
var Coupon = require('../lib/coupon');
var coupon = new Coupon();
var Bot = require('../lib/bot');
var bot = new Bot();
var conf = require('../config.js');
module.exports.autoroute = {
    get: {
        '/server/event'  : signature //用于服务器第一次接入认证
    },
    post: {
        '/server/event'  : event //用于服务器第一次接入认证
    }
};

/**
 * 接收服务器推送事件
 **/
function event(req, res) {
    var xmlData = req.body.xml;
    var resStr = '';
    switch (xmlData.msgtype) {
        //接收文本消息
        case 'text':
            var requestAsync = Promise.promisify(request);
            //请求人工智能，获得返回的数据
            requestAsync(conf.bot.format(encodeURIComponent(xmlData.content)))
            .then(function (msg) {
                msg = msg.body;
                resStr = passiveRes('text', xmlData.fromusername, xmlData.tousername, msg);
                res.send(resStr);
                var botData = { openid: xmlData.fromusername, msg: xmlData.content, response: msg, time: xmlData.createtime };
                bot.insert(botData).then(function () { console.log('机器人信息入库成功。') })
                .catch(function (err) { console.error('机器人信息入库失败:' + err) }); 
            })
            .catch(function (err) {
                console.error(err);
                res.send('');
            })
            break;
        case 'event':
            switch (xmlData.event) {
                //关注
                case 'subscribe':
                    fans.fansInfo(xmlData.fromusername);
                    break;
                //上报地理位置
                case 'LOCATION':
                    fans.updateLocation(xmlData)
                    .then(function () {
                        console.log('更新地理位置成功');
                    })
                    .catch(function (err) {
                        console.error('更新地位位置失败:' + err);
                    })
                    break;
                //取消关注
                case 'unsubscribe':
                    fans.unsubscribe(xmlData.fromusername);
                    break;
                //用户核销卡券
                case 'user_consume_card':
                    consume.consume(xmlData)
                    .then(function (cardid) {
                        return coupon.updateQuantity(cardid);
                    })
                    .then(function () {
                        console.log('核销成功');
                    })
                    .catch(function (err) {
                        console.error('核销失败:' + err);
                    })
                    break;
                //用户买单
                case 'User_pay_from_pay_cell':
                    console.log(JSON.stringify(xmlData));
                    break;
                    
            }
            res.send('');
            break;
        default :
            break;
    }
    
}


/**
 * 用于服务器第一次接入认证
 **/
function signature(req, res) {
    var signature = req.query.signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;
    if (checkSignature(signature, timestamp, nonce)) {
        res.send(echostr);
    } else {
        res.send('');
    }
}

/**
 * 检查是否是由微信发送的请求
 **/
function checkSignature(signature, timestamp, nonce) {
    var token = 'wechat';
    var array = [];
    array.push(token);
    array.push(timestamp);
    array.push(nonce);
    
    var str = array.sort().toString().replace(/,/g, '');
    var crypto = require('crypto');
    var md5sum = crypto.createHash('sha1');
    md5sum.update(str, 'utf-8');
    str = md5sum.digest('hex');
    if (signature == str) {
        return true;
    } else {
        return false;
    }
}
exports.signature = signature;

/**
 * 被动回复
 * type 消息类型
 * toUserName 接收者账号
 * fromUserName 开发者微信号
 * content 消息内容
 **/
function passiveRes(type,toUserName,fromUserName,content) {
    switch (type) {
        //被动回复文本消息
        case 'text':
            return conf.passiveTemplate.text.format(toUserName, fromUserName, new Date().valueOf(), content);
            break;
        default :
            break;
    }
}
