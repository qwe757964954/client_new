import { _decorator, Component, isValid, Label, Node, Sprite } from 'cc';
import { MapLevelData, MicroListItem } from '../../../models/AdventureModel';
const { ccclass, property } = _decorator;

export enum StarType {
    star_one = "star_one",/**第一颗星星*/
    star_two = "star_two",/**第二颗星星*/
    star_three = "star_three",/**第三颗星星*/
}

@ccclass('MapPointItem')
export class MapPointItem extends Component {
    @property({ type: [Node], tooltip: "星星" })
    public stars: Node[] = [];
    @property({ type: Node, tooltip: "底盘" })
    public bgNode: Node = null;
    @property({ type: Label, tooltip: "关卡Label" })
    public levelLabel: Label = null;

    public data: MapLevelData | MicroListItem = null;

    public index: number = 0;



    start() {

    }

    //大冒险关卡点初始化
    initData(data: MicroListItem) {
        this.data = data;
        this.levelLabel.string = data.small_id + "-" + data.micro_id;
        if (!data.can_play) {
            for (let i = 0; i < this.stars.length; i++) {
                this.stars[i].active = false;
            }
            this.bgNode.getComponent(Sprite).grayscale = true;
            return;
        }
        this.bgNode.getComponent(Sprite).grayscale = false;
        this.clearPointStars();
        if (isValid(data.flag_info) && isValid(data.flag_info.star_one)) {
            if (isValid(data.flag_info.star_one)) {
                this.stars[0].getComponent(Sprite).grayscale = false;
            }
            if (isValid(data.flag_info.star_two)) {
                this.stars[1].getComponent(Sprite).grayscale = false;
            }
            if (isValid(data.flag_info.star_three)) {
                this.stars[2].getComponent(Sprite).grayscale = false;
            }
        }
    }

    clearPointStars() {
        for (let i = 0; i < this.stars.length; i++) {
            this.stars[i].getComponent(Sprite).grayscale = true;
        }
    }

    //教材单词关卡点初始化
    initSmallData(data: MapLevelData) {
        this.data = data;
        let big_id = data.big_id.replace("Unit ", "").trim();
        this.levelLabel.string = big_id + "-" + data.small_id;
        this.clearPointStars();
        if (isValid(data.flag_info) && isValid(data.flag_info.star_one)) {
            if (isValid(data.flag_info.star_one)) {
                this.stars[0].getComponent(Sprite).grayscale = false;
            }
            if (isValid(data.flag_info.star_two)) {
                this.stars[1].getComponent(Sprite).grayscale = false;
            }
            if (isValid(data.flag_info.star_three)) {
                this.stars[2].getComponent(Sprite).grayscale = false;
            }
        }
    }
}


