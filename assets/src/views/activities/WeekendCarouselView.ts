import { _decorator } from 'cc';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { CarouselView } from './CarouselView';
const { ccclass, property } = _decorator;

@ccclass('WeekendCarouselView')
export class WeekendCarouselView extends BaseView {
    
    @property(CarouselView)
    public carouselView: CarouselView = null;

    protected onInitModuleEvent(): void {
        this.addModelListeners([
            [NetNotify.Classification_WeekendCarouselDraw, this.onWeekendCarouselDraw.bind(this)],
        ]);
    }

    onWeekendCarouselDraw(data: any) {
        console.log("onWeekendCarouselDraw data = ", data);
        // this.updateWeekendCarousel(data); // 假设 updateWeekendCarousel是更新转盘的函数
    }
}

