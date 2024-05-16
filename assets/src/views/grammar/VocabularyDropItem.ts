import { Label, _decorator } from 'cc';
import ListItem from '../../util/list/ListItem';
import { VocabularyChildNode } from './GrammarInfo';
const { ccclass, property } = _decorator;

@ccclass('VocabularyDropItem')
export class VocabularyDropItem extends ListItem {

    @property(Label)
    public drop_title: Label = null;

    start() {

    }

    updatePropsItem(menuInfo:VocabularyChildNode){
        this.drop_title.string = menuInfo.Name;
    }
}


