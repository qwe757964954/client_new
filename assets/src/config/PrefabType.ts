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
    StudyView: { path: "study/StudyViewchange", zindex: Hierarchy.POPUPLAYER, tips: "学习模块选择" },

    PopView: { path: "common/PopView", zindex: Hierarchy.TIPLAYER, tips: "弹窗" },
    BaseRemindView: { path: "common/BaseRemindView", zindex: Hierarchy.TIPLAYER, tips: "二次提示界面" },

    // 设置相关
    SettingView: { path: "setting/SettingView", zindex: Hierarchy.POPUPLAYER, tips: "设置界面" },
    VideoView: { path: "setting/VideoView", zindex: Hierarchy.POPUPLAYER, tips: "视频播放界面" },
    ChangeHeadView: { path: "setting/ChangeHeadView", zindex: Hierarchy.POPUPLAYER, tips: "头像调整" },
    ChangeNameView: { path: "setting/ChangeNameView", zindex: Hierarchy.POPUPLAYER, tips: "设置昵称" },
    MyTableView: { path: "setting/MyTableView", zindex: Hierarchy.POPUPLAYER, tips: "我的表格" },
    // 设置相关END

    /*********************************************地图相关start***********************************************************/
    BuildingBtnView: { path: "map/BuildingBtnView", zindex: Hierarchy.POPUPLAYER, tips: "建筑按钮界面" },
    BuildingProduceView: { path: "map/BuildingProduceView", zindex: Hierarchy.POPUPLAYER, tips: "建筑生产界面" },


    /*********************************************地图相关end*************************************************************/
}