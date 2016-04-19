var BotDao = require('../dao/botDao');
var botdao = new BotDao();
var Promise = require('bluebird');
module.exports = Bot = function () { };

/**
 *  机器人消息入库
 *  param botData 消息数据
 **/
Bot.prototype.insert = function (botData) {
    return new Promise(function (resolve, reject) {
        //数据入库
        botdao.insertBot(botData)
        .then(function (msg) {
            resolve(msg);
        })
        .catch(function (err) {
            reject(err);
        })
    })
    
}