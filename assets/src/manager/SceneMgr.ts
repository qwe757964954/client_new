import { Director, director } from "cc";
import { SceneType } from "../config/PrefabType";
import { User } from "../models/User";
import { NetMgr } from "../net/NetManager";

class SceneManager {

    public static _instance: SceneManager = null;
    public static get instance(): SceneManager {
        if (this._instance == null) {
            this._instance = new SceneManager();
        }
        return this._instance;
    }
    public get instance() {
        return this;
    }
    private constructor() {
    }
    public loadScene(name: string, onLaunched?: Director.OnSceneLaunched, onUnloaded?: Director.OnUnload) {
        let runName = director.getScene()?.name;
        if (name == runName) return;
        if (name == SceneType.LoginScene) {
            if (runName != SceneType.LoadingScene) {
                User.isAutoLogin = false;
                User.resetData();
                NetMgr.closeNet();
            }
        }
        director.loadScene(name, onLaunched, onUnloaded);
    }
    /**去其他王国 */
    public loadMainScene(userID: number) {
        User.curMapUserID = userID;
        director.loadScene(SceneType.MainScene);
    }
}

export const SceneMgr = SceneManager.instance;