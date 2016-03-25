/**
 * 粉丝路由
 */
var Fans = require('../dao/fansDao');
var fans = new Fans();

module.exports.autoroute = {
    get: {
        '/fans/fansList/query' : getFansList,  //获取粉丝列表
    },
    post: {
    }
};

/**
 *  获取粉丝列表
 **/
function getFansList(req, res) {
    fans.getFansList()
    .then(function (fans) {
        res.jsonp({ status: 200, msgBody: fans });
    })
    .catch(function (err) {
        console.error(err);
        res.jsonp({ status: -1, msgBody: err });
    })
}