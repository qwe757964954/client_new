import { _decorator, Label, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import RemoteImageManager from '../../manager/RemoteImageManager';
import { ViewsMgr } from '../../manager/ViewsManager';
import { WordGameSubjectReply } from '../../models/AdventureModel';
import { BasePopup } from '../../script/BasePopup';
import CCUtil from '../../util/CCUtil';
import { EventMgr } from '../../util/EventManager';
import List from '../../util/list/List';
import { PracticeView } from './PracticeView';
import { KnowlegeItem } from './item/KnowlegeItem';
import { ThemeWordItem } from './item/ThemeWordItem';
const { ccclass, property } = _decorator;

@ccclass('SubjectView')
export class SubjectView extends BasePopup {
    @property(Node)
    public closeBtn: Node;
    @property(Label)
    public title: Label;
    @property(List)
    public wordList: List;
    @property(Node)
    public practiceBtn: Node = null; //练习按钮
    @property(List)
    knowledgeList: List = null;
    @property(Label)
    public btnLabel: Label;
    private _data: WordGameSubjectReply;

    private _isRequesting: boolean = false; //是否正在请求数据

    protected initUI(): void {
        // this.offViewAdaptSize();
    }

    public setData(data: WordGameSubjectReply) {
        console.log("WordGameSubjectReply",data);
        this._data = data;
        this.title.string = data.subject.subject_name;
        this.wordList.numItems = this._data.word_list.length;
        this.knowledgeList.numItems = data.subject.sentence_knowledge.length;
        if (data.subject.is_unit) {
            this.practiceBtn.active = data.subject.status != 1;
            this.btnLabel.string = "开始挑战";
        }
    }

    goPractice() {
        if (this._isRequesting) return;
        this._isRequesting = true;
        this.onGetPractice();
    }

    onGetPractice() {
        if (this._data.subject.is_unit) {
            EventMgr.dispatch(EventType.GradeSkip_Challenge, this._data.subject);
            this._isRequesting = false;
        } else {
            ViewsMgr.showView(PrefabType.PracticeView, (node) => {
                this._isRequesting = false;
                node.getComponent(PracticeView).setData(this._data);
            })
        }
    }

    closeView() {
        this.closePop();
    }
    protected initEvent(): void {
        CCUtil.onTouch(this.closeBtn, this.closeView, this);
        CCUtil.onTouch(this.practiceBtn, this.goPractice, this);
    }

    protected removeEvent(): void {
        CCUtil.offTouch(this.closeBtn, this.closeView, this);
        CCUtil.offTouch(this.practiceBtn, this.goPractice, this);
    }

    onWordItemRender(item: Node, idx: number) {
        let word = item.getComponent(ThemeWordItem);
        word.initData(this._data.word_list[idx]);
    }

    onKonwlegeItemRender(item: Node, idx: number) {
        let konwlege = item.getComponent(KnowlegeItem);
        konwlege.setData(this._data.subject.sentence_knowledge[idx]);
    }

    onDestroy(): void {
        super.onDestroy();
        RemoteImageManager.i.clearImageAsset();
    }
}


