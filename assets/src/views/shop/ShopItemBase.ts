import { _decorator, Button, Label, Node, Sprite } from 'cc';
import { EventType } from '../../config/EventType';
import { ViewsManager } from '../../manager/ViewsManager';
import CCUtil from '../../util/CCUtil';
import { EventMgr } from '../../util/EventManager';
import ListItem from '../../util/list/ListItem';
import { TabTypeIds } from '../task/TaskInfo';
import { BuyStoreInfo, ShopClothingInfo } from './ShopInfo';

const { ccclass, property } = _decorator;

@ccclass('ShopItemBase')
export abstract class ShopItemBase extends ListItem {
    @property({ type: Label, tooltip: "标题" })
    public lblName: Label = null;

    @property({ type: Label, tooltip: "价格" })
    public lblPrice: Label = null;

    @property({ type: Node, tooltip: "可以点击的商品结点" })
    public ndGoods: Node = null;

    @property({ type: Node, tooltip: "购买按钮" })
    public btnBuy: Node = null;

    @property({ type: Node, tooltip: "icon" })
    public rightIcon: Node = null;

    @property({ type: Node, tooltip: "商品图标" })
    public icon: Node = null;

    protected btnBuyComponent: Button = null;
    protected btnBuySprite: Sprite = null;
    protected _shopClothing: { [key in TabTypeIds]?: ShopClothingInfo } = {};

    protected abstract getPrice(): number;
    protected abstract getItemName(): string;

    onLoad(): void {
        this.initializeComponents();
        this.initEvent();
    }

    private initializeComponents() {
        this.btnBuyComponent = this.btnBuy.getComponent(Button);
        this.btnBuySprite = this.btnBuy.getComponent(Sprite);
    }

    protected initEvent() {
        CCUtil.onBtnClick(this.btnBuy, this.onBuyClick.bind(this));
    }

    private async onBuyClick() {
        const totalAmount = this.getPrice();
        const itemName = this.getItemName();

        const contentStr = `确认消耗 ${totalAmount} 个 ${itemName} 购买 ${this.lblName.string} 吗？`;
        const buyInfo: BuyStoreInfo = this.prepareBuyInfo();

        ViewsManager.showConfirm(contentStr, () => {
            EventMgr.dispatch(EventType.Shop_Buy_Store, buyInfo);
        });
    }

    protected abstract prepareBuyInfo(): BuyStoreInfo;

    updateRightActive(show: boolean) {
        this.rightIcon.active = show;
    }

    changeRightActive() {
        this.rightIcon.active = !this.rightIcon.active;
    }

    getRightStatus() {
        return this.rightIcon.active;
    }

    onDestroy(): void {
        // Placeholder for any cleanup if needed
    }
}
