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
    nuomici = 11,//糯米糍
    pizza = 12,//披萨
    kebab = 13,//烤肉串
    chicken = 14,//烤鸡
    pig = 15,//烤乳猪
    towel = 16,//毛巾
    perfume = 17,//香水
    showerHead = 18,//花洒
    ball = 19,//玩球
    microphone = 20,//唱歌
    fireworks = 21,//烟花
}
/**道具信息 */
export class PropInfo {
    id: number;//id
    name: string;//名字
    png: string;//图片
    frame: string;//框图片
}
/**道具数据 */
export class PropData {
    id: number;//id
    num: number;//数量
}
