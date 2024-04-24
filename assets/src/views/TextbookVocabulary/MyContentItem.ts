import { Button, Label, Node, ProgressBar, _decorator } from 'cc';
import ImgUtil from '../../util/ImgUtil';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;


export interface MyTextbookItemData {
    imgUrl: string,
    name: string,
    desc: string,
    collect_count: number,
    total_collect: number,
    already_learned_count: number,
    total_already_learned: number,
    isLearned: boolean
}   

@ccclass('MyContentItem')
export class MyContentItem extends ListItem {
    @property(Node)
    public infoBg:Node = null;          // 背景
    @property(Node)
    public item_img:Node = null;          // 课程图片
    @property(Label)
    public item_name:Label = null;          // 课程名字
    @property(Label)
    public desc_text:Label = null;          // 课程详情
    @property(Label)
    public collect_text:Label = null;          // 已收集
    @property(Label)
    public already_learned_text:Label = null;          // 已学单词
    @property(ProgressBar)
    public learnProgress:ProgressBar = null;          // 学习进度

    @property(Button)
    public btn_close:Button = null;          // 关闭按钮

    @property(Node)
    public flagBg:Node = null;

    private idx:number = 0;
    private delCallback:(idx:number) => void = null;
    start() {

    }

    setClickCallback(callback) {
        this.delCallback = callback;
    }

    updateMyContentItemProps(idx: number,itemInfo:MyTextbookItemData) {
        this.idx = idx;
        this.item_name.string = itemInfo.name;
        this.desc_text.string = itemInfo.desc;
        this.flagBg.active = itemInfo.isLearned;
        this.collect_text.string = `已收集${itemInfo.collect_count}/${itemInfo.total_collect}!`;
        this.already_learned_text.string = `已学单词${itemInfo.already_learned_count}/${itemInfo.total_already_learned}!`;
        ImgUtil.loadRemoteImage(itemInfo.imgUrl,this.item_img,124.77,162.291);
    }

    onDelMyTextbookClick(){
        if(this.delCallback){
            this.delCallback(this.idx);
        }
    }

}   


