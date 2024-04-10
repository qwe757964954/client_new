export enum MapStatus{//地图状态
    DEFAULT = 0,//默认状态
    EDIT = 1,//编辑状态
    BUILD_EDIT = 2,//建筑编辑状态
    LAND_EDIT = 3,//地块编辑状态
    RECYCLE = 4,//回收状态
};

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
            {is : 12, ie : 48, js : 0, je : 6},
            {is : 12, ie : 60, js : 6, je : 42},
            {is : 12, ie : 66, js : 42, je : 60},
            {is : 0, ie : 12, js : 48, je : 66},
            {is : 12, ie : 72, js : 60, je : 72},
            {is : 18, ie : 54, js : 72, je : 78},
        ]
    },
    landWidth:2,//地块宽度
    landInfo : {//地块 必须是2*2的底（path路径 pathAry特殊地块图片数组）
        0 : {id:0, path:"map/dikuai02/spriteFrame"},
        1 : {id:1, path:"map/dikuai1/spriteFrame"},
        2 : {id:2, path:"map/dikuai2/spriteFrame"},
    },
    buildingInfo : {//建筑装饰 必须是n*n的底
        0 : {id:0, path:"map/zhuangshi1/spriteFrame",width:7,moveDt:1},
        1 : {id:1, path:"map/zhuangshi2/spriteFrame",width:7,moveDt:1},
        2 : {id:2, path:"map/zhuangshi3/spriteFrame",width:7,moveDt:1},
    }
}
