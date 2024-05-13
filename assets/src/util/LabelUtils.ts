import { Label, Size, UITransform,Node,Color, CacheMode } from "cc";


export class LabelUtils {
    static label: Label;
     /**
     * @param text 要显示文本内容
     * @param designSize label的设计宽高
     * @param fontSize 字体大小
     * @param lineHeight 行高
     */
    public static measureSize(text: string, fontSize: number, lineHeight: number):number {
        let node = new Node();
        var newlabel :Label = node.addComponent(Label);
        
       // root.addChild(newlabel.node);
        newlabel.fontSize = fontSize;
        newlabel.lineHeight = lineHeight;
        newlabel.string = text;
        newlabel.color = new Color(0, 0, 0, 0);
        //计算宽度
        newlabel.overflow = Label.Overflow.NONE; //设置不换行和不等比压缩，文字原来有多长就多长
        newlabel.cacheMode = CacheMode.CHAR; //这里要设一下CacheMode.CHAR, 否则Label最大长度只有2048，不能再大了.
        
        newlabel.updateRenderData(true);
        //let textWidth = Math.min(LabelUtils.label.getComponent(UITransform).width, designSize.width);
        let textWidth = newlabel.getComponent(UITransform).contentSize.width;
        node.destroy();

        return textWidth;
    }
}

