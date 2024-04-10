
export default class StorageUtil{

    public static saveData(key:string,data:string){
        localStorage.setItem(key,data);
    }
    public static getData(key: string, defaultStr: string | null = null): string | null {
        let str = localStorage.getItem(key);
        if (str === null) {
            return defaultStr;
        }
        return str;
    }
    public static removeData(key:string){
        localStorage.removeItem(key);
    }
    public static removeAll(){
        localStorage.clear();
    }
}

