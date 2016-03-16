var Promise = require('bluebird');
//数据操作层
module.exports = shop = function () { };

shop.prototype.query = function (opts) {
    return new Promise(function (resolve, reject) { 
        db.models['wechat_shop'].find(opts, function (err, shop) {
            if (err) {
                reject(err);
                return;
            }
            resolve(shop);
        })
    })
}