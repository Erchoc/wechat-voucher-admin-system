/**
 * 用户路由
 */
var UserDao = require('../dao/userDao');
var userDao = new UserDao();
var conf = require('../config.js');
var common = require('../common/common.js');
var moment = require('moment');

module.exports.autoroute = {
    get: {
        '/user/login' : login,  //登录
    },
    post: {
    }
};

/**
 * 登录
 **/
function login(req, res) {
    var user = req.query.user;
    var pwd = req.query.pwd;
    pwd = common.sha1(pwd);
    userDao.login(user, pwd)
    .then(function (userinfo) {
        //说明存在用户
        if (userinfo.length > 0) {
            var jwt = require('json-web-token');
            //token过期时间
            var expires = moment().add(2, 'h').format('x');
            var payload = {
                user: userinfo[0].user,
                role: userinfo[0].role,
                expires: expires
            }
            jwt.encode(conf.loginSecret, payload, function (err, token) {
                if (err) {
                    res.jsonp({ status: -1, msgBody: '加密失败' });
                } else {
                    res.jsonp({ status: 200, msgBody: token });
                }
            });
        } else {
            res.jsonp({ status: -1, msgBody: '用户不存在' });
        }
    })
    .catch(function (err) {
        console.log('登录失败:' + err);
        res.jsonp({ status: -1, msgBody: '登录失败' });
    })
}