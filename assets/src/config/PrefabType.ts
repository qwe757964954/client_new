import { path } from "cc"

// 场景类型
export const SceneType = {
    LoadingScene: "LoadingScene",
    LoginScene: "LoginScene",
    MainScene: "MainScene",
}
/**窗口层级 */
export enum Hierarchy {

    SCENELAYER,

    POPUPLAYER,

    TIPLAYER,

    LOADINGLAYER,
}

export class PrefabConfig {
    public path: string;
    public zindex: number = Hierarchy.SCENELAYER;
    public tips: string;
}

// 预制体类型
export const PrefabType = {
    BuildingBtnView: { path: "map/BuildingBtnView", zindex: Hierarchy.SCENELAYER, tips: "界面名" },
    WorldMapView: { path: "adventure/WorldMapView", zindex: Hierarchy.SCENELAYER, tips: "大冒险 世界地图" },

    PopView: { path: "common/PopView", zindex: Hierarchy.TIPLAYER, tips: "弹窗" },
    
    // 设置相关
    SettingView: { path: "setting/SettingView", zindex: Hierarchy.POPUPLAYER, tips: "设置界面" },
    ChangeHeadView: { path: "setting/ChangeHeadView", zindex: Hierarchy.POPUPLAYER, tips: "头像调整" },
    // 设置相关END
}