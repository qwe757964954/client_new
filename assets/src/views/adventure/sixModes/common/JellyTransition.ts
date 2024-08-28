import { _decorator, Component, easing, Node, tween, UIOpacity, UITransform, Vec3 } from 'cc';
import { PrefabType } from '../../../../config/PrefabType';
import { ViewsMgr } from '../../../../manager/ViewsManager';
import ImgUtil from '../../../../util/ImgUtil';
const { ccclass, property } = _decorator;

@ccclass('JellyTransition')
export class JellyTransition extends Component {
    @property(Node)
    public targetNode: Node = null; // 需要应用动画的目标节点

    @property({ type: Number, tooltip: '动画持续时间' })
    public duration: number = 0.5;

    @property({ type: Number, tooltip: '缩放因子' })
    public scaleFactor: number = 1.2;

    // 创建过渡视图
    async createTransitionView() {
        if (!this.targetNode) {
            console.error("目标节点未指定！");
            return;
        }
        if (!this.targetNode.getChildByName("dark")) {
            await ImgUtil.create_PureNode(this.targetNode);
            let dark = this.targetNode.getChildByName("dark");
            dark.addComponent(UIOpacity);
            dark.active = false;
        }
    }

    // 显示过渡视图（渐变、缩放和平移动画）
    showTransitionView(callback?: () => void) {
        let dark = this.targetNode.getChildByName("dark");
        dark.active = true;
        let uiOpacity = dark.getComponent(UIOpacity);
        uiOpacity.opacity = 0;

        let transform = dark.getComponent(UITransform);
        let originalScale = dark.scale.clone();
        let scaledUp = originalScale.multiplyScalar(this.scaleFactor);
        
        // 构建渐变、缩放和平移动画
        tween(uiOpacity)
            .to(this.duration, { opacity: 255 }, { easing: easing.sineInOut })
            .to(this.duration, { opacity: 0 }, { easing: easing.sineInOut })
            .start();

        tween(dark)
            .to(this.duration, { scale: scaledUp }, { easing: easing.elasticOut })
            .to(this.duration, { scale: originalScale }, { easing: easing.elasticIn })
            .call(() => {
                dark.active = false;
                ViewsMgr.closeView(PrefabType.JellyTransition);
                callback?.(); // 调用回调函数
            })
            .start();
    }

    // 显示平移动画
    showSlideTransition(targetPosition: Vec3, callback?: () => void) {
        if (!this.targetNode) {
            console.error("目标节点未指定！");
            return;
        }
        let startPosition = this.targetNode.position.clone();
        this.targetNode.active = true;
        this.targetNode.position = new Vec3(startPosition.x - 1000, startPosition.y, startPosition.z); // 从屏幕外的初始位置开始

        tween(this.targetNode)
            .to(this.duration, { position: targetPosition }, { easing: easing.quadInOut })
            .call(() => {
                callback?.(); // 调用回调函数
            })
            .start();
    }
}
