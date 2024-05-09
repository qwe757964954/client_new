import { _decorator, Component, EventTouch, Node, resources, Sprite } from 'cc';
import { NetConfig } from '../../config/NetConfig';
import ImgUtil from '../../util/ImgUtil';
import { LoadManager } from '../../manager/LoadManager';
import CCUtil from '../../util/CCUtil';
import EventManager from '../../util/EventManager';
const { ccclass, property } = _decorator;

@ccclass('WordCardBackItem')
export class WordCardBackItem extends Component {
    public data: any = null;

    Init(data) { // {"Level": "B", "CardImg": "1-14", "CardNo": "1014"}
        if (!data) return;
        this.data = data;
        let cardNo = Number(data.CardNo);
        let cardImg = data.CardImg;
        //设置图片
        let wordImgUrl: string = "";//
        /*if (cardNo < 1000) {
            wordImgUrl = NetConfig.currentUrl + "/assets/imgs/newcard/" + data.CardNo + ".png";
        }
        else {
            let bigId = Math.floor((data.CardNo - 100000) / 1000);
            let smallId = (data.CardNo - 100000) % 1000;
            wordImgUrl = NetConfig.currentUrl + "/assets/imgs/newcard/" + bigId + "-" + smallId + ".png";
        }*/
        wordImgUrl = NetConfig.currentUrl + "/assets/imgs/newcard/" + data.CardNo + ".png";
        // 现在暂时不可用，正式版才用
        //ImgUtil.loadRemoteImage(wordImgUrl, this.node, 300, 402);
        //测试
        let imgSpr: Sprite = this.node.getChildByName("img").getComponent(Sprite);
        let imgUrl: string = "adventure/monster/" + cardImg + "/spriteFrame";
        LoadManager.loadSprite(imgUrl, imgSpr);

        CCUtil.onTouch(this.node, this.onCardClick, this);
    }

    protected onDestroy(): void {
        CCUtil.offTouch(this.node, this.onCardClick, this);
    }

    onCardClick(e: EventTouch) {
        EventManager.emit("CardBookView_CardClick", this.data);
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


