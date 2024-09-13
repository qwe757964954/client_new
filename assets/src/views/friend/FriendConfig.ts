import { isValid, JsonAsset } from "cc";
import { ResLoader } from "../../manager/ResLoader";
import { ShortcutInfo } from "./FriendInfo";

//用户信息服务
export default class _FriendConfig {
    private static _instance: _FriendConfig;
    private _shortcutInfo:ShortcutInfo[] = null;
    public static getInstance(): _FriendConfig {
        if (!this._instance || this._instance == null) {
            this._instance = new _FriendConfig();
        }
        return this._instance;
    }
    
    get shortcutInfo() {
        return this._shortcutInfo;
    }
    public async loadShotCutInfo(): Promise<void> {
        try {
            if(!isValid(this._shortcutInfo)){
                const jsonData = await ResLoader.instance.loadAsyncPromise<JsonAsset>('config/shortcut', JsonAsset);
                this._shortcutInfo = jsonData.json.shortcut as ShortcutInfo[];
            }

        } catch (err) {
            console.error("Failed to load task configuration:", err);
            throw err;
        }
    }

}

export const FriendConfig = _FriendConfig.getInstance();