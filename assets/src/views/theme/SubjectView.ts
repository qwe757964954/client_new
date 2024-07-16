import { _decorator, Component, Label, Node } from 'cc';
import { BasePopup } from '../../script/BasePopup';
import List from '../../util/list/List';
import { ThemeWordItem } from './item/ThemeWordItem';
import CCUtil from '../../util/CCUtil';
import { SubjectArticleListReply, WordGameSubjectReply } from '../../models/AdventureModel';
import RemoteImageManager from '../../manager/RemoteImageManager';
import { ServiceMgr } from '../../net/ServiceManager';
import { EventMgr } from '../../util/EventManager';
import { InterfacePath } from '../../net/InterfacePath';
import { ViewsMgr } from '../../manager/ViewsManager';
import { PrefabType } from '../../config/PrefabType';
import { PracticeView } from './PracticeView';
const { ccclass, property } = _decorator;

@ccclass('SubjectView')
export class SubjectView extends BasePopup {
    @property(Node)
    public closeBtn: Node;
    @property(Label)
    public title: Label;
    @property(List)
    public wordList: List;
    @property(Label)
    public detailLabel: Label = null;
    @property(Node)
    public practiceBtn: Node = null; //练习按钮
    private _data: WordGameSubjectReply;

    private _isRequesting: boolean = false; //是否正在请求数据

    public setData(data: WordGameSubjectReply) {
        this._data = data;
        this.title.string = data.subject.subject_name;
        this.wordList.numItems = this._data.word_list.length;
        this.detailLabel.string = data.subject.sentence_knowledge;
    }

    showAnim(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.initUI();
            resolve();
        });
    }

    goPractice() {
        if (this._isRequesting) return;
        this._isRequesting = true;
        ServiceMgr.studyService.getSubjectArticleList(this._data.subject.subject_id);
    }

    onGetPractice(data: SubjectArticleListReply) {
        this._isRequesting = false;
        if (data.code != 200) {
            ViewsMgr.showTip(data.msg);
            return;
        }
        ViewsMgr.showPopup(PrefabType.PracticeView).then((node: Node) => {
            node.getComponent(PracticeView).setData(data);
        })
    }

    protected initEvent(): void {
        CCUtil.onTouch(this.closeBtn, this.closePop, this);
        CCUtil.onTouch(this.practiceBtn, this.goPractice, this);
        EventMgr.addListener(InterfacePath.Subject_ArticleList, this.onGetPractice, this);
    }

    protected removeEvent(): void {
        CCUtil.offTouch(this.closeBtn, this.closePop, this);
        CCUtil.offTouch(this.practiceBtn, this.goPractice, this);
        EventMgr.removeListener(InterfacePath.Subject_ArticleList, this);
    }

    onWordItemRender(item: Node, idx: number) {
        let word = item.getComponent(ThemeWordItem);
        word.initData(this._data.word_list[idx]);
    }

    onDestroy(): void {
        super.onDestroy();
        RemoteImageManager.i.clearImageAsset();
    }
}


