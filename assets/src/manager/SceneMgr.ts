import { Director, director } from "cc";
import { SceneType } from "../config/PrefabType";
import { User } from "../models/User";
import { NetMgr } from "../net/NetManager";
import { ServiceMgr } from "../net/ServiceManager";

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
        if (runName == SceneType.MainScene) {
            // 离开
            ServiceMgr.buildingService.reqExitIsland(User.userID);
        }
        // if (name == SceneType.MainScene) {
        //     // 进入
        //     ServiceMgr.buildingService.reqEnterIsland(User.userID);
        // }
        if (name == SceneType.LoginScene) {
            if (runName != SceneType.LoadingScene) {
                User.isAutoLogin = false;
                User.curMapUserID = null;
                User.curMapDataUserID = null;
                User.resetData();
                NetMgr.closeNet();
            }
        }
        director.loadScene(name, onLaunched, onUnloaded);
    }
    /**去其他王国 */
    public loadMainScene(userID: number = null) {
        let lastID = User.curMapUserID;
        User.curMapUserID = userID;
        if (lastID != userID) {
            // lastID离开
            ServiceMgr.buildingService.reqExitIsland(lastID);
            // userID进入
            // ServiceMgr.buildingService.reqEnterIsland(userID);
        }
        director.loadScene(SceneType.MainScene);
    }
}

export const SceneMgr = SceneManager.instance;