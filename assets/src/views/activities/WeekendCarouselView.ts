import { _decorator, Label, Node } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
import { CarouseRewardDrawResponse, SignRewardDrawResponse } from '../../models/ActivityModel';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { ActServer } from '../../service/ActivityService';
import { CongratulationsView } from '../task/CongratulationsView';
import { ActConfig } from './ActivityConfig';
import { MaxCarouseCount } from './ActvityInfo';
import { CarouselView } from './CarouselView';
const { ccclass, property } = _decorator;

@ccclass('WeekendCarouselView')
export class WeekendCarouselView extends BaseView {
    
    @property(CarouselView)
    public carouselView: CarouselView = null;

    @property(Label)
    public has_draw_label:Label = null;

    @property(Label)
    public max_draw_label:Label = null;

    @property(Node)
    public no_reward: Node = null;

    @property(Node)
    public has_reward: Node = null;

    private _signRewardDrawResponse:SignRewardDrawResponse = null;

    protected initUI(): void {
        this.carouselView.setFinishListener(this.onFinishListener.bind(this));
    }

    public updateData(): void {
        this.no_reward.active = true;
        this.has_reward.active = false;
        this.has_draw_label.string = `${MaxCarouseCount-ActConfig.activityInfoResponse.draw_status_list.length}`;
        this.max_draw_label.string = `${MaxCarouseCount}`;
    }

    protected onInitModuleEvent(): void {
        this.addModelListeners([
            [NetNotify.Classification_WeekendCarouselDraw, this.onWeekendCarouselDraw.bind(this)],
        ]);
    }

    async onWeekendCarouselDraw(response: CarouseRewardDrawResponse) {
        console.log("onWeekendCarouselDraw data = ", response);
        this._signRewardDrawResponse = response;
        this.carouselView.rotateToTarget(response.id)
        // this.updateWeekendCarousel(data); // 假设 updateWeekendCarousel是更新转盘的函数
    }

    async onFinishListener(){
        this.no_reward.active = false;
        this.has_reward.active = true;
        let node:Node = await ViewsManager.instance.showPopup(PrefabType.CongratulationsView);
        let nodeScript: CongratulationsView = node.getComponent(CongratulationsView);
        nodeScript.updateRewardScroll(this._signRewardDrawResponse.award);
        this.scheduleOnce(()=>{
            ActServer.reqGetActivityInfo();
        },3)
    }
}

