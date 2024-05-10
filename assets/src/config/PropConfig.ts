/**道具id 可能会修改*/
export enum PropID {
    coin = 1,//金币
    diamond = 2,//钻石
    energy = 3,//体力
    wood = 4,//木头
    gloves = 5,//手套
    scroll = 6,//卷轴
    hammer = 7,//铁锤
    hoe = 8,//锄头
    juice = 9,//果汁
    crystal = 10,//紫晶石
}
/**道具信息 */
export class PropInfo {
    id: number;//id
    name: string;//名字
    png: string;//图片
}

export const PropConfig: { [key: number]: PropInfo } = {
    [PropID.coin]: { id: PropID.coin, name: '金币', png: 'img_coin' },
    [PropID.diamond]: { id: PropID.diamond, name: '钻石', png: 'img_diamond' },
    [PropID.energy]: { id: PropID.energy, name: '体力', png: 'img_energy' },
    [PropID.wood]: { id: PropID.wood, name: '木头', png: 'img_wood' },
    [PropID.gloves]: { id: PropID.gloves, name: '手套', png: 'img_gloves' },
    [PropID.scroll]: { id: PropID.scroll, name: '卷轴', png: 'img_scroll' },
    [PropID.hammer]: { id: PropID.hammer, name: '铁锤', png: 'img_hammer' },
    [PropID.hoe]: { id: PropID.hoe, name: '锄头', png: 'img_hoe' },
    [PropID.juice]: { id: PropID.juice, name: '果汁', png: 'img_juice' },
    [PropID.crystal]: { id: PropID.crystal, name: '紫晶石', png: 'img_crystal' },
}

