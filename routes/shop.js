/**
 * 门店路由
 */
var Shop = require('../dao/shopDao');
var shop = new Shop();

module.exports.autoroute = {
    get: {
        '/shop/shopList/query' : getShopList,  //获取门店列表
    },
    post: {
    }
};

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