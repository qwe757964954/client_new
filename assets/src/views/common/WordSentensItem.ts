import { _decorator, Component, Label, Node } from 'cc';
import CCUtil from '../../util/CCUtil';
import RemoteSoundManager from '../../manager/RemoteSoundManager';
import NetConfig from '../../config/NetConfig';
const { ccclass, property } = _decorator;

@ccclass('WordSentensItem')
export class WordSentensItem extends Component {
    @property({ type: Node, tooltip: "喇叭" })
    horn: Node = null;
    @property({ type: Label, tooltip: "英文句子" })
    enLabel: Label = null;
    @property({ type: Label, tooltip: "中文句子" })
    cnLabel: Label = null;

    private _data: { Id: number, En: string, Cn: string } = null;
    start() {
        this.addEvent();
    }

    onHornClick() {
        let url = NetConfig.assertUrl + "/sounds/glossary/sentence_tts/Emily/" + this._data.Id + ".wav";
        RemoteSoundManager.i.playSound(url);
    }

    addEvent() {
        CCUtil.onTouch(this.horn, this.onHornClick.bind(this), this);
    }

    removeEvent() {
        CCUtil.offTouch(this.horn, this.onHornClick.bind(this), this);
    }

    setData(data: { Id: number, En: string, Cn: string }) {
        this._data = data;
        console.log("设置数据", data);
        this.enLabel.string = data.En;
        this.cnLabel.string = data.Cn;
    }
}


