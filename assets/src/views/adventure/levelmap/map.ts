import { _decorator, Component, instantiate, Node, Sprite, SpriteAtlas, SpriteFrame, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('map')
export class Map extends Component {
    @property({ type: Node, tooltip: "默认图片" })
    public defaultImg: Node = null;
    @property({ type: [SpriteFrame], tooltip: "关卡图片" })
    public imgArray: SpriteFrame[] = [];
    start() {

    }

    update(deltaTime: number) {

    }
  

    public setimg(id: number) {

        this.defaultImg.getComponent(Sprite).spriteFrame = this.imgArray[id];

    }

}


