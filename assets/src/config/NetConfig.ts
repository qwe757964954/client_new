
let baseUrl = "https://hksm.chuangciyingyu.com:9191"; //老账号中台地址
let baseUrl2 = "https://game.chuangciyingyu.com/dev_ope"; //测试地址
let baseUrl3 = "https://game.chuangciyingyu.com/rc_ope"; //rc服地址

// export const NetConfig = {
//     privacyPage: "https://www.chuangciyingyu.com/%E9%9A%90%E7%A7%81%E6%94%BF%E7%AD%96.htm",//隐私政策
//     userAgreement: "https://www.chuangciyingyu.com/%E7%94%A8%E6%88%B7%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE.htm",//用户协议
//     gooleDown: "https://www.google.cn/chrome/", // 谷歌下载
//     androidDown: "https://www.chuangciyingyu.com/chuangci_v20220720.apk", // 安卓下载

//     assertUrl: "https://www.chuangciyingyu.com", // 资源url
//     currentUrl: baseUrl2, // 当前使用的地址

//     checkNotice: currentUrl + "/api/check_in",//公告检测
//     tokenLogin: currentUrl + "/api/tokenlogin",//token登录
//     mobileLogin: currentUrl + "/api/mobilelogin",//moble登录
//     reqSms: currentUrl + "/api/sendsms",//请求验证码
//     smsLogin: currentUrl + "/api/smslogin",//短信登录
//     wechatLogin: currentUrl + "/api/wechatlogin",//微信登录
//     accountLogin: currentUrl + "/api/account_login",//账号密码登录
//     selectServer: baseUrl3 + "/select_server" //测试服选择服务器

// }

export default class NetConfig {
    public static privacyPage = "https://www.chuangciyingyu.com/%E9%9A%90%E7%A7%81%E6%94%BF%E7%AD%96.htm";//隐私政策
    public static userAgreement = "https://www.chuangciyingyu.com/%E7%94%A8%E6%88%B7%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE.htm";//用户协议
    public static gooleDown = "https://www.google.cn/chrome/"; // 谷歌下载
    public static androidDown = "https://www.chuangciyingyu.com/chuangci_v20220720.apk"; // 安卓下载

    public static assertUrl = "https://www.chuangciyingyu.com"; // 资源url
    public static currentUrl = baseUrl2; // 当前使用的地址

    public static checkNotice = this.getCurrentUrl() + "/api/check_in";//公告检测
    public static tokenLogin = this.getCurrentUrl() + "/api/tokenlogin";//token登录
    public static mobileLogin = this.getCurrentUrl() + "/api/mobilelogin";//moble登录
    public static reqSms = this.getCurrentUrl() + "/api/sendsms";//请求验证码
    public static smsLogin = this.getCurrentUrl() + "/api/smslogin";//短信登录
    public static wechatLogin = this.getCurrentUrl() + "/api/wechatlogin";//微信登录
    public static accountLogin = this.getCurrentUrl() + "/api/account_login";//账号密码登录
    public static selectServer = baseUrl3 + "/select_server"; //测试服选择服务器
    
    private static getCurrentUrl() {
        return this.currentUrl;
    }

    public static setCurrentUrl(url: string) {
        this.currentUrl = url;
        this.checkNotice = this.getCurrentUrl() + "/api/check_in";//公告检测
        this.tokenLogin = this.getCurrentUrl() + "/api/tokenlogin";//token登录
        this.mobileLogin = this.getCurrentUrl() + "/api/mobilelogin";//moble登录
        this.reqSms = this.getCurrentUrl() + "/api/sendsms";//请求验证码
        this.smsLogin = this.getCurrentUrl() + "/api/smslogin";//短信登录
        this.wechatLogin = this.getCurrentUrl() + "/api/wechatlogin";//微信登录
        this.accountLogin = this.getCurrentUrl() + "/api/account_login";//账号密码登录
    }
}

