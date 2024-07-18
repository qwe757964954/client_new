import { _decorator, Component, Label, Node, UITransform } from 'cc';
import { Article } from '../../../models/AdventureModel';
const { ccclass, property } = _decorator;

@ccclass('ArticleItem')
export class ArticleItem extends Component {
    @property(Node)
    horn: Node = null;
    @property(Label)
    articleLabel: Label = null;

    setData(data: string) {
        this.articleLabel.string = data;
        this.getComponent(UITransform).height = this.articleLabel.getComponent(UITransform).height + 10;
    }
}


