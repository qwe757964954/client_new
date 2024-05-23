import { Label, _decorator } from 'cc';
import { CheckWordItem } from '../../models/TextbookModel';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;

@ccclass('WordCheckSubItem')
export class WordCheckSubItem extends ListItem {
    @property(Label)
    public sentenceTxt:Label = null;

    @property(Label)
    public CntTxt:Label = null;
    start() {

    }

    updateSubItem(subData: CheckWordItem){
        this.CntTxt.string = subData.cn;
        this.sentenceTxt.string = subData.word;
    }
}


