CREATE DATABASE `wechat`  DEFAULT CHARACTER SET utf8 ;

CREATE TABLE `bot` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `openid` varchar(50) DEFAULT NULL COMMENT 'openid',
  `msg` text COMMENT '用户发送消息',
  `response` text COMMENT '回应',
  `time` varchar(50) DEFAULT NULL COMMENT '发送时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=176 DEFAULT CHARSET=utf8;

CREATE TABLE `card` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `cardid` varchar(40) NOT NULL COMMENT '卡券id',
  `cardtype` varchar(20) DEFAULT NULL COMMENT '卡券类别',
  `cardname` varchar(100) DEFAULT NULL COMMENT '卡券名',
  `quantity` int(11) DEFAULT NULL COMMENT '卡券现有库存数量',
  `total_quantity` int(11) DEFAULT NULL COMMENT '卡券全部库存数量',
  `status` varchar(30) DEFAULT NULL COMMENT '“CARD_STATUS_NOT_VERIFY”,待审核；“CARD_STATUS_VERIFY_FAIL”,审核失败；“CARD_STATUS_VERIFY_OK”，通过审核；“CARD_STATUS_DELETE”，卡券被商户删除；“CARD_STATUS_DISPATCH”，在公众平台投放过的卡券',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;

CREATE TABLE `consume` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `tousername` varchar(50) DEFAULT NULL COMMENT '开发者微信号',
  `fromusername` varchar(50) DEFAULT NULL COMMENT '发送方openid',
  `cardid` varchar(50) DEFAULT NULL COMMENT '卡券id',
  `usercardcode` varchar(50) DEFAULT NULL COMMENT '卡券码',
  `consumesource` varchar(50) DEFAULT NULL COMMENT '核销来源。支持开发者统计API核销（FROM_API）、公众平台核销（FROM_MP）、卡券商户助手核销（FROM_MOBILE_HELPER）（核销员微信号）',
  `locationname` varchar(50) DEFAULT NULL COMMENT '门店名称',
  `staffopenid` varchar(50) DEFAULT NULL COMMENT '核销该卡券核销员的openid（只有通过卡券商户助手核销时才会出现）',
  `createtime` int(11) DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;

CREATE TABLE `fansInfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `openid` varchar(60) NOT NULL COMMENT 'openid',
  `nickname` varchar(60) DEFAULT NULL COMMENT '用户昵称',
  `sex` int(11) DEFAULT NULL COMMENT '性别(0:未知;1:男;2:女)',
  `city` varchar(20) DEFAULT NULL COMMENT '用户所在城市',
  `country` varchar(30) DEFAULT NULL COMMENT '用户所在国家',
  `province` varchar(20) DEFAULT NULL COMMENT '用户所在省份',
  `headimgurl` varchar(200) DEFAULT NULL COMMENT '用户头像',
  `subscribe` int(11) DEFAULT NULL COMMENT '是否关注(0:未关注)',
  `subscribe_time` varchar(30) DEFAULT NULL COMMENT '用户关注时间',
  `groupid` int(11) DEFAULT NULL COMMENT '用户所在分组',
  `location_x` double DEFAULT NULL COMMENT '纬度',
  `location_Y` double DEFAULT NULL COMMENT '经度',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;

CREATE TABLE `logo` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `url` varchar(200) DEFAULT NULL COMMENT '微信logo地址',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

CREATE TABLE `media` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `image` varchar(300) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `description` text,
  `url` varchar(300) DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `createtime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

CREATE TABLE `shop` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `business_name` varchar(100) DEFAULT NULL COMMENT '门店名称',
  `province` varchar(50) DEFAULT NULL COMMENT '门店所在省份',
  `city` varchar(50) DEFAULT NULL COMMENT '门店所在城市',
  `district` varchar(200) DEFAULT NULL COMMENT '门店所在地区',
  `address` varchar(200) DEFAULT NULL COMMENT '门店所在的详细街道地址',
  `telephone` varchar(30) DEFAULT NULL COMMENT '门店所在电话',
  `categories` varchar(200) DEFAULT NULL COMMENT '门店的类型',
  `longitude` double DEFAULT NULL COMMENT '经度',
  `latitude` double DEFAULT NULL COMMENT '纬度',
  `photo_list` text COMMENT '	图片列表',
  `introduction` varchar(500) DEFAULT NULL COMMENT '商户简介',
  `recommend` varchar(500) DEFAULT NULL COMMENT '推荐品',
  `sid` varchar(30) DEFAULT NULL COMMENT '	商户自己的id',
  `poi_id` varchar(30) DEFAULT NULL COMMENT '	微信的门店ID，微信内门店唯一标示ID',
  `update_status` int(11) DEFAULT NULL COMMENT '扩展字段是否正在更新中。1 表示扩展字段正在更新中，尚未生效，不允许再次更新； 0 表示扩展字段没有在更新中或更新已生效，可以再次更新',
  `evaluate` int(11) DEFAULT '1' COMMENT '评价',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user` varchar(50) DEFAULT NULL COMMENT '用户名',
  `pwd` varchar(100) DEFAULT NULL COMMENT '密码',
  `role` varchar(20) DEFAULT NULL COMMENT '角色',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
