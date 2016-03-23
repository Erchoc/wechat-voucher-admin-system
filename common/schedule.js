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
    var Card = require('../lib/card.js');
    var card = new Card();
    card.getCardList();
}

/**
 *  每个N分钟拉取卡券信息
 **/
var ruleCard = new schedule.RecurrenceRule();
var cardTimes = [];
for (var i = 0; i < 60; i = i + conf.syncCardMinute) { 
    cardTimes.push(i);
}
ruleCard.minute = cardTimes;
var cardJob = schedule.scheduleJob(ruleCard, function () {
    SyncCard();
});