var Promise = require('bluebird');
//数据操作层
module.exports = Bot = function () { };

/**
 * 机器人消息入库
 * param item 消息(JSON) 
 **/
Bot.prototype.insertBot = function (item) {
    return new Promise(function (resolve, reject) {
        db.models['bot'].create(item, function (err, item) {
            if (err) {
                reject(err);
                return;
            }
            resolve(item);
        })
    })
}