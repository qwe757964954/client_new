import { _decorator, Component, instantiate, Label, Layout, Node, Prefab } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { DataMgr, EditInfo, EditType } from '../../manager/DataMgr';
import { ViewsManager } from '../../manager/ViewsManager';
import { BuildingIDType } from '../../models/BuildingModel';
import { User } from '../../models/User';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { NavTitleView } from '../common/NavTitleView';
import { AmoutItemData, AmoutType, TopAmoutView } from '../common/TopAmoutView';
import { ShopClassItem } from './ShopClassItem';
import { ShopGoodsItem } from './ShopGoodsItem';
const { ccclass, property } = _decorator;

const shopClass = [
    {
        name: "形象商店",
        subclass: ["帽子", "发型", "上衣", "裤子", "鞋子", "脸型"],
    },
    {
        name: "碎片区",
        subclass: ["test1", "test2"],
    },
    {
        name: "建筑商店",
        subclass: ["功能性建筑", "地标建筑", "装饰", "地板"],
    },
    {
        name: "装饰类",
        subclass: ["test3", "test4"],
    },
]

@ccclass('ShopUIView')
export class ShopUIView extends Component {

    @property(Node)
    public top_layout: Node = null;          // 商城

    @property({ type: Node, tooltip: "返回按钮" })
    public btnClose: Node = null;

    @property({ type: List, tooltip: "商品列表" })
    public goodsList: List = null;

    @property({ type: Label, tooltip: "顶部标题" })
    public lblTitle: Label = null;
    @property(Node)
    public plLeft: Node = null;//左侧菜单栏
    @property(Prefab)
    public shopClassItemPrefab: Prefab = null;//商店分类

    private _showClassNode: Node = null;//显示的菜单
    //标题文字
    private _titleAry: string[] = [TextConfig.Shop_Figure, TextConfig.Shop_Fragment, TextConfig.Shop_Building, TextConfig.Shop_Decoration];

    private _editType: EditType = null;//编辑类型
    private _itemsData: EditInfo[] = null;//编辑数据

    protected onLoad(): void {
        this.initEvent();
        this.init();
    }

    init() {
        this.initUI();
    }

    initUI() {
        //this.initNavTitle();
        this.initAmout();

        this.lblTitle.string = TextConfig.Shop_Figure;

        for (let i = 0; i < shopClass.length; i++) {
            const element = shopClass[i];
            let node: Node = instantiate(this.shopClassItemPrefab);
            this.plLeft.addChild(node);
            let shopClassItem = node.getComponent(ShopClassItem);
            shopClassItem.init(element, this.onClassClick.bind(this), this.onSubClassClick.bind(this));
        }

        this.plLeft.getComponent(Layout).updateLayout(true);
        this.onClassClick(this.plLeft.children[2]);
    }
    /**菜单点击 */
    onClassClick(node: Node) {
        if (this._showClassNode) {
            if (node != this._showClassNode) {
                return;
            }
            let shopClassItem = node.getComponent(ShopClassItem);
            let height = shopClassItem.getSlideDistance();
            shopClassItem.hideClass();
            let needMove = false;
            this.plLeft.children.forEach(child => {
                if (child == node) {
                    needMove = true;
                    return;
                }
                let shopClassItem = child.getComponent(ShopClassItem);
                shopClassItem.showClassBtn();
                if (needMove)
                    shopClassItem.classSlideDistance(height);
            });
            this._showClassNode = null;
            return;
        }

        let shopClassItem = node.getComponent(ShopClassItem);
        let height = shopClassItem.getSlideDistance();
        shopClassItem.showClass();
        shopClassItem.showSubClass();
        let needMove = false;
        this.plLeft.children.forEach(child => {
            if (child == node) {
                needMove = true;
                return;
            }
            let shopClassItem = child.getComponent(ShopClassItem);
            shopClassItem.hideClassBtn();
            if (needMove) {
                shopClassItem.classSlideDistance(-height);
            }
        });
        this._showClassNode = node;
    }
    /**子菜单点击 */
    onSubClassClick(node: Node, subName: string) {
        console.log("onSubClassClick", subName);
        if ("功能性建筑" == subName) {
            this.showEditType(EditType.Buiding);
            return;
        }
        if ("地标建筑" == subName) {
            this.showEditType(EditType.LandmarkBuiding);
            return;
        }
        if ("装饰" == subName) {
            this.showEditType(EditType.Decoration);
            return;
        }
        if ("地板" == subName) {
            this.showEditType(EditType.Land);
            return;
        }
    }

    initEvent() {
        CCUtil.onTouch(this.btnClose, this.onCloseView, this);
    }

    removeEvent() {
        CCUtil.offTouch(this.btnClose, this.onCloseView, this);
    }

    onDestroy(): void {
        this.removeEvent();
    }

    /**初始化导航栏 */
    initNavTitle() {
        ViewsManager.addNavigation(this.top_layout, 0, 0).then((navScript: NavTitleView) => {
            navScript.updateNavigationProps(this._titleAry[0], () => {
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

    onCloseView() {
        ViewsManager.instance.closeView(PrefabType.ShopUIView);
    }
    /**列表加载 */
    onListLoad(node: Node, idx: number) {
        let info = this._itemsData[idx];
        node.getComponent(ShopGoodsItem).initData(info);
    }
    /**显示对应编辑类型 */
    showEditType(editType: EditType) {
        if (editType == this._editType) return;
        this._editType = editType;

        let editConfig = DataMgr.instance.editInfo;
        this._itemsData = [];
        editConfig.forEach(info => {
            if (editType != EditType.Null && editType != info.type) return;
            if (BuildingIDType.mine == info.id) return;//矿山，需特殊处理
            if (EditType.Decoration == info.type || EditType.Land == info.type) {
                this._itemsData.push(info);
            } else {
                if (undefined == User.buildingList.find(item => item == info.id)) {
                    this._itemsData.push(info);
                }
            }
        });
        this.goodsList.numItems = this._itemsData.length;
        this.goodsList.scrollTo(0, 0);
    }
}


