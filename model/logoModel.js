//定义表结构Model
module.exports = function (db, cb) {
    //define方法的第一个参数为表名
    db.define('logo', {
        id: { type: 'serial', key: true } , //主键
        url: String
    });
    return cb();
}