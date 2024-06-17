import { _decorator } from 'cc';
import { ItemData } from '../manager/DataMgr';
const { ccclass, property } = _decorator;

//木头
var data1: ItemData = {
    id: 4,
    num: 200,
};
//铁锤
var data2: ItemData = {
    id: 7,
    num: 300,
};
//锄头
var data3: ItemData = {
    id: 8,
    num: 320,
};
//烤乳猪
var data4: ItemData = {
    id: 15,
    num: 120,
};
//手套
var data5: ItemData = {
    id: 5,
    num: 2,
};
//烤肉串
var data6: ItemData = {
    id: 13,
    num: 320,
};
//果汁
var data7: ItemData = {
    id: 9,
    num: 50,
}
//烤鸡
var data8: ItemData = {
    id: 14,
    num: 50,
}
//披萨
var data9: ItemData = {
    id: 12,
    num: 30,
}
//糯米糍
var data10: ItemData = {
    id: 11,
    num: 30,
}
//玩球
var data11: ItemData = {
    id: 19,
    num: 36,
}
//唱歌
var data12: ItemData = {
    id: 20,
    num: 46,
}
//所有物品
export var BagAllProps: ItemData[] = [
    data1, data2, data3, data4, data5, data6, data7, data8, data9, data10, data11, data12
];
//装饰品
export var BagDecoratorProps: ItemData[] = [
    data5,
];
//消耗品
export var BagConsumeProps: ItemData[] = [
    data1, data2, data3, data4, data6, data7, data8, data9, data10,
];

//其他
export var BagOtherProps: ItemData[] = [
    data11, data12
];




