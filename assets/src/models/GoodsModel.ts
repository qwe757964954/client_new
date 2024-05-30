import { Node } from 'cc';

/**模拟查找好友返回数据 */
export interface GoodsItemData {
    id: number;   //id
    name: string; //名字
    desc: string;  //描述
    type: number; //小类型 11表示形象商店第一小类，帽子
    icon: string; //图标的图片名字
    price: number; //价格
    medal: number; //奖章
    land: number;  //地块数
    funtype: number; //功能性类型 0：无不显示  1.功能性 2.装饰性
}

var goods1: GoodsItemData = {
    id: 1001,
    name: "法师帽",
    desc: "这是一顶法师帽",
    type: 11,
    icon: "mofa02_maozi",
    price: 1000,
    medal: 100,
    land: 0,
    funtype: 2,
}

var goods2: GoodsItemData = {
    id: 1002,
    name: "银色发",
    desc: "这是银色发",
    type: 11,
    icon: "wanjv01_xiaoren2",
    price: 2000,
    medal: 120,
    land: 0,
    funtype: 2,
}

var goods3: GoodsItemData = {
    id: 1003,
    name: "法师头",
    desc: "这是法师头",
    type: 11,
    icon: "wanjv01_xiaoren4",
    price: 2200,
    medal: 130,
    land: 0,
    funtype: 2,
}

var goods4: GoodsItemData = {
    id: 1004,
    name: "银色发",
    desc: "这是好看的银色发",
    type: 12,
    icon: "wanjv01_xiaoren2",
    price: 2000,
    medal: 120,
    land: 0,
    funtype: 2,
}

var goods5: GoodsItemData = {
    id: 1005,
    name: "黄头发",
    desc: "这是好看的黄头发",
    type: 12,
    icon: "wanjv01_xiaoren1",
    price: 2200,
    medal: 140,
    land: 0,
    funtype: 2,
}

var goods6: GoodsItemData = {
    id: 1006,
    name: "黄衣服",
    desc: "这是好看的黄衣服",
    type: 13,
    icon: "wanjv01_xiaoren1",
    price: 1000,
    medal: 100,
    land: 0,
    funtype: 2,
}

var goods7: GoodsItemData = {
    id: 1007,
    name: "吊带装",
    desc: "这是帅气的吊带装",
    type: 13,
    icon: "wanjv01_xiaoren2",
    price: 2000,
    medal: 120,
    land: 0,
    funtype: 2,
}

var goods8: GoodsItemData = {
    id: 1008,
    name: "法师服",
    desc: "这是好看的法师服",
    type: 13,
    icon: "wanjv01_xiaoren4",
    price: 2200,
    medal: 130,
    land: 0,
    funtype: 2,
}

var goods9: GoodsItemData = {
    id: 1009,
    name: "美眉裤",
    desc: "这是妹子最钟爱的裤子",
    type: 14,
    icon: "wanjv01_xiaoren3",
    price: 2200,
    medal: 110,
    land: 0,
    funtype: 2,
}

var goods10: GoodsItemData = {
    id: 1010,
    name: "法师鞋",
    desc: "这是好看的法师鞋",
    type: 15,
    icon: "mofa03_mofamao",
    price: 2700,
    medal: 100,
    land: 0,
    funtype: 2,
}

var goods11: GoodsItemData = {
    id: 1011,
    name: "奥特鞋",
    desc: "这是奥特大侠穿过的靴子",
    type: 15,
    icon: "wanjv01_dijia",
    price: 2700,
    medal: 100,
    land: 0,
    funtype: 2,
}

var goods12: GoodsItemData = {
    id: 1012,
    name: "可爱妹",
    desc: "可爱的妹子谁能不爱",
    type: 16,
    icon: "wanjv01_xiaoren3",
    price: 2700,
    medal: 190,
    land: 0,
    funtype: 2,
}

var goods13: GoodsItemData = {
    id: 1013,
    name: "奥特大侠",
    desc: "奥特大侠，为民除害",
    type: 21,
    icon: "wanjv01_dijia",
    price: 2300,
    medal: 100,
    land: 0,
    funtype: 1,
}

var goods14: GoodsItemData = {
    id: 1014,
    name: "机器人",
    desc: "你也想要一个AI家政机器人吗？",
    type: 21,
    icon: "wanjv02_jiqiren",
    price: 2300,
    medal: 120,
    land: 0,
    funtype: 1,
}

var goods15: GoodsItemData = {
    id: 1015,
    name: "小丑",
    desc: "万圣节从宝箱怪中蹦出来的小丑，专门用来吓死你",
    type: 21,
    icon: "wanjv01_xiaochou",
    price: 2300,
    medal: 120,
    land: 0,
    funtype: 1,
}

var goods16: GoodsItemData = {
    id: 1016,
    name: "小熊",
    desc: "萌萌的小熊，准备好麻袋捕捉了吗？",
    type: 22,
    icon: "mofa02_wanjvxiong",
    price: 2300,
    medal: 110,
    land: 0,
    funtype: 1,
}

var goods17: GoodsItemData = {
    id: 1017,
    name: "蛋糕",
    desc: "你一定想吃一块这样的大蛋糕吧？",
    type: 22,
    icon: "shuiguo03_penquan",
    price: 2300,
    medal: 120,
    land: 0,
    funtype: 1,
}

var goods18: GoodsItemData = {
    id: 1018,
    name: "香蕉",
    desc: "这玩艺谁见谁爱吃",
    type: 22,
    icon: "shuiguo03_xiangjiao",
    price: 2300,
    medal: 120,
    land: 0,
    funtype: 1,
}

var goods19: GoodsItemData = {
    id: 1019,
    name: "领主城堡",
    desc: "至高无上的魔法领主居住的雄伟城堡",
    type: 31,
    icon: "gongneng04_mofawu",
    price: 2200,
    medal: 150,
    land: 10,
    funtype: 1,
}

var goods20: GoodsItemData = {
    id: 1020,
    name: "童话城堡",
    desc: "梦幻一般的童话一样的城堡，儿时的你做梦都想拥有一座吧？",
    type: 31,
    icon: "gongneng08_chenghbao",
    price: 2000,
    medal: 130,
    land: 15,
    funtype: 1,
}

var goods21: GoodsItemData = {
    id: 1021,
    name: "魔法作坊",
    desc: "可以生产各种奇奇怪怪的魔法道具哦",
    type: 32,
    icon: "gongneng05_guozhi",
    price: 2000,
    medal: 130,
    land: 9,
    funtype: 1,
}

var goods22: GoodsItemData = {
    id: 1022,
    name: "伐木小屋",
    desc: "造房子当然先要伐木制造木柴啦",
    type: 33,
    icon: "gongneng05_mucai",
    price: 1000,
    medal: 120,
    land: 8,
    funtype: 1,
}

var goods23: GoodsItemData = {
    id: 1023,
    name: "工具作坊",
    desc: "魔法城中高超手艺们的匠人们生产的场所",
    type: 34,
    icon: "gongneng05_gongjv",
    price: 1300,
    medal: 180,
    land: 9,
    funtype: 1,
}

var goods24: GoodsItemData = {
    id: 1024,
    name: "黄头发",
    desc: "这是一头靓丽的黄头发",
    type: 41,
    icon: "mofa01_qiqiu",
    price: 2200,
    medal: 140,
    land: 0,
    funtype: 2,
}

var goods25: GoodsItemData = {
    id: 1025,
    name: "吊带装",
    desc: "这是好看的吊带装，试试穿搭吧",
    type: 42,
    icon: "shuiguo02_yezi",
    price: 2000,
    medal: 120,
    land: 0,
    funtype: 2,
}

var goods26: GoodsItemData = {
    id: 1026,
    name: "银色发",
    desc: "这是好看的银色头发",
    type: 43,
    icon: "mofa02_huantan2",
    price: 2000,
    medal: 120,
    land: 0,
    funtype: 2,
}

var goods27: GoodsItemData = {
    id: 1026,
    name: "水晶鞋",
    desc: "王子意外捡落灰姑娘遗失的水晶鞋，从此过上了幸福的生活",
    type: 44,
    icon: "wanjv03_xiaoche",
    price: 2000,
    medal: 120,
    land: 0,
    funtype: 2,
}

var goods28: GoodsItemData = {
    id: 1028,
    name: "白手套",
    desc: "为什么坏人们做案时一定要先戴上一尘不染的白手套呢？",
    type: 45,
    icon: "wanjv04_feiji",
    price: 2000,
    medal: 120,
    land: 0,
    funtype: 2,
}

//所有商品
export var ShopAllGoods: GoodsItemData[] = [
    goods1, goods2, goods3, goods4, goods5, goods6, goods7, goods8, goods9, goods10,
    goods11, goods12, goods13, goods14, goods15, goods16, goods17, goods18, goods19, goods20,
    goods21, goods22, goods23, goods24, goods25, goods26, goods27, goods28,
];

