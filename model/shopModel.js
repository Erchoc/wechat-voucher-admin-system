//定义表结构Model
module.exports = function (db, cb) {
    //define方法的第一个参数为表名
    db.define('shop', {
        id: { type: 'serial', key: true } , //主键
        business_name: String,
        province: String,
        city: String,
        district: String,
        address: String,
        telephone: String,
        categories: String,
        longitude: Number,
        latitude: Number,
        photo_list: String,
        introduction: String,
        recommend: String,
        sid: String,
        poi_id: String,
        update_status: Number
    });
    return cb();
}