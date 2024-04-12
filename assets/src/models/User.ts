// 用户
export class User {
    //单例
    private static _instance:User = null;
    public static get instance():User{
        if(!this._instance){
            this._instance = new User();
        }
        return this._instance;
    }
    
    private _loginToken:string;     // loginTolen
    private _memberToken:string;    // memberToken
    private _mobile:string;         // 手机号
    private _platType:number;       // 平台类型
    private _sysType:number;        // 系统类型

    // 测试数据
    //// 头像数据
    public curHeadPropId:number = 101;  // 当前头像id
    public curHeadBoxPropId:number = 800;   // 当前头像框id
    // 用户id、昵称、称号等信息
    public userId:number = 12345;   // 用户id
    public userName:string = "哈哈哈";  // 昵称
    public roletitle:string = "高级";   // 称号文字
    public level:number = 101;  // 称号等级
    public currentExp:number = 35;  // 称号等级经验
    // 修改昵称信息
    public editRealNameNum:number = 0;  // 修改昵称次数
    
    private constructor() {

    }

    get loginToken():string {
        return this._loginToken;
    }
    get memberToken():string {
        return this._memberToken;
    }
    get mobile():string {
        return this._mobile;
    }
    get platType():number {
        return this._platType;
    }
    get sysType():number {
        return this._sysType;
    }

}