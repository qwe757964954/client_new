import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('KnowlegeItem')
export class KnowlegeItem extends Component {
    @property(Label)
    public knowledgeLabel: Label = null;

    setData(data: string) {
        this.knowledgeLabel.string = data;
    }
}


