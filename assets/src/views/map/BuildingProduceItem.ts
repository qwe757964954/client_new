import { _decorator, Label, Node, Sprite } from 'cc';
import { TextConfig } from '../../config/TextConfig';
import { DataMgr, RewardInfo } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
import List from '../../util/list/List';
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
    @property(List)
    public scrollView: List = null;//滚动视图

    private _expend: RewardInfo[] = null;

    /**初始化数据 */
    initData(path: string, name: string, time: number, num: number, expand: RewardInfo[]) {
        LoadManager.loadSprite(path, this.img);
        this.labelName.string = name;
        let str = time < 60 ? ToolUtil.replace(TextConfig.Time_S, time) : ToolUtil.replace(TextConfig.Time_M_S, Math.floor(time / 60), time % 60);
        this.labelTime.string = str;
        this.labelNum.string = num.toString();

        this._expend = expand;
        this.scrollView.numItems = expand ? expand.length : 0;
    }
    /**list加载 */
    onLoadListItem(item: Node, idx: number) {
        let data = this._expend[idx];
        let propInfo = DataMgr.getPropInfo(data.id);
        LoadManager.loadSprite(propInfo.png, item.getComponentInChildren(Sprite));
        item.getComponentInChildren(Label).string = ToolUtil.replace(TextConfig.Prop_Show, data.num);
    }
}


