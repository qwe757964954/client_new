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