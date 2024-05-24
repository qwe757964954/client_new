import { _decorator, Label, Node } from 'cc';
import { NetConfig } from '../../config/NetConfig';
import { SchoolBookGradeItemData } from '../../models/TextbookModel';
import ImgUtil from '../../util/ImgUtil';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;

export interface VocabularyItemData {
    imgUrl: string,
    name: string,
    word_count: number,
    isCollect: boolean
}  


@ccclass('TabContentItem')
export class TabContentItem extends ListItem {
    @property(Node)
    public item_bg:Node = null;          // 课程图片
    @property(Label)
    public book_name:Label = null;          // 课程名字
    @property(Label)
    public word_num_text:Label = null;          // 单词数量
    @property(Node)
    public item_img:Node = null;          // 课程图片
    start() {

    }
    updateItemProps(idx:number,itemInfo:SchoolBookGradeItemData,book_name:string){
        this.book_name.string = itemInfo.grade;
        this.word_num_text.string = `共${itemInfo.num}词`;
        let bookImgUrl = `${NetConfig.assertUrl}/imgs/bookcover/${book_name}/${itemInfo.grade}.jpg`;
        
        // item.getChildByName("bookImg").skin = GameData.ASSETS_URL + "/assets/imgs/bookcover/" + this.currentEditionItem.dataSource.Name + "/" + data.Name + ".jpg";
        ImgUtil.loadRemoteImage(bookImgUrl,this.item_img,186.797,252.651);
    }
}


