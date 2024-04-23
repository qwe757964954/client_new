import { _decorator, Button, Label, Node } from 'cc';
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
    @property(Button)
    public addBtn:Button = null;          // 课程图片
    start() {

    }

    updateItemProps(idx:number,itemInfo:VocabularyItemData){
        this.book_name.string = itemInfo.name;
        this.word_num_text.string = `单词数量：${itemInfo.word_count}`;
        ImgUtil.loadRemoteImage(itemInfo.imgUrl,this.item_img,125.507,172.979);
        this.addBtn.node.active = itemInfo.isCollect;
    }
}


