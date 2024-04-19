import { _decorator, Component, ImageAsset, Label, Node, Sprite, SpriteFrame, Texture2D, UITransform } from 'cc';
import ListItem from '../../util/list/ListItem';
import { AmoutItemData, AmoutType } from './TopAmoutView';
const { ccclass, property } = _decorator;

@ccclass('AmoutItem')
export class AmoutItem extends ListItem {
    @property({ type: Label, tooltip: "数值" })
    public amout_text: Label = null;
    @property({ type: Node, tooltip: "iocn节点" })
    public aliveIcon: Node = null;
    @property({ type: Node, tooltip: "add iocn节点" })
    public addIcon: Node = null;        
    start() {

    }

    updateItemProps(idx: number,itemInfo:AmoutItemData){
        this.amout_text.string = itemInfo.num.toString();
        this.updateIcon(idx,itemInfo);
    }

    updateIcon(idx: number,itemInfo:AmoutItemData){
        let addUrl = "";
        let activeUrl = "";
        switch (itemInfo.type) {
            case AmoutType.Coin:
                this.aliveIcon.getComponent(UITransform).width = 53.9;
                this.aliveIcon.getComponent(UITransform).height = 56.7;
                addUrl = "res/img/common/word_0022_icon/spriteFrame";
                activeUrl = "res/img/common/gold/spriteFrame";
                break;
            case AmoutType.Diamond:
                this.aliveIcon.getComponent(UITransform).width = 61.6;
                this.aliveIcon.getComponent(UITransform).height = 52.5;
                addUrl = "res/img/common/add/spriteFrame";
                activeUrl = "res/img/common/stone/spriteFrame";
                break;
            case AmoutType.Energy:
                this.aliveIcon.getComponent(UITransform).width = 46.9;
                this.aliveIcon.getComponent(UITransform).height = 59.5;
                addUrl = "res/img/common/word_0023_icon/spriteFrame";
                activeUrl = "res/img/common/alive/spriteFrame";
                break;
            default:
                break;
        }
        this.updateStatic(addUrl,this.addIcon);
        // this.updateStatic(activeUrl,this.aliveIcon);
    }
    /**
     * 
     * @param url 静态资源路径
     * @param node 节点
     */
    updateStatic(url:string,node:Node){
        let image = new Image();
        image.src = url;
        image.onload = ()=>{
            let texture = new Texture2D();
            let spriteFrame = new SpriteFrame();
            let imgAsset = new ImageAsset(image);
            texture.image = imgAsset
            spriteFrame.texture = texture;
            node.getComponent(Sprite).spriteFrame = spriteFrame
        }
    }
}


