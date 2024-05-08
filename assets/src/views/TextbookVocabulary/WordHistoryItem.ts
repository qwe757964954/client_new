import { _decorator, Component, Label, Node, Sprite } from 'cc';
import EventManager from '../../util/EventManager';
import { InterfacePath } from '../../net/InterfacePath';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;

@ccclass('WordHistoryItem')
export class WordHistoryItem extends Component {
    @property(Sprite)
    private bg: Node = null;

    @property(Label)
    private lblWord: Label = null;

    @property(Label)
    private lblContent: Label = null;

    @property({ type: Node, tooltip: "删除一条纪录按钮" })
    public btn_ClearWord: Node = null;

    data: any = null;

    private _delOneSearchWordEveId: string = "";

    protected onLoad(): void {
        //this.lblWord.string = "";
        //this.lblContent.string = "";
        this.initEvent();
    }

    protected onDestroy(): void {
        this.removeEvent();
    }

    public Init(data: any) { //{Word:'teacher', Cn:'老师'}
        if (!data) {
            console.log("search word data is null!");
            return;
        }

        this.data = data;
        this.lblWord.string = data.Word;
        this.lblContent.string = data.Cn;


    }

    initEvent() {
        CCUtil.onTouch(this.bg, this.onSearchDetail, this);
        CCUtil.onTouch(this.btn_ClearWord, this.onClearWord, this);
    }

    removeEvent() {
        CCUtil.offTouch(this.bg, this.onSearchDetail, this);
        CCUtil.offTouch(this.btn_ClearWord, this.onClearWord, this);
    }

    /**点击清除一个单词历史 */
    onClearWord() {
        //this._delOneSearchWordEveId = EventManager.emit("DelOneSearchWord", this.onDelOneSearchWord.bind(this));
        EventManager.emit("DelOneSearchWord", this.data.Word);
        this.node.destroy();
    }

    /**
     * 
     */
    onSearchDetail() {
        EventManager.emit("SearchWordItem", this.data);
    }

    onClickClearItem() {
        EventManager.emit(InterfacePath.SearchWord_DelSingle, this.data);
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


