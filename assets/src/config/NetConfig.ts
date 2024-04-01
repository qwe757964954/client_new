
let baseUrl = "https://hksm.chuangciyingyu.com:9191/api/";
let baseUrl2 = "https://game.chuangciyingyu.com/";
let baseUrl3 = "https://gameserver.chuangciyingyu.com:8995/account/";
// let baseUrl4 = "https://szxc.chuangciyingyu.com:8123/v1/api/getseceneimg";

export const NetConfig = {
    privacyPage : "https://www.chuangciyingyu.com/%E9%9A%90%E7%A7%81%E6%94%BF%E7%AD%96.htm",//隐私政策
    userAgreement: "https://www.chuangciyingyu.com/%E7%94%A8%E6%88%B7%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE.htm",//用户协议

    checkNotice : baseUrl2 + "check_in",//公告检测
    tokenLogin : baseUrl + "tokenlogin",//token登录
    mobileLogin : baseUrl + "mobilelogin",//moble登录
    reqSms : baseUrl + "sendsms",//请求验证码
    smsLogin : baseUrl + "smslogin",//短信登录
    wechatLogin : baseUrl + "wechatlogin",//微信登录
    accountLogin : baseUrl3 + "login",//账号密码登录


}

