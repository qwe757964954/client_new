import { _decorator, isValid, Node } from 'cc';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { ComicLandItem } from './ComicLandItem';
const { ccclass, property } = _decorator;

@ccclass('ComicLandView')
export class ComicLandView extends BaseView {

    @property(List)
    public scroll_list: List = null;

    private _comicLandListener:(click:number) => void = null;

    protected initUI(): void {
        this.scroll_list.numItems = 15;
    }
    public setComicLandViewListener(listener:(click:number) => void): void{
        this._comicLandListener = listener;
    }
    onLoadComicLandGrid(item:Node, idx:number){
        let item_sript:ComicLandItem = item.getComponent(ComicLandItem);
        // let data = this._weekTask[idx];
        // item_sript.initPropsItem(data);
    }

    onComicLandListGridSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onComicLandListGridSelected",selectedId);
        this._comicLandListener?.(selectedId);
    }
}

