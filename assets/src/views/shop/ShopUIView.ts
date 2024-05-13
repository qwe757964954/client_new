import { _decorator, Node } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
import { User } from '../../models/User';
import { BaseView } from '../../script/BaseView';
import { NavTitleView } from '../common/NavTitleView';
import { AmoutItemData, AmoutType, TopAmoutView } from '../common/TopAmoutView';
const { ccclass, property } = _decorator;

@ccclass('ShopUIView')
export class ShopUIView extends BaseView {

    @property(Node)
    public top_layout:Node = null;          // 商城


    start() {
        this.initUI();
    }
    initUI(){
        this.initNavTitle();
        this.initAmout();
    }

    /**初始化导航栏 */
    initNavTitle(){
        ViewsManager.addNavigation(this.top_layout,0,0).then((navScript: NavTitleView) => {
            navScript.updateNavigationProps(`商店`,()=>{
                ViewsManager.instance.closeView(PrefabType.ShopUIView);
            });
        });
    }
    /**初始化游戏数值 */
    initAmout(){
        ViewsManager.addAmout(this.top_layout,5.471,42.399).then((amoutScript: TopAmoutView) => {
            let dataArr:AmoutItemData[] = [{type:AmoutType.Diamond,num:User.diamond},
                {type:AmoutType.Coin,num:User.coin},
                {type:AmoutType.Energy,num:User.stamina}];
            amoutScript.loadAmoutData(dataArr);
        });
    }

    update(deltaTime: number) {
        
    }
}


