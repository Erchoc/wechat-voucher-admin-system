/**
 * 服务器(用来接收微信推送的事件)
 **/
var Promise = require('bluebird');
var Fans = require('../lib/fans');
var fans = new Fans();
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
    switch (xmlData.msgtype) {
        case 'event':
            switch (xmlData.event) {
                case 'subscribe':
                    fans.fansInfo(xmlData.fromusername);
                    break;
                case 'unsubscribe':
                    fans.unsubscribe(xmlData.fromusername);
                    break;
            }
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