var Promise = require('bluebird');
//数据操作层
module.exports = Consume = function () { };

/**
 * 核销信息入库
 * param item 核销数据(JSON) 
 **/
Consume.prototype.insertConsume = function (item) {
    return new Promise(function (resolve, reject) {
        db.models['consume'].create(item, function (err, item) {
            if (err) {
                reject(err);
                return;
            }
            resolve(item);
        })
    })
}