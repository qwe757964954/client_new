import { Color, Component, Node, ScrollView, _decorator, math } from 'cc';
import { DateListItemNew } from './DateListItemNew';
import { DateListView } from './DateListView';
const { ccclass, property } = _decorator;

@ccclass('ScrollViewExtra')
export class ScrollViewExtra extends Component {

    @property(ScrollView)
    scrollView:ScrollView = null

    @property(DateListView)
    listViewExtra:DateListView = null;

    private nowOffsetY:number = 0;
    private selectChildren:any[] = [];
    private selectChildIndex:number = 0;
    private listData:any = null;
    private contentY:number = null;
    onLoad(): void {
        this.nowOffsetY = 0;
        this.selectChildren = [];
        this.selectChildIndex = 0;
        this.listViewExtra.init([],this);

        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push(i.toString());
        }
        this.init(data);
    }

    init(listData:any){
        this.listData = listData;
        this.listData.unshift(" ");
        // this.listData.unshift(" ");
        // this.listData.push(" ");
        this.listData.push(" ");
        // 初始化
        this.addScrollChildIndex();
    }

    /**增加scroll子节点区间功能 */
    addScrollChildIndex(){
        /**禁用鼠标滚轮，滚轮在移动区间时ScrollView 返回很怪异，没有SCROLL_ENDED事件回调 */
        this.node.off(Node.EventType.MOUSE_WHEEL);
        const scroll = this.scrollView;
        /**scroll 事件监听*/
        scroll.node.on(ScrollView.EventType.SCROLLING,()=>{
            this.scrolling(scroll);
        },this);
        scroll.node.on(ScrollView.EventType.SCROLL_ENDED,()=>{
            this.scrollToOffset(scroll);
        },this);
        this.nowOffsetY = scroll.getScrollOffset().y;
        /**加载listView子节点 */
        this.listViewExtra.updateData(this.listData);

        this.updateListSelectChildren();

        this.setSelectChildIndex(1);
    }

    /**刷新复用后的item列表 */

    updateListSelectChildren(){
        const height = this.listViewExtra.itemHeight.valueOf();
        let index = 0;
        this.selectChildren = [];
        this.listViewExtra.itemList.forEach((itemNode,i)=>{
            let jsItem = itemNode.getComponent(DateListItemNew);
            let itemPos = this.listViewExtra.getPositionInView(itemNode);
            let absY = Math.abs(itemPos.y);
            if(jsItem.labNum.string !== " "){
                this.selectChildren[index] = itemNode;
                // itemNode.setScale((600 -absY)/600,(600 -absY)/600,(600 -absY)/600);
                if(absY < height / 2){
                    // itemNode.getComponent(UIOpacity).opacity = 120 + (height/2-absY)*7;
                    this.selectChildIndex = index;
                }else{
                    // itemNode.getComponent(UIOpacity).opacity = 120;
                }
                index ++;
            }
        });
    }

    getScrollChildOffset(scroll:ScrollView){
        this.updateListSelectChildren();
        /**每个子节点高度，用来计算区间 */
        let height = this.listViewExtra.itemHeight.valueOf();
        let maxoffset = scroll.getMaxScrollOffset().y;
        let offset = scroll.getScrollOffset().y;
        if(offset < 0){
            this.selectChildIndex = 0;
            return 0;
        }else if(offset > maxoffset){
            return maxoffset;
        }
        let o = 0;
        let o2 = height;
        let i = 0;
        while(true){
            if(Math.abs(o - offset) < Math.abs(o2 - offset)){
                return o;
            }
            o += height;
            o2 += height;
            i ++;
        }
    }

    setSelectChildIndex(idx:number){
        for (let i = 0; i < this.selectChildren.length; i++) {
            // this.selectChildren[i].getComponent(UIOpacity).opacity = i == idx ? 255:120;
            let jsItem = this.selectChildren[i].getComponent(DateListItemNew);
            if(i == idx){
                jsItem.labNum.color = new Color("#843C2F");
            }else{
                jsItem.labNum.color = Color.WHITE;
            }
        }
        let jsItem = this.selectChildren[idx].getComponent(DateListItemNew);
        // 这里回调，传出选择结果
    }

    scrolling(scroll:ScrollView){
        this.updateListSelectChildren();
        /**每个子节点高度，用来计算区间 */
        let maxoffset = scroll.getMaxScrollOffset().y;
        let offset = scroll.getScrollOffset().y;
        /**惯性速度低于x后停止滚动 */
        if(this.contentY){
            let sudo = scroll.content.getPosition().y - this.contentY;
            if(Math.abs(sudo) <= 5){
                scroll.stopAutoScroll();
            }
        }

        this.contentY = scroll.content.getPosition().y;

        if(offset < 0){
            this.selectChildIndex = 0;
            return;
        }else if(offset >= maxoffset){
            return;
        }
    }
    scrollToOffset(scroll:ScrollView){
        const offset = this.getScrollChildOffset(scroll);
        const scrollOffset = scroll.getScrollOffset();

        if(Math.abs(this.nowOffsetY - scrollOffset.y) < 0.01){
            return this.setSelectChildIndex(this.selectChildIndex);
        }
        this.nowOffsetY = offset;
        scroll.scrollToOffset(new math.Vec2(scrollOffset.x,this.nowOffsetY),0.5);
    }
}


