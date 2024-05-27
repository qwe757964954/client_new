import { Component, Label, Layout, Node, UITransform, _decorator } from 'cc';
import { CheckOrderType, CheckWordType } from '../../models/TextbookModel';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
const { ccclass, property } = _decorator;

export interface SortMenuModel {
    menu_name: string;
    order_type:CheckOrderType;
}

const Sort_Item_Height = 71;

@ccclass('WordSortView')
export class WordSortView extends Component {
    @property(List)
    public menu_scroll:List = null;

    @property(Node)
    public sort_btn:Node = null;

    private _menuDataArr:SortMenuModel[] = [];

    private _word_check_select:number = 0;

    private _menuSelectCallback:(order_type:CheckOrderType)=>void = null;
    start() {
        this.initEvent();
    }
    initEvent() {
        CCUtil.onTouch(this.sort_btn, this.onWorldSortClick, this);
    }

    /**移除监听 */
    removeEvent() {
        CCUtil.offTouch(this.sort_btn, this.onWorldSortClick, this);
    }
    initData(type:CheckWordType){
        console.log("initData___________",type);
        this.menu_scroll.node.active = false;
        this._menuDataArr = [{menu_name:"单元排序正序",order_type:CheckOrderType.UnitSortOrder},
        {menu_name:"单元排序倒序",order_type:CheckOrderType.UnitReverseOrder},
        {menu_name:"学习时间正序",order_type:CheckOrderType.LearningTimeOrder},
        {menu_name:"学习时间倒序",order_type:CheckOrderType.LearningReverseOrder},
        {menu_name:"字母正序",order_type:CheckOrderType.AlphabeticalOrder},
        {menu_name:"字母倒序",order_type:CheckOrderType.AlphabeticalReverseOrder}];
        if(type === CheckWordType.Collect){
            this._menuDataArr.splice(2, 1);
            this._menuDataArr.splice(2, 1);
        }else if(type === CheckWordType.NotLearned){
            this._menuDataArr.splice(2, 1);
            this._menuDataArr.splice(2, 1);
        }
        this.menu_scroll.numItems = this._menuDataArr.length;
        
    }

    updateScrollView(){
        let calc_height:number = Sort_Item_Height * this._menuDataArr.length;
        console.log(calc_height);
        this.menu_scroll.scrollView.getComponent(UITransform).height = calc_height;
        let viewUtf:UITransform = this.menu_scroll.scrollView.view
        let scrollContent:Node = this.menu_scroll.scrollView.content;
        viewUtf.height = calc_height;
        console.log(this.menu_scroll);
        scrollContent.getComponent(Layout).updateLayout();
        this.menu_scroll.update();
        this.menu_scroll.scrollTo(0);
    }
    

    setMenuSelectCallback(callback:(order_type:CheckOrderType)=>void){
        this._menuSelectCallback = callback;
    }

    onWorldSortClick(){
        console.log('onWorldSortClick______________');
        this.menu_scroll.node.active = !this.menu_scroll.node.active;
        this.updateScrollView();
    }

    onLoadWordSortVerticalList(item:Node, idx:number){
        console.log('onLoadWordCheckVerticalList',item,idx);
        let sort_text:Label = item.getChildByName('sort_text').getComponent(Label);
        let item_data:SortMenuModel = this._menuDataArr[idx];
        sort_text.string = item_data.menu_name;
    }
    onWordSortVerticalSelected(item: any, selectedId: number, lastSelectedId: number, val: number){
        if(selectedId === -1){return}
        this._word_check_select = selectedId;
        let item_data:SortMenuModel = this._menuDataArr[selectedId];
        this.menu_scroll.node.active = false;
        if(this._menuSelectCallback){
            this._menuSelectCallback(item_data.order_type);
        }
    }
    protected onDestroy(): void {
        this.removeEvent();
    }
}


