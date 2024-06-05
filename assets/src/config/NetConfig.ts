import DebugConfig from "../DebugConfig";

let baseUrl = "https://hksm.chuangciyingyu.com:9191"; //老账号中台地址
let baseUrl2 = "https://game.chuangciyingyu.com/dev_ope"; //测试地址
let baseUrl3 = "https://game.chuangciyingyu.com/rc_ope"; //rc服地址

class NetCfg {
    /**单例 */
    private static s_instance: NetCfg = null;
    public static instance() {
        if (!this.s_instance) {
            this.s_instance = new NetCfg();
        }
        return this.s_instance;
    }
    private constructor() {
        this.converToDebug();
        this.setCurrentUrl(baseUrl2);
    }

    public selectServer = baseUrl3 + "/select_server"; //测试服选择服务器
    public currentUrl// 当前使用的地址
    public privacyPage = "https://www.chuangciyingyu.com/%E9%9A%90%E7%A7%81%E6%94%BF%E7%AD%96.htm";//隐私政策
    public userAgreement = "https://www.chuangciyingyu.com/%E7%94%A8%E6%88%B7%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE.htm";//用户协议
    public gooleDown = "https://www.google.cn/chrome/"; // 谷歌下载
    public androidDown = "https://www.chuangciyingyu.com/chuangci_v20220720.apk"; // 安卓下载
    public assertUrl = "https://www.chuangciyingyu.com/assets"; // 资源url

    public server = "39.108.215.220";//webscoket服务器
    public port = 9803;//webscoket端口

    public checkNotice;//公告检测
    public tokenLogin;//token登录
    public mobileLogin;//moble登录
    public reqSms;//请求验证码
    public smsLogin;//短信登录
    public wechatLogin;//微信登录
    public accountLogin;//账号密码登录
    public versionCheck;//版本检测

    private getCurrentUrl() {
        return this.currentUrl;
    }

    public setCurrentUrl(url: string) {
        this.currentUrl = url;
        this.checkNotice = this.currentUrl + "/api/check_in";//公告检测
        this.tokenLogin = this.currentUrl + "/api/tokenlogin";//token登录
        this.mobileLogin = this.currentUrl + "/api/mobilelogin";//moble登录
        this.reqSms = this.currentUrl + "/api/sendsms";//请求验证码
        this.smsLogin = this.currentUrl + "/api/smslogin";//短信登录
        this.wechatLogin = this.currentUrl + "/api/wechatlogin";//微信登录
        this.accountLogin = this.currentUrl + "/api/account_login";//账号密码登录
        this.versionCheck = "http://192.168.1.58:8888/test";//版本检测
    }
    public converToDebug() {
        if (!DebugConfig.TEST_SERVER) return;
        this.server = "192.168.1.67";
        this.port = 40003;
    }
}

export const NetConfig = NetCfg.instance();

