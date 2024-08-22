import { _decorator, Button, Label, Node } from 'cc';
import { BaseView } from '../../script/BaseView';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { ComicPageItem } from './ComicPageItem';
const { ccclass, property } = _decorator;

@ccclass('ScrollComicView')
export class ScrollComicView extends BaseView {
    @property(Node)
    MapLayout: Node = null;

    @property(Node)
    contentNode: Node = null;
    
    @property(List)
    comic_list:List = null;

    @property(Button)
    upBtn:Button = null;

    @property(Button)
    downBtn: Button = null;

    @property(Button)
    enlargeBtn:Button = null;

    @property(Button)
    narrowBtn: Button = null;

    @property(Label)
    pageLabel: Label = null;

    private _currentPage:number = 0;

    protected initUI(): void {
        this.comic_list.numItems = 6;
        this._currentPage = 0;
        this.updatePageText();
    }

    protected initEvent(): void {
        CCUtil.onBtnClick(this.downBtn.node,this.clickDownEvent.bind(this));
        CCUtil.onBtnClick(this.upBtn.node,this.clickUpEvent.bind(this));
        CCUtil.onBtnClick(this.enlargeBtn.node,this.clickEnlargeEvent.bind(this));
        CCUtil.onBtnClick(this.narrowBtn.node,this.clickNarrowEvent.bind(this));

    }

    updatePageText(){
        const page = this._currentPage + 1;
        const totalPage = this.comic_list.numItems;
        const isMax = page >= totalPage;
        const isMin = page <= 1;
        this.upBtn.interactable =!isMin;
        this.downBtn.interactable =!isMax;
        this.pageLabel.string = `${page}/${totalPage}`;
    }

    clickDownEvent(){
        this.comic_list.nextPage();
    }
    clickUpEvent(){
        this.comic_list.prePage();
    }

    clickEnlargeEvent(){

    }

    clickNarrowEvent(){

    }

    onListRender(item: Node, idx: number) {
        let script = item.getComponent(ComicPageItem);
        script.updateComicProps(idx);
        // item.getComponentInChildren(Label).string = this.data[idx] + '';
    }

    onListPageChange(pageNum: number) {
        console.log('当前是第' + pageNum + '页');
        this._currentPage = pageNum;
        this.updatePageText();
    }

}

