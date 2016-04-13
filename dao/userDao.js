var Promise = require('bluebird');
//数据操作层
module.exports = User = function () { };

/**
 *  用户登录
 **/
User.prototype.login = function (user,pwd) {
    return new Promise(function (resolve, reject) {
        db.models['user'].find({ user:user,pwd:pwd }, function (err, user) {
            if (err) {
                reject(err);
                return;
            }
            resolve(user);
        })
    })
}