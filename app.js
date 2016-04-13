var express = require('express');
var app = new express();
var orm = require("orm");
var fs = require('fs');
var path = require('path')
var Promise = require('bluebird');        //异步流程控制
var autoroute = require('express-autoroute');   //自动路由第三方包
var xmlparser = require('express-xml-bodyparser');
var bodyParser = require('body-parser');
var request = Promise.promisify(require("request"));
var common = require('./common/common.js');
//加载配置项
var conf = require('./config.js');
var Redis = require('ioredis');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(xmlparser({ trim: false, explicitArray: false }));

//增加权限验证
app.use('*', authorization, function (req, res, next) {
    //解决跨域
    res.header("Access-Control-Allow-Origin", "*");
    //自动加载路由,所有路由文件都放在routes下面
    autoroute(app, { throwErrors: false, routesDir: path.join(__dirname, 'routes') });
    next();
})

//初始化系统操作
init();

//开启node
app.listen(conf.port);



/**
 *  初始化系统操作
 **/
function init() {
    //1.连接redis
    var redis = new Redis(conf.redis, { lazyConnect: true });
    redis.on('error', function (err) {
        console.error('连接redis失败:' + err);
    })
    //全局变量db保存数据库连接
    global.db = '';
    //全局变量redis保存redis
    global.redis = redis;
    
    //2.连接数据库
    orm.connect(conf.dbString, function (err, db) {
        if (err) {
            console.error('创建数据库连接错误:' + err);
            return;
        }
        //全局保存数据库连接
        global.db = db;
        //遍历model文件夹,获取全部的model文件
        var modelList = fs.readdirSync('./model');
        //异步加载model
        Promise.map(modelList, function (model) {
            return loadModel(db, path.join(__dirname , 'model', model));
        }).then(function () {
            console.log('加载model成功');
            //3.初始化时，开启job
            var job = require('./common/schedule.js');

            //var obj = {
            //    button: [
            //        { type: 'view', name: '开始购票', url: 'http://m.weimob.com/buyer/home?vid=17510014' },
            //        {
            //            name: '关于我们',
            //            sub_button: [
            //                { type: 'view', name: '官网', url: 'http://139.196.58.233/home' },
            //                { type: 'click', name: '联系我们', key: 'k001' },
            //                { type: 'click', name: '使用教程', key: 'k002' },
            //                { type: 'view', name:'查看门店', url:'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx327344267200ed96&redirect_uri=http%3A%2F%2Fweixin.yunccloud.com%3A3002%2Fshop%2FshopCode%2Fquery&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect'}
            //            ]
            //        }]
            //};
            //var Menu = require('./lib/menu.js');
            //var menu = new Menu();
            //menu.createMenu(obj).then();
        }).catch(function (err) {
            console.error(err);
        })
    });
}

/**
 *  加载model进内存
 **/
function loadModel(db, model) {
    return new Promise(function (resolve, reject) {
        db.load(model, function (err) {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            resolve();
        })
    })
}

/**
 * 路由验证
 **/
function authorization(req, res, next) {
    var baseUrl = req.baseUrl;
    //1.判断如果是特例路由，则不用考虑权限认证
    var isSpecial = conf.specialRouting.indexOf(baseUrl) > -1;
    if (isSpecial) return next();
    //2.验证token
    var token = req.query.token;
    var jwt = require('json-web-token');
    jwt.decode(conf.loginSecret, token, function (err, decode) {
        if (err) return res.jsonp({ status: -1, msgBody: 'token验证失败' });
        //判断token是否过期
        if (parseInt(decode.expires) < new Date().valueOf()) return res.jsonp({ status: -1, msgBody: 'token已过期' });
        var role = decode.role;
        switch (role) {
            case 'admin'://管理员账户拥有所有权限
                next();
                break;
            case 'manager'://拥有读写权限
                var reg = /(query|operation|add|del)$/;
                if (!reg.test(baseUrl)) return res.jsonp({ status: -1, msgBody: '权限不够' });
                next();
                break;
            case 'reviewer'://拥有读的权限
                var reg = /query$/;
                if (!reg.test(baseUrl)) return res.jsonp({ status: -1, msgBody: '权限不够' });
                next();
                break;
            default :
                return res.jsonp({ status: -1, msgBody: '权限不够' });
                break;
        }
    })
}