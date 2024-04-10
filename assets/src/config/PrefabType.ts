import { path } from "cc"

// 场景类型
export const SceneType = {
    LoadingScene: "LoadingScene",
    LoginScene: "LoginScene",
    MainScene: "MainScene",
}
/**窗口层级 */
enum hierarchy {

    SCENELAYER,

    POPUPLAYER,

    TIPLAYER,

    LOADINGLAYER,
}
// 预制体类型
export const PrefabType = {
    BuildingBtnView: { path: "map/BuildingBtnView", zindex: hierarchy.SCENELAYER, tips: "界面名" },
    WorldMapView: { path: "adventure/WorldMapView", zindex: hierarchy.SCENELAYER, tips: "大冒险 世界地图" }
}