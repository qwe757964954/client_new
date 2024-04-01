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
    private constructor() {

    }
}