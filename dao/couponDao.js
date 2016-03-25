var Promise = require('bluebird');
//数据操作层
module.exports = Coupon = function () { };


/**
 * Logo地址入库
 * param item logo数据(JSON)
 **/
Coupon.prototype.insertLogo = function (item) {
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
 Coupon.prototype.logoList = function () {
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

/**
 * 卡券信息入库
 * param item 卡券数据(JSON) 
 **/
Coupon.prototype.insertCoupon = function (item) {
    return new Promise(function (resolve, reject) {
        db.models['card'].create(item, function (err, item) {
            if (err) {
                reject(err);
                return;
            }
            resolve(item);
        })
    })
}

/**
 * 根据cardid判断卡券是否存在
 * param cardid 
 **/
Coupon.prototype.isExists = function (cardid) {
    return new Promise(function (resolve, reject) {
        db.models['card'].exists({ cardid: cardid }, function (err, exists) {
            if (err) {
                reject(err);
                return;
            }
            resolve(exists);
        })
    })
}

/**
 * 更新卡券数据信息
 * param item 卡券数据(JSON)
 **/
 Coupon.prototype.updateCoupon = function (item) {
    return new Promise(function (resolve, reject) {
        db.models['card'].find({ cardid: item.cardid }).each(function (card) {
            card.cardtype = item.cardtype;
            card.cardname = item.cardname;
            card.quantity = item.quantity;
            card.total_quantity = item.total_quantity;
            card.status = item.status;
        }).save(function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        })
    })
}

/**
 *  获取卡券列表
 **/
Coupon.prototype.getCouponList = function () {
    return new Promise(function (resolve, reject) {
        db.models['card'].find({ status: ['CARD_STATUS_VERIFY_OK','CARD_STATUS_DISPATCH'] }, function (err, cards) {
            if (err) {
                reject(err);
                return;
            }
            resolve(cards);
        })
    })
}