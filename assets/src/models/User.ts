import { EventType } from "../config/EventType";
import { EventMgr } from "../util/EventManager";

// 用户
class UserModel {
    //单例
    private static _instance: UserModel = null;
    public static get instance(): UserModel {
        if (!this._instance) {
            this._instance = new UserModel();
        }
        return this._instance;
    }
    private _account: string;        // 账号
    private _password: string;       // 密码
    private _loginType: number;      // 登录类型
    private _isLogin: boolean = false; // 是否登录成功过
    public isAutoLogin: boolean = true; // 是否自动登录

    private _loginToken: string;     // loginTolen
    private _memberToken: string;    // memberToken
    private _mobile: string;         // 手机号
    private _platType: number;       // 平台类型
    private _sysType: number;        // 系统类型

    private _coin: number = 0;       // 金币
    private _diamond: number = 0;    // 钻石
    private _stamina: number = 0;     // 体力
    private _amethyst: number = 0;    // 紫晶石

    // 测试数据
    //// 头像数据
    public curHeadPropId: number = 101;  // 当前头像id
    public curHeadBoxPropId: number = 800;   // 当前头像框id
    // 用户id、昵称、称号等信息
    public userId: number = 12345;   // 用户id
    public userName: string = "哈哈哈";  // 昵称
    public roletitle: string = "高级";   // 称号文字
    public level: number = 101;  // 称号等级
    public currentExp: number = 35;  // 称号等级经验
    // 修改昵称信息
    public editRealNameNum: number = 0;  // 修改昵称次数

    private constructor() {

    }

    public resetData() {
        this._isLogin = false;
        this._account = "";
        this._password = "";
        this._loginToken = "";
        this._memberToken = "";
        this._mobile = "";
    }

    set account(account: string) {
        this._account = account;
    }
    get account(): string {
        return this._account;
    }
    set password(password: string) {
        this._password = password;
    }
    get password(): string {
        return this._password;
    }
    set isLogin(isLogin: boolean) {
        this._isLogin = isLogin;
    }
    get isLogin(): boolean {
        return this._isLogin;
    }

    set loginToken(loginToken: string) {
        this._loginToken = loginToken;
    }
    get loginToken(): string {
        return this._loginToken;
    }
    set memberToken(memberToken: string) {
        this._memberToken = memberToken;
    }
    get memberToken(): string {
        return this._memberToken;
    }
    get mobile(): string {
        return this._mobile;
    }
    get platType(): number {
        return this._platType;
    }
    get sysType(): number {
        return this._sysType;
    }

    set coin(coin: number) {
        this._coin = coin;
        EventMgr.emit(EventType.Coin_Update);
    }
    get coin(): number {
        return this._coin;
    }
    set diamond(diamond: number) {
        this._diamond = diamond;
        EventMgr.emit(EventType.Diamond_Update);
    }
    get diamond(): number {
        return this._diamond;
    }
    set stamina(stamina: number) {
        this._stamina = stamina;
        EventMgr.emit(EventType.Stamina_Update);
    }
    get stamina(): number {
        return this._stamina;
    }
    set amethyst(amethyst: number) {
        this._amethyst = amethyst;
        EventMgr.emit(EventType.Amethyst_Update);
    }
    get amethyst(): number {
        return this._amethyst;
    }
}

export const User = UserModel.instance;