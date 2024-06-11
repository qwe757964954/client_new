import { Label, Node, UITransform, _decorator } from 'cc';
import { PropID } from '../../config/PropConfig';
import { ArchConfig, PropData } from '../../manager/DataMgr';
import List from '../../util/list/List';
import ListItem from '../../util/list/ListItem';
import { RewardItem } from '../common/RewardItem';
const { ccclass, property } = _decorator;

@ccclass('WeekAchievementItem')
export class WeekAchievementItem extends ListItem {

    @property(Label)
    num_text:Label = null;

    @property(Label)
    total_text:Label = null;

    @property(Label)
    title_text:Label = null;

    @property(List)
    award_list:List = null;

    private _propsData:PropData[] = [];

    /*
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
    soul = 22,//精灵魂魄
    ticket = 23,//抽奖券
}
*/

    updateAchievementProps(data: ArchConfig) {
        this.title_text.string = data.Info;
        this._propsData = [];
        for (let index = 0; index < data.Awards.length; index++) {
            let propsData:PropData = {
                id: index == 0 ? PropID.coin:PropID.diamond,
                num: parseInt(data.Awards[index])
            }
            this._propsData.push(propsData);
        }
        this.award_list.numItems = this._propsData.length;
    }

    loadRewardPropsHorizontal(item:Node, idx:number){
        let itemScript:RewardItem = item.getComponent(RewardItem);
        let node_trans = item.getComponent(UITransform);
        let scale = 92.4 / node_trans.height;
        item.setScale(scale,scale,scale)
        itemScript.init(this._propsData[idx]);
    }

}


