//定义表结构Model
module.exports = function (db, cb) {
    //define方法的第一个参数为表名
    db.define('consume', {
        id: { type: 'serial', key: true } , //主键
        tousername: String,
        fromusername: String,
        cardid: String,
        usercardcode: String,
        consumesource: String,
        locationname: String,
        staffopenid: String,
        createtime: Number
    });
    return cb();
}