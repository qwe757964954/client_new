import { _decorator, isValid, Node, tween, UITransform, v3 } from 'cc';
import { BaseView } from '../../script/BaseView';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { ThemeItem } from './ThemeItem';
const { ccclass, property } = _decorator;

const ITEM_HEIGHT = 55.3;

@ccclass('ThemeView')
export class ThemeView extends BaseView {
    @property(List)
    public theme_list: List = null; // 主题列表
    @property(Node)
    public drop_down: Node = null; // 下拉按钮
    @property(Node)
    public drow_down_icon: Node = null; // 下拉图标

    @property(Node)
    public scroll_bg: Node = null; // 滚动背景

    protected initUI(): void {
        this.theme_list.numItems = 6;
    }

    protected initEvent(): void {
        console.log("ThemeView initEvent");
        CCUtil.onBtnClick(this.drop_down, this.onDropDown.bind(this));
    }

    onDropDown() {
        this.updateListLayout();
    }

    updateListLayout() {
        console.log("updateListLayout");
        const currentHeight = this.theme_list.scrollView.getComponent(UITransform).height;
        const totalLength = currentHeight === 0 ? 6 : 0;
        this.theme_list.numItems = totalLength;
        const totalHeight = totalLength * ITEM_HEIGHT;
        this.node.getComponent(UITransform).height = totalHeight + 64;

        this.animateHeightChange(this.theme_list.scrollView, totalHeight);
        this.animateHeightChange(this.theme_list.scrollView.view, totalHeight);
        this.animateHeightChange(this.scroll_bg, totalHeight);

        const toAngles = currentHeight === 0 ? 0 : 180;
        this.animateRotation(this.drow_down_icon, toAngles);
    }

    animateHeightChange(node: any, height: number) {
        if (node && node.isValid) {
            tween(node.getComponent(UITransform))
                .to(0.1, { height: height })
                .start();
        }
    }

    animateRotation(node: Node, toAngles: number) {
        if (node && node.isValid) {
            tween(node)
                .to(0.1, { eulerAngles: v3(0, 0, toAngles) })
                .start();
        }
    }

    onLoadThemeVertical(item: Node, idx: number) {
        const itemScript: ThemeItem = item.getComponent(ThemeItem);
        // let data = this._weekTask[idx];
        // itemScript.initPropsItem(data);
    }

    onThemeVerticalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if (!isValid(selectedId) || selectedId < 0 || !isValid(item)) { return; }
        console.log("onThemeVerticalSelected", selectedId);
    }
}
