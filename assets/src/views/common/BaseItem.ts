import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BaseItem')
export class BaseItem extends Component {

    @property({ type: Sprite, tooltip: "背景类型" })
    public bgType: Sprite = null;

    @property({ type: [SpriteFrame], tooltip: "背景资源" })
    public bgRes : SpriteFrame[] = [];
    @property({ type: Sprite, tooltip: "图标icon" })
    public imgIcon: Sprite = null;
    @property({ type: Label, tooltip: "数量" })
    public num: Label = null;
    start() {

    }

    update(deltaTime: number) {
        
    }


}


