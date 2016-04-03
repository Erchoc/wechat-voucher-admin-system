var Promise = require('bluebird');
//数据操作层
module.exports = Shop = function () { };

/**
 * 根据sid判断店铺是否存在
 * param sid 店铺的sid
 **/
Shop.prototype.isExists = function (poi_id) {
    return new Promise(function (resolve, reject) {
        db.models['shop'].exists({ poi_id: poi_id }, function (err, exists) {
            if (err) {
                reject(err);
                return;
            }
            resolve(exists);
        })
    })
}

/**
 * 插入门店数据信息
 * param item 粉丝数据(JSON)
 **/
 Shop.prototype.insert = function (item) {
    return new Promise(function (resolve, reject) {
        db.models['shop'].create(item, function (err, item) {
            if (err) {
                reject(err);
                return;
            }
            resolve(item);
        })
    })
}

/**
 * 更新门店数据信息
 * param item 粉丝数据(JSON)
 **/
 Shop.prototype.update = function (item) {
    return new Promise(function (resolve, reject) {
        db.models['shop'].find({ poi_id: item.poi_id }).each(function (shop) {
            shop.business_name = item.business_name;
            shop.province = item.province;
            shop.city = item.city;
            shop.district = item.district;
            shop.address = item.address;
            shop.telephone = item.telephone;
            shop.categories = item.categories;
            shop.longitude = item.longitude;
            shop.latitude = item.latitude;
            shop.photo_list = JSON.stringify(item.photo_list);
            shop.introduction = item.introduction;
            shop.recommend = item.recommend;
            shop.poi_id = item.poi_id;
            shop.update_status = item.update_status;
        }).save(function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        })
    })
}

/**
 *  获取门店列表
 **/
Shop.prototype.getShopList = function () {
    return new Promise(function (resolve, reject) {
        db.models['shop'].find({ update_status: 0 }, function (err, shops) {
            if (err) {
                reject(err);
                return;
            }
            resolve(shops);
        })
    })
}