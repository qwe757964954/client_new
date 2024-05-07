import { Button, Label, Node, ProgressBar, _decorator } from 'cc';
import { NetConfig } from '../../config/NetConfig';
import { MyTextbookStatus } from '../../models/TextbookModel';
import ImgUtil from '../../util/ImgUtil';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;


  

@ccclass('MyContentItem')
export class MyContentItem extends ListItem {
    @property(Node)
    public infoBg:Node = null;          // 背景
    @property(Node)
    public select_infoBg:Node = null;          // 选择背景
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
    private _bookStatus:MyTextbookStatus = null; // null
    private delCallback:(idx:number,bookStatus:MyTextbookStatus) => void = null;
    start() {

    }

    setDeleteClickCallback(callback) {
        this.delCallback = callback;
    }

    updateMyContentItemProps(idx: number,itemInfo:MyTextbookStatus) {
        this.idx = idx;
        this._bookStatus = itemInfo;
        this.item_name.string = `${itemInfo.book_name}(${itemInfo.grade})`;
        // this.desc_text.string = itemInfo.desc;
        // this.flagBg.active = itemInfo.isLearned;
        this.learnProgress.progress = itemInfo.study_word_num/itemInfo.total_word_num;
        this.collect_text.string = `剩余天数0`;
        this.already_learned_text.string = `已学  ${itemInfo.study_word_num}/${itemInfo.total_word_num}`;
        let bookImgUrl = `${NetConfig.assertUrl}/imgs/bookcover/${itemInfo.book_name}/${itemInfo.grade}.jpg`;
        ImgUtil.loadRemoteImage(bookImgUrl,this.item_img,188.156,256.998);
    }

    onDelMyTextbookClick(){
        if(this.delCallback){
            this.delCallback(this.idx,this._bookStatus);
        }
    }

}   

