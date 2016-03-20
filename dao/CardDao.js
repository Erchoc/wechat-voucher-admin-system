var Promise = require('bluebird');
//数据操作层
module.exports = Card = function () { };


/**
 * Logo地址入库
 * param item logo数据(JSON)
 **/
Card.prototype.insertLogo = function (item) {
    return new Promise(function (resolve, reject) {
        db.models['logo'].create(item, function (err, item) {
            if (err) {
                reject(err);
                return;
            }
            resolve(item);
        })
    })
}

/**
 *  获取logo列表
 **/
 Card.prototype.logoList = function () {
    return new Promise(function (resolve, reject) {
        db.models['logo'].find({}, function (err, logos) {
            if (err) {
                reject(err);
                return;
            }
            resolve(item);
        })
    })
}