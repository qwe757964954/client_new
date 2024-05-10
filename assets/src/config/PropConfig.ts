/**道具id 可能会修改*/
export enum PropID {
    coin = 1,//金币
    diamond = 2,//钻石
    stamina = 3,//体力
    wood = 4,//木头
    gloves = 5,//手套
    scroll = 6,//卷轴
    hammer = 7,//铁锤
    hoe = 8,//锄头
    juice = 9,//果汁
    amethyst = 10,//紫晶石
}
/**道具信息 */
export class PropInfo {
    id: number;//id
    name: string;//名字
    png: string;//图片
}