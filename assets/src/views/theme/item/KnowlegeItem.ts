import { _decorator, Component, Label } from 'cc';
import { ArticleItemData } from '../../../models/AdventureModel';
const { ccclass, property } = _decorator;

@ccclass('KnowlegeItem')
export class KnowlegeItem extends Component {
    @property(Label)
    public knowledgeLabel: Label = null;

    setData(data: ArticleItemData) {
        this.knowledgeLabel.string = data.article;
    }
}


