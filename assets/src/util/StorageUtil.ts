
export default class StorageUtil{

    public static saveData(key:string,data:string){
        localStorage.setItem(key,data);
    }
    public static getData(key:string){
        return localStorage.getItem(key);
    }
    public static removeData(key:string){
        localStorage.removeItem(key);
    }
    public static removeAll(){
        localStorage.clear();
    }
}

