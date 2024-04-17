export enum MapStatus{//地图状态
    DEFAULT = 0,//默认状态
    EDIT = 1,//编辑状态
    BUILD_EDIT = 2,//建筑编辑状态
    LAND_EDIT = 3,//地块编辑状态
    RECYCLE = 4,//回收状态
};

export enum EditType {//编辑元素类型
    Buiding = 0,//建筑
    Decoration = 1,//装饰
    Land = 2,//地块
}

export class EditInfo {//编辑元素配置
    id : number;//id
    path : string;//路径
    type : EditType;//类型
    width : number;//宽
    moveDt : number;//移动格子数
}

export class RoleInfo {//角色配置
    id : number;//id
    spPath : string;//spine路径
}

export const MapConfig = {
    bgInfo : {
        num : 408,
        width : 256,
        height : 256,
        col : 24,
        row : 17,
        midCol : 12,
        midRow : 8,
        path : "map/bg/bg{0}/spriteFrame",
        commonPath : "map/bg/bg154/spriteFrame",
        commonAry : [
            155,156,157,176,177,178,179,180,181,182,
            200,201,202,203,204,205,206,207,208,224,
            225,226,227,228,229,230,231,232,233,234,
            235,236,237,249,250,251,252,253,254,255,
            256,257,258,259,260,274,275,276,277,278,
            279,280,281,282,283,284,285,299,300,301,
            302,303,304,305,306,307,324,325,326,328,
            329,
        ]
    },
    gridInfo : {
        dtX : 3,//格子X偏差
        dtY : 26,//格子Y偏差
        width : 72,//格子像素宽
        height : 36,//格子像素高
        col : 72,//格子列
        row : 78,//格子行
        range : [//可编辑范围
            // 从上往下 i左边 j右边
            {is : 12, ie : 48, js : 0, je : 12},
            {is : 12, ie : 60, js : 12, je : 42},
            {is : 12, ie : 66, js : 42, je : 60},
            {is : 0, ie : 12, js : 48, je : 66},
            {is : 12, ie : 72, js : 60, je : 72},
            {is : 18, ie : 54, js : 72, je : 78},
        ]
    },
    editInfo : {//编辑元素
        0 : {id:0, path:"map/zhuangshi2/spriteFrame",type:EditType.Buiding,width:7,moveDt:1},
        1 : {id:1, path:"map/zhuangshi2/spriteFrame",type:EditType.Buiding,width:7,moveDt:1},
        2 : {id:2, path:"map/zhuangshi3/spriteFrame",type:EditType.Buiding,width:7,moveDt:1},
        3 : {id:3, path:"map/dikuai02/spriteFrame",type:EditType.Land,width:2,moveDt:2},//默认地块
        4 : {id:4, path:"map/dikuai1/spriteFrame",type:EditType.Land,width:2,moveDt:2},
        5 : {id:5, path:"map/dikuai2/spriteFrame",type:EditType.Land,width:2,moveDt:2},
        //测试添加
        6 : {id:6, path:"map/zhuangshi2/spriteFrame",type:EditType.Buiding,width:7,moveDt:1},
        7 : {id:7, path:"map/zhuangshi2/spriteFrame",type:EditType.Buiding,width:7,moveDt:1},
        8 : {id:8, path:"map/zhuangshi3/spriteFrame",type:EditType.Buiding,width:7,moveDt:1},
        9 : {id:9, path:"map/dikuai3/spriteFrame",type:EditType.Land,width:2,moveDt:2},
        10 : {id:10, path:"map/dikuai4/spriteFrame",type:EditType.Land,width:2,moveDt:2},
        11 : {id:11, path:"map/dikuai2/spriteFrame",type:EditType.Land,width:2,moveDt:2},
    },
    roleInfo : [//101 男孩2, 102 女孩1, 103 男孩1
        {
            id:101, spPath:"animtion/role/nanhai02",spNames:["Idle","Run"],
        },
        {
            id:102, spPath:"animtion/role/nvhai01",spNames:["Idle","Run"],
        },
        {
            id:103, spPath:"animtion/role/nanhai01",spNames:["Idle","Run"],
        },
    ],
}
