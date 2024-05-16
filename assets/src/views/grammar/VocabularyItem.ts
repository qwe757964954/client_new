import { Label, Layout, Node, Sprite, SpriteFrame, UITransform, _decorator, error } from 'cc';
import { ResLoader } from '../../manager/ResLoader';
import List from '../../util/list/List';
import ListItem from '../../util/list/ListItem';
import { VocabularyChildNode, VocabularyParentNode } from './GrammarInfo';
import { VocabularyDropItem } from './VocabularyDropItem';
const { ccclass, property } = _decorator;

const Drop_Item_height: number = 73.407;

@ccclass('VocabularyItem')
export class VocabularyItem extends ListItem {

    @property(Label)
    public name_laebl: Label = null;

    @property(Node)
    public light_node: Node = null;

    @property(List)
    public sub_menu_list: List = null;

    private _total_data:VocabularyChildNode[] = [];

    @property(Node)
    public content_node: Node = null;

    @property(Node)
    public scroll_node: Node = null;

    private _parentInfo:VocabularyParentNode = null;

    start() {

    }

    updatePropsItem(parentInfo:VocabularyParentNode){
        this._parentInfo = parentInfo;
        this.updateLightNode(parentInfo.Score);
        this.name_laebl.string = parentInfo.Name;
        this.light_node.active = parentInfo.SubFlag === 0;
        this.onLoadSubMenuList();
    }

    onLoadSubMenuList(){
        this._total_data = this._parentInfo.ChildNodes;
        // let sumData:VocabularyChildNode = {
        //     Id: this._parentInfo.Id,
        //     PId: this._parentInfo.PId,
        //     Name: `${this._parentInfo.Name}的预览`,
        //     VideoUrl: this._parentInfo.VideoUrl,
        //     SubFlag: this._parentInfo.SubFlag,
        //     SortNo: this._parentInfo.SortNo,
        //     Score: this._parentInfo.Score,
        //     isSum: true
        // }
        // this._total_data.unshift(sumData);
        // if(this._parentInfo.SubFlag === 0){
        //     let subData:VocabularyChildNode = {
        //         PId: this._parentInfo.PId,
        //         Name: "综合练习",
        //     }
        //     this._total_data.push(subData);
        // }
        this.sub_menu_list.numItems = this._total_data.length;
        this.sub_menu_list.update();
    }
    hidenScrollView(){
        let calc_height = 0;
        this.sub_menu_list.scrollView.getComponent(UITransform).height = calc_height;
        let view = this.sub_menu_list.scrollView.node.getChildByName("view");
        view.getComponent(UITransform).height = calc_height;
        console.log(this.sub_menu_list.scrollView)
        this.node.getComponent(Layout).updateLayout(true);
    }
    showScrollView(){
        let calc_height = this._total_data.length * Drop_Item_height;
        this.sub_menu_list.scrollView.getComponent(UITransform).height = calc_height;
        let view = this.sub_menu_list.scrollView.node.getChildByName("view");
        view.getComponent(UITransform).height = calc_height;
        console.log(this.sub_menu_list.scrollView)
        this.node.getComponent(Layout).updateLayout(true);
    }

    onLoadTabVectorical(item:Node, idx:number){
        console.log("onLoadTabVectorical", item,idx,this._total_data[idx]);
        let item_sript:VocabularyDropItem = item.getComponent(VocabularyDropItem);
        item_sript.updatePropsItem(this._total_data[idx]);
    }


    updateLightNode(Score:number){
        let ligthType = 1;
        if (Score == 0) {
            ligthType = 1;
        } else if (Score < 50) {
            ligthType = 2;
        } else if (Score < 90) {
            ligthType = 3;
        } else {
            ligthType = 4;
        }
        let lightUrl = "grammar/light" + ligthType + "_b/spriteFrame"
        ResLoader.instance.load(lightUrl, SpriteFrame, (err: Error | null, spriteFrame: SpriteFrame) => {
            if (err) {
                error && console.error(err);
                return;
            }
            this.light_node.getComponent(Sprite).spriteFrame = spriteFrame;
        });
    }
}


