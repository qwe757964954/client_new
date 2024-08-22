import { _decorator, Label, Node } from 'cc';
import { WordGameSubjectReply } from '../../models/AdventureModel';
import { BaseView } from '../../script/BaseView';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { ArticleItem } from './item/ArticleItem';
const { ccclass, property } = _decorator;

@ccclass('ReadArticleView')
export class ReadArticleView extends BaseView {

    @property(Label)
    private title: Label = null;

    @property(Label)
    private content: Label = null;


    @property(List)
    public articleList: List;
    
    @property(Node)
    private listenreading:Node = null;

    @property(Node)
    private pause:Node = null;

    private _data: WordGameSubjectReply;

    updateData(data: WordGameSubjectReply){
        this._data = data;
        this.articleList.numItems = this._data.article_list.length;
    }

    protected initEvent(): void {
        CCUtil.onBtnClick(this.listenreading,this.listenreadingClick.bind(this));
        CCUtil.onBtnClick(this.pause,this.pauseClick.bind(this));
    }

    listenreadingClick(){

    }
    pauseClick(){

    }
    onArticleListRender(item: Node, idx: number) {
        let itemSp = item.getComponent(ArticleItem);
        itemSp.setData(this._data.article_list[idx]);
    }
}

