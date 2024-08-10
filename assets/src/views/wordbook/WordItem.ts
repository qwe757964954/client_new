import { _decorator, Component, Label, Node, Toggle } from 'cc';
import { SoundMgr } from '../../manager/SoundMgr';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;
/**单词信息 */
export class WordItemInfo {
    word: string;//单词
    cn: string;//中文解释
    symbol: string;//音标 英标
    symbolus: string;//音标 美标

    isShowCn: boolean = true;
    isSelect: boolean = null;
    idx: number = 0;//索引
}

@ccclass('WordItem')
export class WordItem extends Component {
    @property(Node)
    public bg: Node = null;
    @property(Node)
    public selectBg: Node = null;
    @property(Label)
    public labelWord: Label = null;
    @property(Label)
    public labelSymbols: Label = null;
    @property(Label)
    public labelCn: Label = null;
    @property(Toggle)
    public toggle: Toggle = null;
    @property(Node)
    public btnHorn: Node = null;
    @property(Node)
    public btnMore: Node = null;

    private _data: WordItemInfo = null;
    private _moreCall: Function = null;
    private _selectCall: Function = null;

    private initEvent() {
        CCUtil.onTouch(this.btnHorn, this.onHorn, this);
        CCUtil.onTouch(this.btnMore, this.onMore, this);
        this.toggle.node.on(Toggle.EventType.TOGGLE, this.onSelect, this);
    }

    public init(data: WordItemInfo, moreCall?: Function, selectCall?: Function) {
        if (null == data.isSelect) {
            this.toggle.node.active = false;
        } else {
            this.toggle.node.active = true;
            if (data.isSelect) {
                this.bg.active = false;
                this.selectBg.active = true;
            } else {
                this.bg.active = true;
                this.selectBg.active = false;
            }
            this.toggle.isChecked = data.isSelect;
        }

        this._data = data;
        this.labelWord.string = data.word;
        this.labelCn.string = data.cn;
        this.labelCn.node.active = data.isShowCn;
        this.labelSymbols.string = data.symbol;
        this._moreCall = moreCall;
        this._selectCall = selectCall;
    }

    private onHorn() {
    }

    private onMore() {
        if (this._moreCall) {
            this._moreCall(this._data);
        }
    }

    private onSelect() {
        SoundMgr.click();
        if (this._selectCall) {
            this._selectCall(this._data, this.toggle.isChecked);
        }
    }
}


