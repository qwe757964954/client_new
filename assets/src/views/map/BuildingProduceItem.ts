import { _decorator, Label, Layout, Sprite } from 'cc';
import { TextConfig } from '../../config/TextConfig';
import { LoadManager } from '../../manager/LoadManager';
import ListItem from '../../util/list/ListItem';
import { ToolUtil } from '../../util/ToolUtil';
const { ccclass, property } = _decorator;

@ccclass('BuildingProduceItem')
export class BuildingProduceItem extends ListItem {
    @property(Sprite)
    public img: Sprite = null;//图片
    @property(Label)
    public labelName: Label = null;//名字
    @property(Label)
    public labelTime: Label = null;//时间
    @property(Label)
    public labelNum: Label = null;//数量
    @property(Layout)
    public layout: Layout = null;//布局

    /**初始化数据 */
    initData(path: string, name: string, time: number, num: number) {
        LoadManager.loadSprite(path, this.img);
        this.labelName.string = name;
        let str = time < 60 ? ToolUtil.replace(TextConfig.Time_S, time) : ToolUtil.replace(TextConfig.Time_M_S, Math.floor(time / 60), time % 60);
        this.labelTime.string = str;
        this.labelNum.string = "x" + num.toString();
    }
}


