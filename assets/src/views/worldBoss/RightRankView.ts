import { _decorator, Component, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { GameBundle } from '../../GameRes';
import { inf_SpineAniCreate } from '../../manager/InterfaceDefines';
import { EventMgr } from '../../util/EventManager';
import List from '../../util/list/List';
import { AmoutItemData, AmoutType } from '../common/TopAmoutView';
import { RewardItemView } from './RewardItemView';
import { RightRankItem } from './RightRankItem';
const { ccclass, property } = _decorator;

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

    private _rewardList:AmoutItemData[] = [
        {type:AmoutType.Coin,num:500},
        {type:AmoutType.Diamond,num:20},
        {type:AmoutType.Energy,num:20}];
    

    start() {
        this.rank_scroll.numItems = 9;
        this.reward_scroll.numItems = this._rewardList.length;

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
    onLoadBossVertical(item:Node, idx:number){
        let item_sript:RightRankItem = item.getComponent(RightRankItem);
        item_sript.updateRankItem(idx);
    }
    onLoadRewardHorizontal(item:Node, idx:number){
        let item_sript:RewardItemView = item.getComponent(RewardItemView);
        let itemInfo:AmoutItemData = this._rewardList[idx];
        item_sript.updateRewardItem(itemInfo);
    }

}


