//定义表结构Model
module.exports = function (db, cb) {
    //define方法的第一个参数为表名
    db.define('bot', {
        id: { type: 'serial', key: true } , //主键
        openid: String,
        msg: String,
        response: String,
        time: String,
    });
    return cb();
}