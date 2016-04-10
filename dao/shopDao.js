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
            shop.photo_list = item.photo_list;
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
 *  param openid 粉丝openid
 *  param order 排序 {coloum:xxx,type:asc}
 **/
Shop.prototype.getShopList = function (openid, order) {
    return new Promise(function (resolve, reject) {
        if (!order) {
            order = 'distance ASC';
        } else {
            order = order.column + ' ' + order.type;
        }
        var sql = "SELECT t2.photo_list,t2.latitude,t2.longitude,t2.evaluate,t2.business_name,t2.city,t2.address,t2.`telephone`," 
                  + "ROUND(6378.138 * 2 * ASIN(SQRT(POW(SIN((t1.`location_x` * PI() / 180 - t2.`latitude` * PI() / 180) / 2),2) + COS(t1.`location_x` * PI() / 180) * COS(t2.`latitude` * PI() / 180) * POW(" 
                  + "SIN((t1.`location_Y` * PI() / 180 - t2.`longitude` * PI() / 180) / 2),2)))) AS distance" 
                  + " FROM `fansInfo` t1,`shop` t2" 
                  + " WHERE t1.`openid` = '{0}' AND t2.update_status =0 order by {1} ";
        db.driver.execQuery(sql.format(openid, order), function (err, data) {
            if (err) return reject(err);
            resolve(data);
        })
    })
}