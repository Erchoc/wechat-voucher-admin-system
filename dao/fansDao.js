var Promise = require('bluebird');
//数据操作层
module.exports = fans = function () { };

/**
 * 根据Openid判断粉丝是否存在
 * param openid 粉丝的Openid
 **/
fans.prototype.isExists = function (openid) {
    return new Promise(function (resolve, reject) {
        db.models['fansInfo'].exists({ openid: openid }, function (err, exists) {
            if (err) {
                reject(err);
                return;
            }
            resolve(exists);
        })
    })
}

/**
 * 插入fans数据信息
 * param item 粉丝数据(JSON)
 **/
 fans.prototype.insert = function (item) {
    return new Promise(function (resolve, reject) {
        db.models['fansInfo'].create(item, function (err, item) {
            if (err) {
                reject(err);
                return;
            }
            resolve(item);
        })
    })
}

/**
 * 更新取消关注状态
 * param openid
 **/
fans.prototype.unsubscribe = function (openid) {
    return new Promise(function (resolve, reject) {
        db.models['fansInfo'].find({ openid: openid }).each(function (fan) {
            fan.subscribe = 0;
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
 * 更新fans数据信息
 * param item 粉丝数据(JSON)
 **/
 fans.prototype.update = function (item) {
    return new Promise(function (resolve, reject) {
        db.models['fansInfo'].find({ openid: item.openid }).each(function (fan) {
            fan.nickname = item.nickname;
            fan.sex = item.sex;
            fan.city = item.city;
            fan.country = item.country;
            fan.province = item.province;
            fan.headimgurl = item.headimgurl;
            fan.subscribe = item.subscribe;
            fan.subscribe_time = item.subscribe_time;
            fan.groupid = item.groupid;
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
 * 更新fans位置信息
 * param item 粉丝数据(JSON)
 **/
fans.prototype.updateLocation = function (item) {
    return new Promise(function (resolve, reject) {
        db.models['fansInfo'].find({ openid: item.fromusername }).each(function (fan) {
            fan.location_y = item.location_y;
            fan.location_x = item.location_x;
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
 *  获取fans列表
 **/
fans.prototype.getFansList = function () {
    return new Promise(function (resolve, reject) {
        db.models['fansInfo'].find({ subscribe: 1 }, function (err, fans) {
            if (err) {
                reject(err);
                return;
            }
            resolve(fans);
        })
    })
}