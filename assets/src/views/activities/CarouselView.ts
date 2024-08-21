import { _decorator, Component, instantiate, Label, misc, Node, Prefab, Tween, tween } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { ResLoader } from '../../manager/ResLoader';
import { ViewsMgr } from '../../manager/ViewsManager';
import { ActServer } from '../../service/ActivityService';
import CCUtil from '../../util/CCUtil';
import { ActConfig } from './ActivityConfig';
import { MaxCarouseCount } from './ActvityInfo';
const { ccclass, property } = _decorator;

@ccclass('CarouselView')
export class CarouselView extends Component {

    @property(Node)
    public wheel: Node = null; // 转盘节点

    @property(Node)
    public start_btn: Node = null; // 开始按钮节点

    @property(Node)
    public point_node: Node = null; // 指针节点

    private isSpinning: boolean = false; // 用于防止多次点击

    private _finishListener:() => void = null; 

    start() {
        this.createAndArrangeItems();
        this.initEvent();
    }

    setFinishListener(finishListener:()=>void) {
        this._finishListener = finishListener;
    }

    initEvent() {
        CCUtil.onBtnClick(this.start_btn, this.onStartWheel.bind(this));
    }

    async createAndArrangeItems() {
        const elementCount = 8;
        const radius = 235;
        const prefab = await ResLoader.instance.loadAsyncPromise<Prefab>("resources", `prefab/${PrefabType.Carouseltem.path}`, Prefab) as Prefab;
        
        for (let i = 0; i < elementCount; i++) {
            // 从90度开始排列元素
            const angle = ((i / elementCount) * 2 * Math.PI) + (Math.PI / 2); // 调整起始角度为90度
            console.log("angle: " + angle)
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
    
            const newItem = instantiate(prefab);
            newItem.setPosition(x, y);
            newItem.angle = misc.radiansToDegrees(angle) - 90; // 元素面向圆心并调整角度相对于起始角度
            newItem.getChildByName("num_text").getComponent(Label).string = `${i + 1}`;
            this.wheel.addChild(newItem);
        }
    }

    onStartWheel() {
        if(ActConfig.activityInfoResponse.draw_status_list.length >= MaxCarouseCount){
            ViewsMgr.showTip(TextConfig.Insufficient_Draw_Carousel);
            return;
        }
        if (this.isSpinning) return; // 如果正在旋转，直接返回
        ActServer.reqWeekendCarouselDraw();
    }



    rotateToTarget(targetIndex: number) {
        this.isSpinning = true; // 设置旋转标志

        const elementCount = 8;
        const rotationPerElement = 360 / elementCount;
        const targetAngle = 360 - (targetIndex * rotationPerElement); // 计算目标角度，0度在顶部

        const currentAngle = this.wheel.angle % 360; // 获取当前角度
        const targetRotation = targetAngle + (5 * 360); // 添加额外旋转圈数以确保动画效果

        // 计算相对旋转角度
        const relativeRotation = targetRotation - currentAngle;
        const totalRotation = currentAngle + relativeRotation;
        
        console.log("rotateToTarget....", totalRotation);
        this.startPointerSwing();
        // 先将角度重置为0，然后再旋转到目标角度
        tween(this.wheel)
            .to(0, { angle: currentAngle })
            .call(() => {
                tween(this.wheel)
                    .to(3, { angle: totalRotation }, { easing: 'cubicInOut' })
                    .call(() => {
                        this.stopPointerSwing();
                        this.isSpinning = false; // 旋转完成后，重置旋转标志
                    })
                    .start();
            })
            .start();
    }

    startPointerSwing() {
        // 定义指针的摇摆动画
        tween(this.point_node)
            .repeatForever(
                tween()
                    .to(0.1, { angle: 15 }, { easing: 'sineInOut' })
                    .to(0.1, { angle: -15 }, { easing: 'sineInOut' })
                    .to(0.1, { angle: 0 }, { easing: 'sineInOut' })
            )
            .start();
    }

    stopPointerSwing() {
        // 停止所有指针节点上的动画
        Tween.stopAllByTarget(this.point_node);
        // 重置指针角度
        this.point_node.angle = 0;
        this._finishListener?.();
    }
}
