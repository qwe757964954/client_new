import { Rect } from "cc";

export enum MapStatus {//地图状态
    DEFAULT = 0,//默认状态
    EDIT = 1,//编辑状态
    BUILD_EDIT = 2,//建筑编辑状态
    LAND_EDIT = 3,//地块编辑状态
    RECYCLE = 4,//回收状态
};

export class RoleInfo {//角色配置
    level: number;//等级(从1开始)
    spPath: string;//spine路径
    spNames: string[];//spine名字
    rect: Rect;//[x,y,width,height]
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
        commonPath: "map/bg/bg154/spriteFrame",
        commonAry: [
            155, 156, 157, 176, 177, 178, 179, 180, 181, 182,
            200, 201, 202, 203, 204, 205, 206, 207, 208, 224,
            225, 226, 227, 228, 229, 230, 231, 232, 233, 234,
            235, 236, 237, 249, 250, 251, 252, 253, 254, 255,
            256, 257, 258, 259, 260, 274, 275, 276, 277, 278,
            279, 280, 281, 282, 283, 284, 285, 299, 300, 301,
            302, 303, 304, 305, 306, 307, 324, 325, 326, 328,
            329,
        ]
    },
    gridInfo: {
        dtX: 2,//格子X偏差
        dtY: 26,//格子Y偏差
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
    roleInfo: {//101 男孩2, 102 女孩1, 103 男孩1
        101: [
            { level: 1, spPath: "animtion/role/nanhai02", spNames: ["Idle", "Run"], rect: new Rect(-90, -10, 180, 280), }
        ],
        102: [
            { level: 1, spPath: "animtion/role/nvhai01", spNames: ["Idle", "Run"], rect: new Rect(-70, -10, 140, 260), }
        ],
        103: [
            { level: 1, spPath: "animtion/role/nanhai01", spNames: ["Idle", "Run"], rect: new Rect(-80, -10, 160, 260), }
        ],
    },
    spriteInfo: {//101雷电 102狐狸 103龙
        101: [
            { level: 1, spPath: "animtion/sprite/leidian01", spNames: ["idle", "run", "action", "attack", "skill"], rect: new Rect(-54, 0, 80, 90), },
            { level: 2, spPath: "animtion/sprite/leidian02", spNames: ["idle", "run", "action", "attack", "skill"], rect: new Rect(-94, -14, 160, 160), },
            { level: 3, spPath: "animtion/sprite/leidian03", spNames: ["idle", "run", "action", "attack", "skill"], rect: new Rect(-100, -14, 180, 200), },
            { level: 4, spPath: "animtion/sprite/leidian04", spNames: ["idle", "run", "action", "attack", "skill"], rect: new Rect(-130, -20, 240, 240), },
            { level: 5, spPath: "animtion/sprite/leidian05", spNames: ["idle", "run", "action", "attack", "skill"], rect: new Rect(-160, -30, 260, 260), },
            { level: 6, spPath: "animtion/sprite/leidian06", spNames: ["idle", "run", "action", "attack", "skill"], rect: new Rect(-90, -10, 200, 350), },
        ],
        102: [
            { level: 1, spPath: "animtion/sprite/huli01", spNames: ["idle", "run", "action", "attack", "skill"], rect: new Rect(-120, 0, 120, 110), },
            { level: 2, spPath: "animtion/sprite/huli02", spNames: ["idle", "run", "action", "attack", "skill"], rect: new Rect(-90, 0, 160, 200), },
            { level: 3, spPath: "animtion/sprite/huli03", spNames: ["idle", "run", "action", "attack", "skill"], rect: new Rect(-100, 0, 200, 260), },
            { level: 4, spPath: "animtion/sprite/huli04", spNames: ["idle", "run", "action", "attack", "skill"], rect: new Rect(-120, 0, 200, 300), },
            { level: 5, spPath: "animtion/sprite/huli05", spNames: ["idle", "run", "action", "attack", "skill"], rect: new Rect(-120, -10, 320, 340), },
            { level: 6, spPath: "animtion/sprite/huli06", spNames: ["idle", "run", "action", "attack", "skill"], rect: new Rect(-190, 0, 340, 380), },
        ],
        103: [
            { level: 1, spPath: "animtion/sprite/long01", spNames: ["idle", "run", "action", "attack", "skill"], rect: new Rect(-50, 0, 100, 120), },
            { level: 2, spPath: "animtion/sprite/long02", spNames: ["idle", "run", "action", "attack", "skill"], rect: new Rect(-60, 0, 120, 160), },
            { level: 3, spPath: "animtion/sprite/long03", spNames: ["idle", "run", "action", "attack", "skill"], rect: new Rect(-80, -10, 160, 260), },
            { level: 4, spPath: "animtion/sprite/long04", spNames: ["idle", "run", "action", "attack", "skill"], rect: new Rect(-100, -10, 200, 280), },
            { level: 5, spPath: "animtion/sprite/long05", spNames: ["idle", "run", "action", "attack", "skill"], rect: new Rect(-100, 0, 200, 320), },
            { level: 6, spPath: "animtion/sprite/long06", spNames: ["idle", "run", "action", "attack", "skill"], rect: new Rect(-110, -20, 220, 350), },
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
    cloud: [
        "map/cloud/lock_yun1/spriteFrame",
        "map/cloud/lock_yun2/spriteFrame",
        "map/cloud/lock_yun3/spriteFrame",
        "map/cloud/lock_yun4/spriteFrame",
        "map/cloud/lock_yun5/spriteFrame",
        "map/cloud/lock_yun6/spriteFrame",
        "map/cloud/lock_yun7/spriteFrame",
    ]
}
