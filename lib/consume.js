var ConsumeDao = require('../dao/consumeDao');
var consumedao = new ConsumeDao();
var Promise = require('bluebird');
module.exports = Consume = function () { };

/**
 *  核销入库
 *  param consumeData 核销数据
 **/
Consume.prototype.consume = function (consumeData) {
    return new Promise(function (resolve, reject) {
        //数据入库
        consumedao.insertConsume(consumeData)
        .then(function () {
            var cardid = consumeData.cardid;
            resolve(cardid);
        })
        .catch(function (err) { 
            reject(err);
        })
    })
    
}