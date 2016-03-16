var express = require('express');
var app = new express();
var orm = require("orm");
var fs = require('fs');
var path = require('path')
var Promise = require('bluebird');        //异步流程控制
var autoroute = require('express-autoroute');   //自动路由第三方包
//加载配置项
var conf = require('./config.js');
//全局变量db保存数据库连接
global.db = '';

//连接数据库
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
    }).catch(function (err) {
        console.error(err);
    })
});

//自动加载路由,所有路由文件都放在routes下面
autoroute(app, { throwErrors: false, routesDir: path.join(__dirname, 'routes') });
//开启node
app.listen(conf.port);

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