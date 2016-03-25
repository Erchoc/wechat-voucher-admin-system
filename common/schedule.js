/**
 *  定时任务
 **/
var schedule = require("node-schedule");
var conf = require('../config.js');
//第一次开启时先跑一遍逻辑
SyncFans();
SyncCard();

/**
 *  定时拉取粉丝信息(每天6:00)
 **/
var ruleFans = new schedule.RecurrenceRule();
ruleFans.dayOfWeek = [0, new schedule.Range(1, 6)];
ruleFans.hour = 6;
ruleFans.minute = 0;
var fansJob = schedule.scheduleJob(ruleFans, function () {
    SyncFans();
});

/**
 *  同步粉丝
 **/
function SyncFans() {
    var Fans = require('../lib/fans.js');
    var fans = new Fans();
    fans.getFans(0, '');
}

/**
 *  同步卡券
 **/
function SyncCard() {
    var Coupon = require('../lib/coupon.js');
    var coupon = new Coupon();
    coupon.getCouponList();
}

/**
 *  每个N分钟拉取卡券信息
 **/
var ruleCoupon = new schedule.RecurrenceRule();
var couponTimes = [];
for (var i = 0; i < 60; i = i + conf.syncCardMinute) { 
    couponTimes.push(i);
}
ruleCoupon.minute = couponTimes;
var couponJob = schedule.scheduleJob(ruleCoupon, function () {
    SyncCard();
});