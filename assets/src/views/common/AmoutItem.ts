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
                this.aliveIcon.getComponent(UITransform).width = 56;
                this.aliveIcon.getComponent(UITransform).height = 57;
                addUrl = "common/word_0022_icon/spriteFrame";
                activeUrl = "common/img_coin/spriteFrame";
                break;
            case AmoutType.Diamond:
                this.aliveIcon.getComponent(UITransform).width = 50;
                this.aliveIcon.getComponent(UITransform).height = 53;
                addUrl = "common/add/spriteFrame";
                activeUrl = "common/img_diamond/spriteFrame";
                break;
            case AmoutType.Energy:
                this.aliveIcon.getComponent(UITransform).width = 39;
                this.aliveIcon.getComponent(UITransform).height = 58;
                addUrl = "common/word_0023_icon/spriteFrame";
                activeUrl = "common/img_energy/spriteFrame";
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


