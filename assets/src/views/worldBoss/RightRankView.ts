import { _decorator, Component, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { GameBundle } from '../../GameRes';
import { inf_SpineAniCreate } from '../../manager/InterfaceDefines';
import { EventMgr } from '../../util/EventManager';
import List from '../../util/list/List';
import { BossRank, JoinAwards, WorldBossResponse } from './BossInfo';
import { RewardItemView } from './RewardItemView';
import { RightRankItem } from './RightRankItem';
const { ccclass, property } = _decorator;

export interface AwardInfo {
    type: string;
    value: number;
}

@ccclass('RightRankView')
export class RightRankView extends Component {

    @property(List)
    public rank_scroll:List = null;

    @property(List)
    public reward_scroll:List = null;

    @property(Node)
    public chest_node:Node = null;

    @property(Node)
    public complete_flag:Node = null;

    private _rewardList:AwardInfo[] = null;
    
    private _rankData:WorldBossResponse = null;
    start() {
        this.chest_node.removeAllChildren();
        let resConf = {bundle:GameBundle.NORMAL,path:"spine/chest/chest_divine/chest_divine.json"}
        let spinePrams:inf_SpineAniCreate = {
            resConf:resConf,
            aniName:"idle",
            parentNode:this.chest_node,
            isLoop:true,
        }
        EventMgr.dispatch(EventType.Sys_Ani_Play,spinePrams);
    }

    loadRankData(data:WorldBossResponse){
        this._rankData = data;
        console.log(this._rankData);
        this._rewardList = this.filterJoinAwards(data.Data.JoinAwards);
        this.rank_scroll.numItems = data.Data.RankList.length;
        this.reward_scroll.numItems = this._rewardList.length;
    }

    filterJoinAwards(joinAwards: JoinAwards):AwardInfo[] {
        let awardsArray: AwardInfo[] = [];
        // 遍历 JoinAwards 对象的属性，将大于 0 的键值对保存到数组中
        for (const key in joinAwards) {
            if (joinAwards.hasOwnProperty(key)) {
                const value = joinAwards[key];
                if (typeof value === "number" && value > 0) {
                    awardsArray.push({ type:key, value });
                }
            }
        }
        return awardsArray; 
    }

    onLoadBossVertical(item:Node, idx:number){
        let item_sript:RightRankItem = item.getComponent(RightRankItem);
        let rankInfo:BossRank = this._rankData.Data.RankList[idx];
        item_sript.updateRankItem(rankInfo,idx);
    }
    onLoadRewardHorizontal(item:Node, idx:number){
        let item_sript:RewardItemView = item.getComponent(RewardItemView);
        let itemInfo:AwardInfo = this._rewardList[idx];
        item_sript.updateRewardItem(itemInfo);
    }

}


