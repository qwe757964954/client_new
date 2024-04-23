import { Button, Label, Node, ProgressBar, _decorator } from 'cc';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;


export interface MyTextbookItemData {
    img: string,
    name: string,
    desc: string,
    collect_count: number,
    already_learned_count: number,
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
    start() {

    }

    update(deltaTime: number) {
        
    }

    updateMyContentItemProps(idx: number,itemInfo:MyTextbookItemData) {
        
    }

}


