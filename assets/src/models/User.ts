import { EventType, itemEventKey } from "../config/EventType";
import { ItemID } from "../export/ItemConfig";
import { ClothingType, DataMgr, ItemData } from "../manager/DataMgr";
import { ViewsMgr } from "../manager/ViewsManager";
import { EventMgr } from "../util/EventManager";
import { TimerMgr } from "../util/TimerMgr";
import { ToolUtil } from "../util/ToolUtil";
/**登录类型 */
export enum LoginType {
    account = 1,//账号密码登录
    phoneCode = 2,//手机号验证码登录
    phone = 3,//手机号一键登录
    wechat = 4,//微信登录
    token = 5,//token登录
}
/**服装变化信息 */
export class ClothingChangeInfo {
    public type: ClothingType;//服装类型
    public clothing: number;
    public oldClothing: number;

    constructor(type: ClothingType, clothing: number, oldClothing: number) {
        this.type = type;
        this.clothing = clothing;
        this.oldClothing = oldClothing;
    }
}
/**用户服装 */
export class UserClothes {
    private _hair: number | null = null;//头发
    private _jewelry: number | null = null;//饰品
    private _coat: number | null = null;//上衣
    private _pants: number | null = null;//裤子
    private _shoes: number | null = null;//鞋子
    private _wings: number | null = null;//翅膀
    private _hat: number | null = null;//帽子
    private _face: number | null = null;//脸

    reset() {
        this._hair = this._jewelry = this._coat = this._pants = this._shoes = this._wings = this._hat = this._face = null;
    }
    set hair(clothing: number) {
        let oldValue = this._hair;
        this._hair = clothing;
        if (clothing != oldValue && this == User.userClothes) {
            EventMgr.emit(EventType.Role_Change_Slot, new ClothingChangeInfo(ClothingType.toufa, clothing, oldValue));
        }
    }
    set jewelry(clothing: number) {
        let oldValue = this._jewelry;
        this._jewelry = clothing;
        if (clothing != oldValue && this == User.userClothes) {
            EventMgr.emit(EventType.Role_Change_Slot, new ClothingChangeInfo(ClothingType.shipin, clothing, oldValue));
        }
    }
    set coat(clothing: number) {
        let oldValue = this._coat;
        this._coat = clothing;
        if (clothing != oldValue && this == User.userClothes) {
            EventMgr.emit(EventType.Role_Change_Slot, new ClothingChangeInfo(ClothingType.shangyi, clothing, oldValue));
        }
    }
    set pants(clothing: number) {
        let oldValue = this._pants;
        this._pants = clothing;
        if (clothing != oldValue && this == User.userClothes) {
            EventMgr.emit(EventType.Role_Change_Slot, new ClothingChangeInfo(ClothingType.kuzi, clothing, oldValue));
        }
    }
    set shoes(clothing: number) {
        let oldValue = this._shoes;
        this._shoes = clothing;
        if (clothing != oldValue && this == User.userClothes) {
            EventMgr.emit(EventType.Role_Change_Slot, new ClothingChangeInfo(ClothingType.xiezi, clothing, oldValue));
        }
    }
    set wings(clothing: number) {
        let oldValue = this._wings;
        this._wings = clothing;
        if (clothing != oldValue && this == User.userClothes) {
            EventMgr.emit(EventType.Role_Change_Slot, new ClothingChangeInfo(ClothingType.chibang, clothing, oldValue));
        }
    }
    set hat(clothing: number) {
        let oldValue = this._hat;
        this._hat = clothing;
        if (clothing != oldValue && this == User.userClothes) {
            EventMgr.emit(EventType.Role_Change_Slot, new ClothingChangeInfo(ClothingType.maozi, clothing, oldValue));
        }
    }
    set face(clothing: number) {
        let oldValue = this._face;
        this._face = clothing;
        if (clothing != oldValue && this == User.userClothes) {
            EventMgr.emit(EventType.Role_Change_Slot, new ClothingChangeInfo(ClothingType.lian, clothing, oldValue));
        }
    }
    get hair() { return this._hair; }
    get jewelry() { return this._jewelry; }
    get coat() { return this._coat; }
    get pants() { return this._pants; }
    get shoes() { return this._shoes; }
    get wings() { return this._wings; }
    get hat() { return this._hat; }
    get face() { return this._face; }


    // 从给定的数据设置服装
    setData(data: UserClothes) {
        this.hair = data.hair;
        this.jewelry = data.jewelry;
        this.coat = data.coat;
        this.pants = data.pants;
        this.shoes = data.shoes;
        this.wings = data.wings;
        this.hat = data.hat;
        this.face = data.face;
    }
    // 从给定的数据设置服装
    setAssignData(data: Partial<UserClothes>) {
        if (data.hair !== undefined) this.hair = data.hair;
        if (data.jewelry !== undefined) this.jewelry = data.jewelry;
        if (data.coat !== undefined) this.coat = data.coat;
        if (data.pants !== undefined) this.pants = data.pants;
        if (data.shoes !== undefined) this.shoes = data.shoes;
        if (data.wings !== undefined) this.wings = data.wings;
        if (data.hat !== undefined) this.hat = data.hat;
        if (data.face !== undefined) this.face = data.face;
    }

    getClothings() {
        return [this._hair, this._jewelry, this._coat, this._pants, this._shoes, this._wings, this._hat, this._face];
    }
    // 根据类型设置服装
    setClothing(clothing: number, type?: ClothingType) {
        type = type ?? DataMgr.clothingConfig[clothing]?.type;

        switch (type) {
            case ClothingType.toufa:
                this.hair = clothing;
                break;
            case ClothingType.shipin:
                this.jewelry = clothing;
                break;
            case ClothingType.shangyi:
                this.coat = clothing;
                break;
            case ClothingType.kuzi:
                this.pants = clothing;
                break;
            case ClothingType.xiezi:
                this.shoes = clothing;
                break;
            case ClothingType.chibang:
                this.wings = clothing;
                break;
            case ClothingType.maozi:
                this.hat = clothing;
                break;
            case ClothingType.lian:
                this.face = clothing;
                break;
        }
    }
}

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
    private _loginType: LoginType;      // 登录类型
    private _isLogin: boolean = false; // 是否登录成功过
    public isAutoLogin: boolean = true; // 是否自动登录

    private _loginToken: string;     // loginTolen
    private _memberToken: string;    // memberToken
    private _mobile: string;         // 手机号
    private _platType: number;       // 平台类型
    private _sysType: number;        // 系统类型
    /**物品 */
    private _coin: number = 0;       // 金币
    private _diamond: number = 0;    // 钻石
    private _stamina: number = 0;     // 体力
    private _amethyst: number = 0;    // 紫晶石
    private _ticket: number = 0;      // 奖券
    private _moodScore: number = 0;   // 心情值
    private _itemAry: { [key: number]: number } = {};// 物品列表
    public userClothes: UserClothes = new UserClothes();

    public userID: number;   // 用户id
    public nick: string;     // 昵称
    public avatarID: number;   // 头像id
    public level: number;     // 等级
    public exp: number;       // 经验
    private _roleID: number;    // 角色id
    private _petID: number = null;     // 宠物id
    public petLevel: number = null;  // 宠物等级
    public petHasReward: boolean = false; // 宠物是否有奖励
    public gender: number = 1; //性别

    public castleLevel: number = 1;    // 城堡等级

    private _staminaLimit: number = 0;    // 体力上限
    private _staminaTime: number = 0;     // 体力恢复时间
    private _staminaTimer: number = null;  // 体力恢复定时器
    private _staminaInterval: number = 180;  // 体力恢复间隔


    // 测试数据
    //// 头像数据
    public curHeadPropId: number = 101;  // 当前头像id 作废
    public curHeadBoxPropId: number = 800;   // 当前头像框id 作废
    // 用户id、昵称、称号等信息
    public userName: string = "哈哈哈";  // 昵称 作废
    public roletitle: string = "高级";   // 称号文字 作废
    // public level: number = 101;  // 称号等级 作废
    public currentExp: number = 35;  // 称号等级经验 作废
    // 修改昵称信息
    public editRealNameNum: number = 0;  // 修改昵称次数 作废

    private _buildingList: number[] = [];// 建筑列表（已有）
    private _landList: number[] = [];// 地块列表（已有）

    private constructor() {
        // for test
        // this.userClothes.hair = 30001;
        // this.userClothes.jewelry = 30002;
        // this.userClothes.coat = 30003;
        // this.userClothes.pants = 30004;
        // this.userClothes.shoes = 30005;
        // this.userClothes.wings = 0;
        // this.userClothes.hat = 0;
        // this.userClothes.face = 0;

        // this.userClothes.hair = 30006;
        // this.userClothes.jewelry = 30007;
        // this.userClothes.coat = 30008;
        // this.userClothes.pants = 30009;
        // this.userClothes.shoes = 30010;
    }

    public resetData() {
        this._isLogin = false;
        this._account = "";
        this._password = "";
        this._loginToken = "";
        this._loginType = null;
        this._memberToken = "";
        this._mobile = "";
        this.castleLevel = 1;
        this.petID = null;
        this.petLevel = null;
        this.petHasReward = false;
        this._itemAry = [];
        this.userClothes.reset();
        this._buildingList = [];
        this._landList = [];
        this._staminaLimit = 0;
        this._staminaTime = 0;
        this.clearStaminaTimer();
    }

    set account(account: string) {
        this._account = account;
    }
    get account(): string {
        return this._account;
    }


    public get itemAry(): { [key: number]: number } {
        return this._itemAry;
    }


    set password(password: string) {
        this._password = password;
    }
    get password(): string {
        return this._password;
    }
    set loginType(loginType: LoginType) {
        this._loginType = loginType;
    }
    get loginType(): LoginType {
        return this._loginType;
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
        if (null == coin) return;
        this._coin = coin;
        this._itemAry[ItemID.coin] = coin;
        EventMgr.emit(EventType.Coin_Update, this._coin);
    }
    get coin(): number {
        return this._coin;
    }
    set diamond(diamond: number) {
        if (null == diamond) return;
        this._diamond = diamond;
        this._itemAry[ItemID.diamond] = diamond;
        EventMgr.emit(EventType.Diamond_Update, this._diamond);
    }
    get diamond(): number {
        return this._diamond;
    }
    set stamina(stamina: number) {
        if (null == stamina) return;
        this._stamina = stamina;
        this._itemAry[ItemID.stamina] = stamina;
        EventMgr.emit(EventType.Stamina_Update, this._stamina);
    }
    get stamina(): number {
        return this._stamina;
    }
    set amethyst(amethyst: number) {
        if (null == amethyst) return;
        this._amethyst = amethyst;
        this._itemAry[ItemID.amethyst] = amethyst;
        EventMgr.emit(EventType.Amethyst_Update, this._amethyst);
    }
    get amethyst(): number {
        return this._amethyst;
    }
    set ticket(ticket: number) {
        if (null == ticket) return;
        this._ticket = ticket;
        this._itemAry[ItemID.ticket] = ticket;
        EventMgr.emit(EventType.Ticket_Update, this._ticket);
    }
    get ticket(): number {
        return this._ticket;
    }
    set moodScore(moodScore: number) {
        this._moodScore = moodScore;
        EventMgr.emit(EventType.Mood_Score_Update, this._moodScore);
    }
    get moodScore(): number {
        return this._moodScore;
    }
    get staminaLimit(): number {
        return this._staminaLimit;
    }
    get staminaInterval(): number {
        return this._staminaInterval;
    }
    set roleID(roleID: number) {
        roleID = roleID % 100;//for test 修改数据，后续删除
        this._roleID = roleID;
    }
    get roleID(): number {
        return this._roleID;
    }
    set petID(petID: number) {
        // if (petID < 100) petID += 100;//for test 修改数据，后续删除
        petID = petID % 100;//for test 修改数据，后续删除
        this._petID = petID;
    }
    get petID(): number {
        return this._petID;
    }

    public addBuilding(id: number) {
        if (this._buildingList.find(item => item === id)) return;
        this._buildingList.push(id);
    }
    public deleteBuilding(id: number) {
        let index = this._buildingList.indexOf(id);
        if (-1 == index) return;
        this._buildingList.splice(index, 1);
    }
    public get buildingList(): readonly number[] {
        return this._buildingList;
    }
    public addLand(id: number) {
        if (this._landList.find(item => item === id)) return;
        this._landList.push(id);
    }
    public get landList(): readonly number[] {
        return this._landList;
    }

    public getItem(id: ItemID): number {
        if (this._itemAry.hasOwnProperty(id)) {
            return this._itemAry[id];
        }
        return 0;
    }
    public setItem(id: ItemID, num: number) {
        switch (id) {
            case ItemID.coin:
                User.coin = num;
                break;
            case ItemID.diamond:
                User.diamond = num;
                break;
            case ItemID.stamina:
                User.stamina = num;
                break;
            case ItemID.amethyst:
                User.amethyst = num;
                break;
            case ItemID.ticket:
                User.ticket = num;
                break;
            default:
                break;
        }
        this._itemAry[id] = num;
        EventMgr.emit(itemEventKey(id), num);
    }
    /**清理体力定时器 */
    public clearStaminaTimer() {
        if (this._staminaTimer) {
            TimerMgr.stop(this._staminaTimer);
            this._staminaTimer = null;
        }
    }
    /**体力定时器 */
    public onStaminaTimer() {
        if (ToolUtil.now() >= this._staminaTime) {
            this.clearStaminaTimer();
            this._staminaTimer = TimerMgr.once(this.onStaminaTimer.bind(this), 2000);
            EventMgr.emit(EventType.Stamina_Timeout);
        }
    }
    /**体力更新剩余时间 */
    public getStaminaLeftTime(): number {
        if (!this._staminaTime) return null;
        if (this._stamina >= this._staminaLimit) return null;
        let dt = this._staminaTime - ToolUtil.now();
        return dt > 0 ? dt : 0;
    }
    /**设置体力上限、更新时间 */
    public updateStaminaLimitAndTime(limit: number, time: number) {
        this._staminaLimit = limit;
        this._staminaTime = ToolUtil.now() + time;
        this.clearStaminaTimer();
        if (this._stamina < this._staminaLimit) {
            this._staminaTimer = TimerMgr.once(this.onStaminaTimer.bind(this), time * 1000);
        }
        EventMgr.emit(EventType.Stamina_Timer_Update, time);
    }
    /**判断物品条件是否满足 */
    public checkItems(data: ItemData[], tipStr: string = null): boolean {
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            let hasNum = this._itemAry[item.id] || 0;
            if (hasNum < item.num) {
                if (tipStr) {
                    ViewsMgr.showConfirm(ToolUtil.replace(tipStr, DataMgr.getItemInfo(item.id).name));
                }
                return false;
            }
        }
        return true;
    }
}

export const User = UserModel.instance;