import { _decorator, Component, Label, Node } from 'cc';
import { NetConfig } from '../../config/NetConfig';
import GlobalConfig from '../../GlobalConfig';
import { RemoteSoundMgr } from '../../manager/RemoteSoundManager';
import { SentenceData } from '../../models/AdventureModel';
import CCUtil from '../../util/CCUtil';
import { ToolUtil } from '../../util/ToolUtil';
const { ccclass, property } = _decorator;

@ccclass('WordSentensItem')
export class WordSentensItem extends Component {
    @property({ type: Node, tooltip: "喇叭" })
    horn: Node = null;
    @property({ type: Label, tooltip: "英文句子" })
    enLabel: Label = null;
    @property({ type: Label, tooltip: "中文句子" })
    cnLabel: Label = null;

    private _data: SentenceData = null;
    start() {
        this.addEvent();
    }

    onHornClick() {
        // let url = NetConfig.assertUrl + "/sounds/glossary/sentence_tts/Emily/" + this._data.id + ".wav";
        let soundName = ToolUtil.md5(this._data.sentence);
        let type = GlobalConfig.USE_US ? "us" : "en";
        let url = NetConfig.assertUrl + "/sounds/sentence/" + type + "/" + soundName + ".wav"
        RemoteSoundMgr.playSound(url);
    }

    addEvent() {
        CCUtil.onTouch(this.horn, this.onHornClick.bind(this), this);
    }

    removeEvent() {
        CCUtil.offTouch(this.horn, this.onHornClick.bind(this), this);
    }

    setData(data: SentenceData) {
        this._data = data;
        console.log("设置数据", data);
        this.enLabel.string = data.sentence;
        this.cnLabel.string = data.cn;
    }
}


