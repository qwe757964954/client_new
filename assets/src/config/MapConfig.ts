import { Rect, Vec3 } from "cc";

export enum MapStatus {//地图状态
    DEFAULT = 0,//默认状态
    // EDIT = 1,//编辑状态
    BUILD_EDIT = 2,//建筑编辑状态
    LAND_EDIT = 3,//地块编辑状态
    RECYCLE = 4,//回收状态
};

// export class RoleInfo {//角色配置
//     level: number;//等级(从1开始)
//     spPath: string;//spine路径
//     spNames: string[];//spine名字
//     rect: Rect;//[x,y,width,height]
// }
/**地图动画配置 */
export class MapSpInfo {
    id: number;//id
    path: string;//动画路径
    names: string[] = [];//动画名字
    pos: Vec3;//位置
    rect: Rect;//显示区域
    scale?: Vec3;//缩放
}

export const MapConfig = {
    bgInfo: {
        // num: 408,
        // width: 256,
        // height: 256,
        // col: 24,
        // row: 17,
        // midCol: 12,
        // midRow: 8,
        // path: "map/bg/bg{0}/spriteFrame",
        maxWidth: 6506,
        maxHeight: 4774,
        width: 256,
        height: 256,
        col: 26,
        row: 19,
        path: "map/newbg/bg{0}/spriteFrame",
        commonPath: "map/newbg/bg193/spriteFrame",
        commonAry: [
            // 194, 195, 217, 218, 219, 220, 221, 222, 223, 243,
            // 244, 245, 246, 247, 248, 249, 250, 251, 268, 269,
            // 270, 271, 272, 273, 274, 275, 276, 277, 278, 279,
            // 280, 281, 282, 296, 297, 298, 299, 300, 301, 302,
            // 303, 304, 305, 306, 307, 308, 323, 324, 325, 326,
            // 327, 328, 329, 330, 331, 332, 333, 334, 349, 350,
            // 351, 352, 353, 354, 355, 356, 357, 358, 376, 377,
            // 378, 379, 380, 381, 382, 404,
        ],
        preload: [
            "map/newbg/bg112/spriteFrame",
            "map/newbg/bg138/spriteFrame",
            "map/newbg/bg164/spriteFrame",
            "map/newbg/bg190/spriteFrame",
            "map/newbg/bg216/spriteFrame",
            "map/newbg/bg242/spriteFrame",
            "map/newbg/bg113/spriteFrame",
            "map/newbg/bg139/spriteFrame",
            "map/newbg/bg165/spriteFrame",
            "map/newbg/bg191/spriteFrame",
            "map/newbg/bg114/spriteFrame",
            "map/newbg/bg140/spriteFrame",
            "map/newbg/bg166/spriteFrame",
            "map/newbg/bg192/spriteFrame",
            "map/newbg/bg115/spriteFrame",
            "map/newbg/bg141/spriteFrame",
            "map/newbg/bg167/spriteFrame",
            "map/newbg/bg116/spriteFrame",
            "map/newbg/bg142/spriteFrame",
            "map/newbg/bg168/spriteFrame",
            "map/newbg/bg117/spriteFrame",
            "map/newbg/bg143/spriteFrame",
            "map/newbg/bg169/spriteFrame",
            "map/newbg/bg118/spriteFrame",
            "map/newbg/bg144/spriteFrame",
            "map/newbg/bg170/spriteFrame",
            "map/newbg/bg196/spriteFrame",
            "map/newbg/bg119/spriteFrame",
            "map/newbg/bg145/spriteFrame",
            "map/newbg/bg171/spriteFrame",
            "map/newbg/bg197/spriteFrame",
            "map/newbg/bg120/spriteFrame",
            "map/newbg/bg146/spriteFrame",
            "map/newbg/bg172/spriteFrame",
            "map/newbg/bg198/spriteFrame",
            "map/newbg/bg224/spriteFrame",
            "map/newbg/bg193/spriteFrame"
        ]
    },
    gridInfo: {
        dtX: 2,//格子X偏差
        dtY: 24,//格子Y偏差
        width: 72,//格子像素宽
        height: 36,//格子像素高
        col: 72,//格子列
        row: 78,//格子行
        range: [//可编辑范围
            // 从上往下 i左边 j右边
            { is: 12, ie: 48, js: 0, je: 12 },
            { is: 12, ie: 60, js: 12, je: 42 },
            { is: 12, ie: 72, js: 42, je: 48 },
            { is: 0, ie: 72, js: 48, je: 72 },
            { is: 12, ie: 54, js: 72, je: 78 },
        ]
    },
    minePos: { x: 350, y: 700 },
    roleScale: 0.2,
    roleGameScale: 0.6,
    spriteScale: 0.8,
    // roleInfo: {//101 男孩2, 102 女孩1, 103 男孩1
    //     101: [
    //         { level: 1, spPath: "animation/role/nanhai02", spNames: ["Idle", "Run"], rect: new Rect(-90, -10, 180, 280), }
    //     ],
    //     102: [
    //         { level: 1, spPath: "animation/role/nvhai01", spNames: ["Idle", "Run"], rect: new Rect(-70, -10, 140, 260), }
    //     ],
    //     103: [
    //         { level: 1, spPath: "animation/role/nanhai01", spNames: ["Idle", "Run"], rect: new Rect(-80, -10, 160, 260), }
    //     ],
    // },
    spriteInfo: {//101雷电 102狐狸 103龙
        1: [
            { level: 1, path: "animation/sprite/leidian01", actNames: ["idle", "run", "action", "attack", "skill"], rect: [-54, 0, 80, 90], },
            { level: 2, path: "animation/sprite/leidian02", actNames: ["idle", "run", "action", "attack", "skill"], rect: [-94, -14, 160, 160], },
            { level: 3, path: "animation/sprite/leidian03", actNames: ["idle", "run", "action", "attack", "skill"], rect: [-100, -14, 180, 200], },
            { level: 4, path: "animation/sprite/leidian04", actNames: ["idle", "run", "action", "attack", "skill"], rect: [-130, -20, 240, 240], },
            { level: 5, path: "animation/sprite/leidian05", actNames: ["idle", "run", "action", "attack", "skill"], rect: [-160, -30, 260, 260], },
            { level: 6, path: "animation/sprite/leidian06", actNames: ["idle", "run", "action", "attack", "skill"], rect: [-90, -10, 200, 350], },
        ],
        2: [
            { level: 1, path: "animation/sprite/huli01", actNames: ["idle", "run", "action", "attack", "skill"], rect: [-60, 0, 120, 110], },
            { level: 2, path: "animation/sprite/huli02", actNames: ["idle", "run", "action", "attack", "skill"], rect: [-90, 0, 160, 200], },
            { level: 3, path: "animation/sprite/huli03", actNames: ["idle", "run", "action", "attack", "skill"], rect: [-100, 0, 200, 260], },
            { level: 4, path: "animation/sprite/huli04", actNames: ["idle", "run", "action", "attack", "skill"], rect: [-120, 0, 200, 300], },
            { level: 5, path: "animation/sprite/huli05", actNames: ["idle", "run", "action", "attack", "skill"], rect: [-120, -10, 320, 340], },
            { level: 6, path: "animation/sprite/huli06", actNames: ["idle", "run", "action", "attack", "skill"], rect: [-190, 0, 340, 380], },
        ],
        3: [
            { level: 1, path: "animation/sprite/long01", actNames: ["idle", "run", "action", "attack", "skill"], rect: [-50, 0, 100, 120], },
            { level: 2, path: "animation/sprite/long02", actNames: ["idle", "run", "action", "attack", "skill"], rect: [-60, 0, 120, 160], },
            { level: 3, path: "animation/sprite/long03", actNames: ["idle", "run", "action", "attack", "skill"], rect: [-80, -10, 160, 260], },
            { level: 4, path: "animation/sprite/long04", actNames: ["idle", "run", "action", "attack", "skill"], rect: [-100, -10, 200, 280], },
            { level: 5, path: "animation/sprite/long05", actNames: ["idle", "run", "action", "attack", "skill"], rect: [-100, 0, 200, 320], },
            { level: 6, path: "animation/sprite/long06", actNames: ["idle", "run", "action", "attack", "skill"], rect: [-110, -20, 220, 350], },
        ],
    },
    landFlowers: [
        "map/land/dikuaihua1/spriteFrame",
        "map/land/dikuaihua2/spriteFrame",
        "map/land/dikuaihua3/spriteFrame",
        "map/land/dikuaihua4/spriteFrame",
        "map/land/dikuaihua5/spriteFrame",
        "map/land/dikuaihua6/spriteFrame",
        "map/land/dikuaihua7/spriteFrame",
    ],
    cloud:
    {
        width: 6,
        path: "map/cloud/{0}/spriteFrame",
        range: [//可编辑范围
            // 从上往下 i左边 j右边
            { is: 12, ie: 48, js: 0, je: 18 },
        ],
        pngs: [
            17, 11, 18, 14,
            16, 13, 12, 8,
            14, 15, 9, 14, 7, 2, 14, 19, 17, 1,
            13, 21, 17, 13, 17, 7, 4, 13, 18, 10,
            13, 17, 13, 21, 18, 16, 13, 12, 16, 18,
            21, 8, 1, 20, 1, 23, 17, 20, 13, 11,
            14, 7, 16, 4, 17, 13, 22, 14, 21, 15,
            15, 22, 7, 10, 20, 20, 1, 13, 23, 16,
            14, 16, 17, 20, 24, 17, 13, 20, 14, 9, 8,
            10, 2, 11, 14, 5, 19, 10, 17, 7, 5,
            13, 14, 4, 13, 6,
            6, 7, 16, 2, 12,
        ]
    },
    mapSp: [
        { id: 1, path: "spine/map/hdc", names: ["animation"], pos: new Vec3(1750, 330, 10), rect: new Rect(-250, -80, 500, 560) },
        { id: 2, path: "spine/map/ql", names: ["animation"], pos: new Vec3(2620, 1580, 10), rect: new Rect(-200, -100, 400, 240) },
        { id: 3, path: "spine/map/xuanwu", names: ["idle"], pos: new Vec3(-2750, 1150, 10), rect: new Rect(-200, -100, 400, 240), scale: new Vec3(-1, 1, 1) },
        { id: 4, path: "spine/map/shujingling", names: ["idle"], pos: new Vec3(-2040, -120, 10), rect: new Rect(-200, -60, 400, 400) },
        { id: 5, path: "spine/map/penquan", names: ["animation"], pos: new Vec3(-1400, -980, 10), rect: new Rect(-180, -70, 360, 340) },
        { id: 6, path: "spine/map/huodui", names: ["animation"], pos: new Vec3(-1080, -1430, 10), rect: new Rect(-200, 0, 400, 300) },
        { id: 7, path: "spine/map/bh", names: ["forward", "backward", "anger"], pos: new Vec3(-3360, -1620, 10), rect: new Rect(-100, -20, 200, 120), scale: new Vec3(-1, 1, 1) },
        { id: 8, path: "spine/map/fenghuang", names: ["idle", "idle2"], pos: new Vec3(2750, -1850, 10), rect: new Rect(-200, 0, 400, 300) },
    ],
    fence: {
        pillar: "map/img_build_pillar/spriteFrame",
        line: "map/img_build_line/spriteFrame",
        land: "map/land/dikuai_caodiyige/spriteFrame",
    },
}
