/**
 * 卡券路由
 */
var Coupon = require('../dao/couponDao');
var coupon = new Coupon();
var CouponLib = require('../lib/coupon');
var couponlib = new CouponLib();

module.exports.autoroute = {
    get: {
        '/coupon/couponList/query' : getCouponList //获取卡券列表
    },
    post: {
        '/coupon/grantCoupon/operation' : grantCoupon //投放卡券
    }
};

/**
 *  获取卡券列表
 **/
function getCouponList(req, res) {
    coupon.getCouponList()
    .then(function (coupons) {
        res.jsonp({ status: 200, msgBody: coupons });
    })
    .catch(function (err) {
        console.error(err);
        res.jsonp({ status: -1, msgBody: err });
    })
}

function grantCoupon(req, res) {
    var toUser = req.body.touser;
    var cardid = req.body.cardid;
    couponlib.grantCoupon(toUser, cardid)
    .then(function () {
        res.jsonp({ status: 200, msgBody: true });
    })
    .catch(function (err) {
        res.jsonp({ status: -1, msgBody: err });
    })
} 