import { _decorator, Label, Node, Sprite } from 'cc';
import { EventType } from '../../config/EventType';
import { InterfacePath } from '../../net/InterfacePath';
import CCUtil from '../../util/CCUtil';
import EventManager from '../../util/EventManager';
import ListItem from '../../util/list/ListItem';
import { WordSimpleData } from './SearchWordView';
const { ccclass, property } = _decorator;

@ccclass('WordHistoryItem')
export class WordHistoryItem extends ListItem {
    @property(Sprite)
    private bg: Node = null;

    @property(Label)
    private lblWord: Label = null;

    @property(Label)
    private lblContent: Label = null;

    @property({ type: Node, tooltip: "删除一条纪录按钮" })
    public btn_ClearWord: Node = null;

    data: WordSimpleData = null;

    private _delOneSearchWordEveId: string = "";

    onLoad(): void {
        //this.lblWord.string = "";
        //this.lblContent.string = "";
        // this.initEvent();
    }

    public init(data: WordSimpleData) { //{Word:'teacher', Cn:'老师'}
        if (!data) {
            console.log("search word data is null!");
            return;
        }
        this.data = data;
        this.lblWord.string = data.word;
        this.lblContent.string = data.cn;
    }

    initEvent() {
        CCUtil.onBtnClick(this.btn_ClearWord, this.onClearWord.bind(this));
    }

    /**点击清除一个单词历史 */
    onClearWord() {
        EventManager.emit(EventType.Search_Word_Del_OneWord, this.data.word);
        // this.node.destroy();
    }

    /**
     * 
     */
    onSearchDetail() {
        EventManager.emit(EventType.Search_Word_Item, this.data);
    }

    onClickClearItem() {
        EventManager.emit(InterfacePath.SearchWord_DelSingle, this.data);
    }
}


