//定义表结构Model
module.exports = function (db, cb) {
    //define方法的第一个参数为表名
    db.define('card', {
        id: { type: 'serial', key: true } , //主键
        cardid: String,
        cardtype: String,
        cardname: String,
        quantity: String,
        total_quantity: String,
        status: String
    });
    return cb();
}