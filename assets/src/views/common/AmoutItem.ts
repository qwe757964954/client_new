import { _decorator, Label, Node, resources, Sprite, SpriteFrame, UITransform } from 'cc';
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
        this.updateAmout(itemInfo.num);
        this.updateIcon(idx,itemInfo);
    }

    updateAmout(amout:number){
        this.amout_text.string = amout.toString();
    }

    updateIcon(idx: number,itemInfo:AmoutItemData){
        let addUrl = "";
        let activeUrl = "";
        switch (itemInfo.type) {
            case AmoutType.Coin:
                this.aliveIcon.getComponent(UITransform).width = 53.9;
                this.aliveIcon.getComponent(UITransform).height = 56.7;
                addUrl = "common/word_0022_icon/spriteFrame";
                activeUrl = "common/gold/spriteFrame";
                break;
            case AmoutType.Diamond:
                this.aliveIcon.getComponent(UITransform).width = 61.6;
                this.aliveIcon.getComponent(UITransform).height = 52.5;
                addUrl = "common/add/spriteFrame";
                activeUrl = "common/stone/spriteFrame";
                break;
            case AmoutType.Energy:
                this.aliveIcon.getComponent(UITransform).width = 46.9;
                this.aliveIcon.getComponent(UITransform).height = 59.5;
                addUrl = "common/word_0023_icon/spriteFrame";
                activeUrl = "common/alive/spriteFrame";
                break;
            default:
                break;
        }
        this.updateStatic(addUrl,this.addIcon);
        this.updateStatic(activeUrl,this.aliveIcon);
    }
    /**
     * 
     * @param url 静态资源路径
     * @param node 节点
     */
    updateStatic(url:string,node:Node){
        resources.load(url, SpriteFrame, (err, spriteFrame) => {
            if (!err) {
                node.getComponent(Sprite).spriteFrame = spriteFrame;
            }else{
                console.log(err);
            }
        });


        // AssetManager.

        // let image = new Image();
        // image.src = url;
        // image.onload = ()=>{
        //     let texture = new Texture2D();
        //     let spriteFrame = new SpriteFrame();
        //     let imgAsset = new ImageAsset(image);
        //     texture.image = imgAsset
        //     spriteFrame.texture = texture;
        //     node.getComponent(Sprite).spriteFrame = spriteFrame
        // }
    }
}


