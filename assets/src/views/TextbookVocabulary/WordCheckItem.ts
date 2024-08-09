import { Label, Layout, Node, Prefab, _decorator, instantiate } from 'cc';
import { CheckWordItem } from '../../models/TextbookModel';
import List from '../../util/list/List';
import ListItem from '../../util/list/ListItem';
import { WordCheckSubItem } from './WordCheckSubItem';
const { ccclass, property } = _decorator;

const Sub_Word_Item_Height = 100;

@ccclass('WordCheckItem')
export class WordCheckItem extends ListItem {
    @property(Label)
    public unit_lab:Label = null;
    @property(Layout)
    public wordScroll:Layout = null;

    @property(List)
    public word_list:List = null;

    @property(Prefab)
    public wordItem:Prefab = null;

    private _words:CheckWordItem[] = [];

    start() {

    }

    update(deltaTime: number) {
        
    }

    updateItemProps(unit:string,words:CheckWordItem[]){
        this.unit_lab.string = unit;
        this._words = words;
        this.wordScroll.node.removeAllChildren();
        for (let i = 0; i < words.length; i++) {
            const element = words[i];
            let subItem:Node = instantiate(this.wordItem);
            let subScript = subItem.getComponent(WordCheckSubItem);
            subScript.updateSubItem(element);
            this.wordScroll.node.addChild(subItem);
        }
    }

}


