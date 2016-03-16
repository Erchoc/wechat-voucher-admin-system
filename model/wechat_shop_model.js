//定义表结构Model
module.exports = function (db, cb) {
    //define方法的第一个参数为表名
    db.define('wechat_shop', {
        innerId: { type: 'serial', key: true } , //主键
        province: String,
        name: String,
        shopId: Number,
        appId: String,
        secretKey: String,
        apmacList: String
    });
    return cb();
}