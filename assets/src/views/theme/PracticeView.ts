import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { BasePopup } from '../../script/BasePopup';
import List from '../../util/list/List';
import { ArticleItem } from './item/ArticleItem';
import { SubjectArticleListReply } from '../../models/AdventureModel';
const { ccclass, property } = _decorator;

@ccclass('PracticeView')
export class PracticeView extends BasePopup {
    @property(Node)
    public closeBtn: Node;
    @property(Label)
    public title: Label;
    @property(Sprite)
    public comicImg: Sprite;
    @property(List)
    public articleList: List;

    private _data: SubjectArticleListReply;

    public setData(data: SubjectArticleListReply) {
        this._data = data;
        this.articleList.numItems = this._data.article_list.length;
        this.scheduleOnce(() => {
            this.articleList.updateAll();
        }, 0.02);
        console.log("ddddddddddd", data);
    }

    showAnim(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.initUI();
            resolve();
        });
    }

    onArticleListRender(item: Node, idx: number) {
        let itemSp = item.getComponent(ArticleItem);
        itemSp.setData(this._data.article_list[idx]);
    }
}


