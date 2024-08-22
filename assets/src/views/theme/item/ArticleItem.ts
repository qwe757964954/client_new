import { _decorator, Component, Label, Node, UITransform } from 'cc';
import { ArticleItemData } from '../../../models/AdventureModel';
const { ccclass, property } = _decorator;

@ccclass('ArticleItem')
export class ArticleItem extends Component {
    @property(Node)
    horn: Node = null;
    @property(Label)
    articleLabel: Label = null;

    setData(data: ArticleItemData) {
        this.articleLabel.string = data.article;
        this.getComponent(UITransform).height = this.articleLabel.getComponent(UITransform).height + 10;
    }
}


