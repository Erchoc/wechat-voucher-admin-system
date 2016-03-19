//定义表结构Model
module.exports = function (db, cb) {
    //define方法的第一个参数为表名
    db.define('fansInfo', {
        id: { type: 'serial', key: true } , //主键
        openid: String,
        nickname: String,
        sex: Number,
        city: String,
        country: String,
        province: String,
        headimgurl: String,
        subscribe: Number,
        subscribe_time: String,
        groupid: Number
    });
    return cb();
}