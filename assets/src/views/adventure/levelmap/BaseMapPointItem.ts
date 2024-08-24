import { _decorator, Component, isValid, Label, Node, Sprite } from 'cc';
import CCUtil from '../../../util/CCUtil';

const { ccclass, property } = _decorator;

@ccclass('BaseMapPointItem')
export class BaseMapPointItem extends Component {
    @property({ type: [Node], tooltip: "星星" })
    public stars: Node[] = [];
    
    @property({ type: Node, tooltip: "底盘" })
    public bgNode: Node = null;
    
    @property({ type: Label, tooltip: "关卡Label" })
    public levelLabel: Label = null;

    protected initStars(flagInfo: any) {
        this.clearPointStars();
        if (isValid(flagInfo)) {
            for (let i = 0; i < 3; i++) {
                if (isValid(flagInfo[`star_${i + 1}`])) {
                    this.stars[i].getComponent(Sprite).grayscale = false;
                } else {
                    this.stars[i].getComponent(Sprite).grayscale = true;
                }
            }
        }
    }

    protected clearPointStars() {
        this.stars.forEach(star => {
            star.getComponent(Sprite).grayscale = true;
        });
    }
    
    start() {
        this.initEvent();
    }

    protected initEvent() {
        CCUtil.onBtnClick(this.bgNode, this.onItemClick.bind(this));
    }

    protected onItemClick() {
        // To be overridden by subclasses
    }
}
