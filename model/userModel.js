//定义表结构Model
module.exports = function (db, cb) {
    //define方法的第一个参数为表名
    db.define('user', {
        id: { type: 'serial', key: true } , //主键
        user: String,
        pwd: String,
        role: String
    });
    return cb();
}