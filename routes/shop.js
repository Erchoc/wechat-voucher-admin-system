/**
 * 门店路由
 */
var Shop = require('../dao/shopDao');
var shop = new Shop();
var conf = require('../config.js');

module.exports.autoroute = {
    get: {
        '/shop/shopList/query' : getShopList,  //获取门店列表
        '/shop/shopCode/query' : getOpenid //微信Othur获得code换取openid
    },
    post: {
    }
};

/**
 *  微信Othur获得code换取openid
 **/
function getOpenid(req, res) {
    var code = req.query.code;
    var Shoplib = require('../lib/shop');
    var shoplib = new Shoplib();
    shoplib.getOpenid(code)
    .then(function (openid) { 
        console.log('换取Openid:' + openid);
        res.redirect(conf.redirectShop + '?openid=' + openid);
    })
    .catch(function (err) { 
        console.error('code换取openid失败:' + err);
    })
}

/**
 *  获取门店列表
 **/
function getShopList(req, res) {
    var openid = req.query.openid;
    var order = req.query.order;
    shop.getShopList(openid, order)
    .then(function (shops) {
        res.jsonp({ status: 200, msgBody: shops });
    })
    .catch(function (err) {
        console.error(err);
        res.jsonp({ status: -1, msgBody: err });
    })
}