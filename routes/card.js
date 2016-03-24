/**
 * 卡券路由
 */
var Card = require('../dao/cardDao');
var card = new Card();
var CardLib = require('../lib/card');
var cardlib = new CardLib();

module.exports.autoroute = {
    get: {
        '/card/cardList/query' : getCardList,  //获取卡券列表
        '/card/grantCard/operation' : grantCard //投放卡券
    },
    post: {
    }
};

/**
 *  获取卡券列表
 **/
function getCardList(req, res) {
    card.getCardList()
    .then(function (cards) {
        res.jsonp(cards);
    })
    .catch(function (err) {
        console.error(err);
        res.jsonp(err);
    })
}

function grantCard(req, res) {
    var toUser = req.query.touser;
    var cardid = req.query.cardid;
    cardlib.grantCard(toUser, cardid)
    .then(function () { 
        res.jsonp(true);
    })
    .catch(function (err) { 
        res.jsonp(false);
    })
} 