var shopDAO = require('../dao/shopDAO.js');
var shop = new shopDAO();
//路由层
module.exports.autoroute = {
    get: {
        '/getShop/query' : getShop
    },
    post: {
    }
};

function getShop(req, res) {
    //调用数据库操作层查询数据
    shop.query({ province: "江苏省"})
    .then(function (shop) { 
        res.jsonp(shop);
    })
    .catch(function (err) {
        console.error(err);
        res.jsonp(false);
    })
}