//配置文件
module.exports = {
    port: 3000,  //node启动端口
    dbString: 'mysql://root:123456@139.196.203.14/wechat?pool=true',   //数据库连接字符串
    redis: {
        port: 6379,          // Redis port
        host: '139.196.203.14'
    },
    //微信接口调用地址
    wechatRoute: {
        //获取token地址
        //getToken: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx103bde15086b3bb2&secret=d4624c36b6795d1d99dcf0547af5443d',
        getToken: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx327344267200ed96&secret=d6670eaece059ad1bc12c5a2ea9a4efd',
        //获取粉丝列表地址
        getFans: 'https://api.weixin.qq.com/cgi-bin/user/get?access_token={0}&next_openid={1}',
        //获取粉丝资料信息地址
        getFansInfo: 'https://api.weixin.qq.com/cgi-bin/user/info?access_token={0}&openid={1}&lang=zh_CN',
        //上传卡券Logo
        uploadLogo: 'https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token={0}',
        //根据卡券id获取卡券信息
        getCardInfo: 'https://api.weixin.qq.com/card/get?access_token={0}',
        //根据卡券状态获取卡券列表
        getCardList: 'https://api.weixin.qq.com/card/batchget?access_token={0}'
    }
}