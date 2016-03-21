var express = require('express');
var app = new express();
var orm = require("orm");
var fs = require('fs');
var path = require('path')
var Promise = require('bluebird');        //异步流程控制
var autoroute = require('express-autoroute');   //自动路由第三方包
var request = Promise.promisify(require("request"));
var common = require('./common/common.js');
//加载配置项
var conf = require('./config.js');
var Redis = require('ioredis');

//初始化系统操作
init();
//自动加载路由,所有路由文件都放在routes下面
autoroute(app, { throwErrors: false, routesDir: path.join(__dirname, 'routes') });
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
            //3.初始化时，要先拉取一遍粉丝列表 
            var Fans = require('./lib/fans.js');
            var fans = new Fans();
            fans.getFans(0, '');
        }).catch(function (err) {
            console.error(err);
        })
    });
}

var Card = require('./lib/card.js');
var card = new Card();
card.getCardInfo('pBBJMwNI5TWb_cN69bC4N8wB1gGw').then();
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

   