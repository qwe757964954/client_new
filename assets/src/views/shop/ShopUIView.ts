import { _decorator, Component, EventTouch, instantiate, Label, Node, Prefab, ScrollView, Sprite, SpriteFrame, Tween, tween, UITransform, v3, Vec3 } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
import { User } from '../../models/User';
import { BaseView } from '../../script/BaseView';
import { NavTitleView } from '../common/NavTitleView';
import { AmoutItemData, AmoutType, TopAmoutView } from '../common/TopAmoutView';
import CCUtil from '../../util/CCUtil';
import { TextConfig } from '../../config/TextConfig';
import { ServiceMgr } from '../../net/ServiceManager';
import EventManager from '../../util/EventManager';
import { EventType } from '../../config/EventType';
import { GoodsItemData } from '../../models/GoodsModel';
import { ShopGoodsItem } from './ShopGoodsItem';
const { ccclass, property } = _decorator;

@ccclass('ShopUIView')
export class ShopUIView extends Component {

    @property(Node)
    public top_layout: Node = null;          // 商城

    @property({ type: Node, tooltip: "返回按钮" })
    public btnClose: Node = null;

    @property({ type: Node, tooltip: "形象商店" })
    public btnShop1: Node = null;

    @property({ type: Node, tooltip: "碎片区" })
    public btnShop2: Node = null;

    @property({ type: Node, tooltip: "建筑商店" })
    public btnShop3: Node = null;

    @property({ type: Node, tooltip: "装饰区" })
    public btnShop4: Node = null;

    @property({ type: Node, tooltip: "形象商店中的menu" })
    public ndMenu1: Node = null;

    @property({ type: Node, tooltip: "碎片区中的menu" })
    public ndMenu2: Node = null;

    @property({ type: Node, tooltip: "建筑商店中的menu" })
    public ndMenu3: Node = null;

    @property({ type: Node, tooltip: "装饰区中的menu" })
    public ndMenu4: Node = null;

    @property({ type: ScrollView, tooltip: "商品列表" })
    public goodsList: ScrollView = null;

    @property({ type: Prefab, tooltip: "商品预制体" })
    public preGoodsItem: Prefab = null;

    @property({ type: Label, tooltip: "顶部标题" })
    public lblTitle: Label = null;

    @property({ type: [SpriteFrame], tooltip: "商城列表里tab背景页的图片数组" }) // 0:选中 1: 未选中
    public sprTabBgAry: SpriteFrame[] = [];

    private dropSpeed: number = 1600; //菜单下滑速度

    private _currentShopTab: string = "0"; //当前tab页
    private _currentSubMenuIdx: number = 11; //当前点击的子菜单索引

    private _bShowMenu: boolean = false; //是否显示子菜单栏
    private _bCanClickTab: boolean = true; //是否可以点击商场tab页

    private _getShopGoodsListEveId: string = "";

    //标题文字
    private _titleAry: string[] = [TextConfig.Shop_Figure, TextConfig.Shop_Fragment, TextConfig.Shop_Building, TextConfig.Shop_Decoration];

    protected onLoad(): void {
        this.goodsList.content.removeAllChildren();
        this.initEvent();
    }

    start() {
        this.initData();
        this.initUI();

    }

    initData() {
        this._currentShopTab = "1";
        this._currentSubMenuIdx = 11;
        this._bShowMenu = false;
        this._bCanClickTab = true;
    }

    initUI() {
        //this.initNavTitle();
        this.initAmout();

        this.lblTitle.string = TextConfig.Shop_Figure;

        ServiceMgr.shopService.goodsList(11); //初始显示type11类型
    }

    initEvent() {
        CCUtil.onTouch(this.btnClose, this.onCloseView, this);
        for (let i = 1; i <= 4; i++) {
            CCUtil.onTouch(this["btnShop" + i], this.onTabClick, this);
        }
        //btnShop下的子菜单点击
        for (let i = 1; i <= 4; i++) {
            let ndBtnShop: Node = this["btnShop" + i];
            let ndBtnMenu: Node = ndBtnShop.getChildByPath("mask/menu");
            for (let j = 1; j <= ndBtnMenu.children.length; j++) {
                let subMenu: Node = ndBtnMenu.getChildByName("nd" + j);
                CCUtil.onTouch(subMenu, this.onSubMenuClick, this);
            }

        }
        this._getShopGoodsListEveId = EventManager.on(EventType.Shop_GoodsList, this.onShopGoodsList.bind(this));
    }

    removeEvent() {
        CCUtil.offTouch(this.btnClose, this.onCloseView, this);
        for (let i = 1; i <= 4; i++) {
            CCUtil.offTouch(this["btnShop" + i], this.onTabClick, this);
        }
        //btnShop1下的子菜单点击
        /* for (let i = 1; i <= 4; i++) {
             let ndBtnShop: Node = this["btnShop" + i];
             let ndBtnMenu: Node = ndBtnShop.getChildByPath("mask/menu");
             for (let j = 1; j <= ndBtnMenu.children.length; j++) {
                 let subMenu: Node = ndBtnMenu.getChildByName("nd" + j);
                 CCUtil.offTouch(subMenu, this.onSubMenuClick, this);
             }
 
         }*/
        EventManager.off(EventType.Shop_GoodsList, this._getShopGoodsListEveId);
    }

    onTabClick(e: EventTouch) {
        var name: string = e.target.name;
        let tabPre: string = name.substring(0, 7);
        if (tabPre != "btnShop") { //点到下级菜单也会触发这个
            return;
        }
        var tabIndex: string = name.substring(7);

        /* if (tabIndex == this._currentShopTab) {
             return;
         }*/
        this._currentShopTab = tabIndex;
        let index: number = Number(this._currentShopTab) - 1;
        this.lblTitle.string = this._titleAry[index];

        //首先设置下子菜单阴影
        if (!this._bShowMenu) {
            let ndBtnShop: Node = this["btnShop" + this._currentShopTab];
            let ndBtnMenu: Node = ndBtnShop.getChildByPath("mask/menu");
            for (let j = 1; j <= ndBtnMenu.children.length; j++) {
                let subMenu: Node = ndBtnMenu.getChildByName("nd" + j);
                let glow: Node = subMenu.getChildByName("glow");
                if (j == 1) {
                    glow.active = true;
                }
                else {
                    glow.active = false;
                }
            }
            let currentSubMenuIdx = Number(this._currentShopTab + "1");
            if (this._currentSubMenuIdx != currentSubMenuIdx) {
                this._currentSubMenuIdx = currentSubMenuIdx;
                ServiceMgr.shopService.goodsList(this._currentSubMenuIdx);
            }
        }

        this.onClickTab();
    }

    onClickTab() {
        let curTabIndex: number = +this._currentShopTab;
        var uiTransform: UITransform = null;
        var menuHeight: number = 0;
        var timeDrop: number = 0;

        if (curTabIndex >= 1 && curTabIndex <= 4) {
            if (!this._bShowMenu && this._bCanClickTab) { //如果没有显示子菜单栏,则显示当前的下拉子菜单栏，下面的菜单应该向下移开位置 
                this._bCanClickTab = false;
                this._bShowMenu = true;
                uiTransform = this["ndMenu" + curTabIndex].getComponent(UITransform);
                menuHeight = uiTransform.height;
                timeDrop = menuHeight / this.dropSpeed;
                let posBtn: Vec3 = v3(0, 0, 0);
                for (let i = 1; i <= 4; i++) {
                    if (i != curTabIndex) {
                        CCUtil.offTouch(this["btnShop" + i], this.onTabClick, this); //不能让它点击
                        this["btnShop" + i].getChildByName("btn_orange").getComponent(Sprite).spriteFrame = this.sprTabBgAry[1];
                    }
                }
                for (let i = curTabIndex + 1; i <= 4; i++) { //点击以下的按钮向下移动

                    Tween.stopAllByTarget(this["btnShop" + i]);
                    posBtn = this["btnShop" + i].getPosition();
                    tween(this["btnShop" + i])
                        .to(timeDrop, { position: v3(posBtn.x, posBtn.y - (menuHeight - 20), posBtn.z) })
                        .call(() => {

                        })
                        .start();
                }
                //菜单区伸出来
                Tween.stopAllByTag(this["ndMenu" + curTabIndex]);
                tween(this["ndMenu" + curTabIndex])
                    .by(timeDrop, { position: v3(0, -menuHeight, 0) })
                    .delay(0.1)
                    .call(() => {
                        this._bCanClickTab = true;
                    })
                    .start();
            } else if (this._bShowMenu && this._bCanClickTab) { //如果是显示了子菜单并且可以点击的情况下，应该缩回去
                this._bCanClickTab = false;
                this._bShowMenu = false;
                uiTransform = this["ndMenu" + curTabIndex].getComponent(UITransform);
                menuHeight = uiTransform.height;
                timeDrop = menuHeight / this.dropSpeed;
                let posBtn: Vec3 = v3(0, 0, 0);
                //菜单区伸出来
                Tween.stopAllByTag(this["ndMenu" + curTabIndex]);
                tween(this["ndMenu" + curTabIndex])
                    .by(timeDrop, { position: v3(0, menuHeight, 0) })
                    .delay(0.1)
                    .call(() => {
                        this._bCanClickTab = true;
                    })
                    .start();
                for (let i = 1; i <= 4; i++) {
                    if (i != curTabIndex) {
                        CCUtil.onTouch(this["btnShop" + i], this.onTabClick, this); //恢复它们可以点击
                        this["btnShop" + i].getChildByName("btn_orange").getComponent(Sprite).spriteFrame = this.sprTabBgAry[0];
                    }
                }
                for (let i = curTabIndex + 1; i <= 4; i++) {

                    Tween.stopAllByTarget(this["btnShop" + i]);
                    posBtn = this["btnShop" + i].getPosition();
                    tween(this["btnShop" + i])
                        .to(timeDrop, { position: v3(posBtn.x, posBtn.y + menuHeight - 20, posBtn.z) })
                        .call(() => {
                            //  this["btnShop" + i].getChildByName("btn_orange").getComponent(Sprite).spriteFrame = this.sprTabBgAry[0];
                        })
                        .start();
                }
            }
        }
        /*else if (curTabIndex == 4) {

            uiTransform = this["ndMenu" + curTabIndex].getComponent(UITransform);
            menuHeight = uiTransform.height;
            timeDrop = menuHeight / this.dropSpeed;
            let posBtn: Vec3 = v3(0, 0, 0);
            if (!this._bShowMenu && this._bCanClickTab) {
                this._bCanClickTab = false;
                this._bShowMenu = true;
                //菜单区伸出来
                Tween.stopAllByTag(this["ndMenu" + curTabIndex]);
                tween(this["ndMenu" + curTabIndex])
                    .by(timeDrop, { position: v3(0, -menuHeight, 0) })
                    .delay(0.1)
                    .call(() => {
                        this._bCanClickTab = true;
                    })
                    .start();
            } else if (this._bShowMenu && this._bCanClickTab) {
                this._bCanClickTab = false;
                this._bShowMenu = false;
                //菜单区收回去
                Tween.stopAllByTag(this["ndMenu" + curTabIndex]);
                tween(this["ndMenu" + curTabIndex])
                    .by(timeDrop, { position: v3(0, menuHeight, 0) })
                    .delay(0.1)
                    .call(() => {
                        this._bCanClickTab = true;
                    })
                    .start();
            }
        }*/
    }

    onDestroy(): void {
        this.removeEvent();
    }

    /**初始化导航栏 */
    initNavTitle() {
        ViewsManager.addNavigation(this.top_layout, 0, 0).then((navScript: NavTitleView) => {
            navScript.updateNavigationProps(`形象商店`, () => {
                ViewsManager.instance.closeView(PrefabType.ShopUIView);
            });
        });
    }
    /**初始化游戏数值 */
    initAmout() {
        ViewsManager.addAmout(this.top_layout, 5.471, 42.399).then((amoutScript: TopAmoutView) => {
            let dataArr: AmoutItemData[] = [{ type: AmoutType.Diamond, num: User.diamond },
            { type: AmoutType.Coin, num: User.coin },
            { type: AmoutType.Energy, num: User.stamina }];
            amoutScript.loadAmoutData(dataArr);
        });
    }

    onSubMenuClick(e: EventTouch) {
        let targetName: string = e.target.name; //nd2
        let name: string = targetName.substring(2);
        console.log(name);
        let nameIdx: number = Number(name);
        let subMenuIdxStr: string = this._currentShopTab + name;
        let subMenuIdx: number = Number(subMenuIdxStr);
        if (subMenuIdx == this._currentSubMenuIdx) {
            return;
        }

        this._currentSubMenuIdx = subMenuIdx; //获取当前点击的子工菜单
        let ndBtnShop: Node = this["btnShop" + this._currentShopTab];
        let ndBtnMenu: Node = ndBtnShop.getChildByPath("mask/menu");
        for (let j = 1; j <= ndBtnMenu.children.length; j++) {
            let subMenu: Node = ndBtnMenu.getChildByName("nd" + j);
            let glow: Node = subMenu.getChildByName("glow");
            if (j == nameIdx) {
                glow.active = true;
            }
            else {
                glow.active = false;
            }
        }

        ServiceMgr.shopService.goodsList(this._currentSubMenuIdx);

    }

    onShopGoodsList(goodsList: GoodsItemData[]) {
        console.log(goodsList);
        this.goodsList.content.removeAllChildren();
        for (let i = 0; i < goodsList.length; i++) {
            let goodItem: GoodsItemData = goodsList[i];
            let ndGoodItem: Node = instantiate(this.preGoodsItem);
            this.goodsList.content.addChild(ndGoodItem);
            ndGoodItem.getComponent(ShopGoodsItem).initData(goodItem);
        }

        this.goodsList.scrollToTop();
    }

    onCloseView() {
        ViewsManager.instance.closeView(PrefabType.ShopUIView);
    }

    update(deltaTime: number) {

    }
}


