import { CCFloat, CCInteger, Component, Node, Prefab, ScrollView, UITransform, Vec3, _decorator, instantiate, isValid, macro } from 'cc';
import { DateListItemNew } from './DateListItemNew';
const { ccclass, property } = _decorator;

@ccclass('DateListView')
export class DateListView extends Component {
    @property(ScrollView)
    public scrollView: ScrollView = null;

    @property(Prefab)
    public itemPrefab: Prefab = null; // item预制体 预制挂的脚本要继承ListViewItem

    @property({type: CCInteger})
    direction:number = 1; //1代表竖屏

    @property({type: CCInteger})
    spawnCount:number = 1; //实际创建的项数量

    @property({type: CCFloat})
    spacingY:number = 0; //纵向间隔

    @property({type: CCFloat})
    spacingX:number = 0; //纵向间隔

    @property({type: CCFloat})
    itemHeight:number = 0; //item的高度

    @property({type: CCFloat})
    itemWidth:number = 0; //item的宽度

    @property({type: CCInteger})
    colNum:number = 0; //纵向布局时的列数

    @property({type: CCInteger})
    rowNum:number = 0; //横向布局时的行数

    private initialled: boolean = false;
    private DirectionVertical:number =1; //1 为竖屏其他为横屏

    private obj:any = null;
    private dataList:any = null;
    private totalCount:number = 0;
    private content:Node = null;
    private updateTimer:number = 0;
    private updateInterval:number = 0.05;
    private lastContentPosY:number = 0;
    private lastContentPosX:number = 0;
    private lastContentPosyPageLoad:number = 0;
    private bufferZoneY:number = 0;
    private bufferZoneX:number = 0;
    private callBack:Function = null;
    public itemList:Node[] = [];
    onLoad(): void {
        
    }

    start() {

    }

    init(list:any,params:any){
        if(this.initialled){
            return;
        }
        this.obj = params;
        this.dataList = list || [];
        // this.spawnCount = list.length;
        this.totalCount = this.dataList.length;
        this.content = this.scrollView.content;
        this.updateTimer = 0;
        this.updateInterval = 0.05;
        this.lastContentPosY = 0; // 使用这个变量来判断滚动操作时向上还是向下
        this.lastContentPosX = 0; // 使用这个变量来判断滚动操作时向左还是向右
        this.lastContentPosyPageLoad = 0; //这个属性是特殊场景上用，加载更多的最后恢复的位置（在上拉过程中会重置lastContentPosY，所有不准确）
        // 设定缓冲矩形的大小为实际创建项的高度累加，当某项超出缓冲矩形时，则更新该项的显示内容
        this.bufferZoneY = Math.ceil(this.spawnCount.valueOf() / this.colNum.valueOf()) * (this.itemHeight.valueOf() + this.spacingY.valueOf()) / 2;
        // 设定缓冲矩形的大小为实际创建项的宽度累加，当某项超出缓冲矩形时，则更新该项的显示内容
        this.bufferZoneX = Math.ceil(this.spawnCount.valueOf() / this.rowNum.valueOf()) * (this.itemWidth.valueOf() + this.spacingX.valueOf()) / 2;
        this.initialize();
        this.initialled = true;
        this.callBack = null;
    }

    removeAllItems(){
        for (const key in this.itemList) {
            if (Object.prototype.hasOwnProperty.call(this.itemList, key)) {
                if (this.itemList[key]) {
                    this.itemList[key] = null;
                }
            }
        }
        this.itemList = [];
        if(this.content){
            this.content.removeAllChildren();
        }
    }

    // 列表初始化
    initialize(){
        // 列表整个列表的高度
        if(this.direction == this.DirectionVertical){
            this.content.getComponent(UITransform).height = Math.ceil(this.totalCount.valueOf() / this.colNum.valueOf()) * (this.itemHeight.valueOf() + this.spacingY.valueOf()) + this.spacingY.valueOf();
            
            for(let i = 0; i < this.spawnCount.valueOf(); i++){
                let item = instantiate(this.itemPrefab);
                this.content.addChild(item);
                item.active = true;
                //设置该item的坐标，（注意父节点的content的Anchor坐标是(0.5,1),所以item的y坐标总是负值
                let row = Math.floor(i / this.colNum.valueOf());
                let col = i % this.colNum.valueOf();
                let x = (this.itemWidth.valueOf() + this.spacingX.valueOf()) * (-(this.colNum.valueOf() - 1) / 2+ col);
                item.setPosition(x,-this.itemHeight.valueOf() * (0.5 + row) - this.spacingY.valueOf() * (1),0);
                item.getComponent(DateListItemNew).index = i;   
                item.getComponent(DateListItemNew).updateItem(i,this.dataList[i],this.obj);
                this.itemList.push(item);
            }
        }else{
            this.content.getComponent(UITransform).width = Math.ceil(this.totalCount.valueOf() / this.rowNum.valueOf()) * (this.itemWidth.valueOf() + this.spacingX.valueOf()) + this.spacingX.valueOf();
            for(let i = 0; i < this.spawnCount.valueOf(); i++){
                let item = instantiate(this.itemPrefab);
                this.content.addChild(item);
                item.active = true;
                //设置该item的坐标，（注意父节点的content的Anchor坐标是(0.5,1),所以item的y坐标总是负值
                let row = Math.floor(i / this.rowNum.valueOf());
                let col = i % this.rowNum.valueOf();
                let y = (this.itemHeight.valueOf() + this.spacingY.valueOf()) * ((this.rowNum.valueOf() - 1) / 2- row);
                item.setPosition(-this.itemWidth.valueOf() * (0.5 + row) - this.spacingX.valueOf() * (col + 1),y,0);
                item.getComponent(DateListItemNew).index = i;   
                item.getComponent(DateListItemNew).updateItem(i,this.dataList[i],this.obj);
                this.itemList.push(item);
            }
        }
    } 
    
    // 返回item 在scrollView 空间的坐标值
    getPositionInView(item:Node):Vec3{
        if(isValid(item) && isValid(item.parent)){
            let worldPos = item.parent.getComponent(UITransform).convertToWorldSpaceAR(item.getPosition());
            let viewPos = this.scrollView.node.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
            return viewPos;
        }
    }
    // 每帧调用一次。根据滚动位置动态更新item的坐标和显示(所以spawnCount可以比totalCount少很多)
    update(dt){
        if(!this.initialled){
            return;
        }
        this.updateTimer += dt;
        if(this.updateTimer < this.updateInterval || (this.itemList && this.itemList.length <= 0)){
            return; //我们不需要没帧都做计算
        }

        this.updateTimer = 0;
        let items = this.itemList;

        if(this.direction == this.DirectionVertical){
            //如果当前content 的y坐标小于上次记录值，则代表往下滚动，否则往上。
            let isDown = this.content.getPosition().y < this.lastContentPosY;
            // 实际创建项占了多高（即它们的高度累加）
            let offset = (this.itemHeight.valueOf() + this.spacingY.valueOf()) * Math.ceil(this.spawnCount.valueOf() / this.colNum.valueOf());
            let newY = 0;

            //遍历数组，更新item的位置和显示
            for (let i = 0; i < items.length; i++) {
                let viewPos = this.getPositionInView(items[i]);
                if(isDown){
                    //提前计算出该item的新的y坐标;
                    newY = items[i].getPosition().y + offset;
                    //如果往下滚动时item已经超出缓冲举行，切newY未超出contetn上边界,
                    // 则更新item的坐标（既上移了一个offset的位置），同时更新item的显示内容
                    if(viewPos.y < -this.bufferZoneY && newY < 0){
                        items[i].setPosition(items[i].getPosition().x,newY);
                        let itemComp = items[i].getComponent(DateListItemNew);
                        let index = itemComp.index.valueOf() - items.length; // 更新index及更新下标
                        itemComp.index = index;
                        itemComp.updateItem(index,this.dataList[index],this.obj);
                    }
                }else{
                    //提前计算出该item的新的y坐标;
                    newY = items[i].getPosition().y - offset;
                    //如果往上滚动时item已经超出缓冲举行，切newY未超出contetn下边界,
                    // 则更新item的坐标（既下移了一个offset的位置），同时更新item的显示内容
                    if(viewPos.y > this.bufferZoneY && newY > -this.content.getComponent(UITransform).height){
                        items[i].setPosition(items[i].getPosition().x,newY);
                        let itemComp = items[i].getComponent(DateListItemNew);
                        let index = itemComp.index.valueOf() + items.length; // 更新index及更新下标
                        itemComp.index = index;
                        itemComp.updateItem(index,this.dataList[index],this.obj);
                        this.lastContentPosyPageLoad = this.content.getPosition().y;
                    }
                }
            }
            // 更新lastContentPosY和总项数显示
            this.lastContentPosY = this.content.getPosition().y;
        }else{
            // 如果当前content 的x坐标小于上次记录值，则代表往右滚动，否则往左。
            let isLeft = this.content.getPosition().x < this.lastContentPosX;
            // 实际创建项占了多宽（即它们的宽度累加）
            let offset = (this.itemWidth.valueOf() + this.spacingX.valueOf()) * Math.ceil(this.spawnCount.valueOf() / this.rowNum.valueOf());
            let newX = 0;
            //遍历数组，更新item的位置和显示
            for (let i = 0; i < items.length; i++) {
                let viewPos = this.getPositionInView(items[i]);
                if(isLeft){
                    //提前计算出该item的新的x坐标;
                    newX = items[i].getPosition().x + offset;
                    //如果往左滚动时item已经超出缓冲举行，切newX未超出contetn左边界,
                    // 则更新item的坐标（既左移了一个offset的位置），同时更新item的显示内容
                    if(viewPos.x < -this.bufferZoneX && newX < this.content.getComponent(UITransform).width){
                        items[i].setPosition(newX,items[i].getPosition().y);
                        let itemComp = items[i].getComponent(DateListItemNew);
                        let index = itemComp.index.valueOf() - items.length; // 更新index及更新下标
                        itemComp.index = index;
                        itemComp.updateItem(index,this.dataList[index],this.obj);
                    }
                }else{
                    //提前计算出该item的新的x坐标;
                    newX = items[i].getPosition().x - offset;
                    //如果往右滚动时item已经超出缓冲矩形，且newY未超出contetn左边界，
                    // 则更新item的坐标（既左移了一个offset的位置），同时更新item的显示内容
                    if(viewPos.x > this.bufferZoneX && newX > 0){
                        items[i].getPosition().x = newX;
                        let itemComp = items[i].getComponent(DateListItemNew);
                        let index = itemComp.index.valueOf() - items.length; // 更新index及更新下标
                        itemComp.index = index;
                        itemComp.updateItem(index,this.dataList[index],this.obj);
                    }
                }
            }
            // 更新lastContentPosX和总项数显示
            this.lastContentPosX = this.content.getPosition().x;
        }
    }
    //更新列表内数据
    updateData(list?:any,isSplitLoad?:boolean,notScrollToTop?:boolean){
        this.dataList = list;
        let NotScrollToTop = this.dataList && this.dataList.length > this.spawnCount.valueOf();
        this.scrollView.stopAutoScroll();
        if(isSplitLoad){
            this.updateDataAndSplitLoad(this.dataList);
            return;
        }
        if(this.direction == this.DirectionVertical){
            if(!notScrollToTop || !NotScrollToTop){
                this.scrollView.scrollToTop();
            }
            for (let i = 0; i < this.itemList.length; i++) {
                let tempNum = i / this.colNum.valueOf();
                const row = Math.floor(i / this.colNum.valueOf());
                this.itemList[i].setPosition(this.itemList[i].getPosition().x,-this.itemHeight.valueOf() * (0.5 + row) - this.spacingY.valueOf() * (row + 1),0);
                let itemComp = this.itemList[i].getComponent(DateListItemNew);
                let data = this.dataList[i];
                itemComp.index = i;
                itemComp.updateItem(i,data,this.obj);
            }
            this.content.getComponent(UITransform).height = Math.ceil(this.dataList.length / this.colNum.valueOf()) * (this.itemHeight.valueOf() + this.spacingY.valueOf()) + this.spacingY.valueOf();
        }else{
            if(!notScrollToTop || !NotScrollToTop){
                this.scrollView.scrollToLeft();
            }
            for (let i = 0; i < this.itemList.length; i++) {
                const col = Math.floor(i / this.rowNum.valueOf());
                this.itemList[i].setPosition(this.itemWidth.valueOf() * (0.5 + col) - this.spacingX.valueOf() * (col + 1),this.itemList[i].getPosition().y,0);
                let itemComp = this.itemList[i].getComponent(DateListItemNew);
                let data = this.dataList[i];
                itemComp.index = i;
                itemComp.updateItem(i,data,this.obj);
            }
            this.content.getComponent(UITransform).width = Math.ceil(this.dataList.length / this.rowNum.valueOf()) * (this.itemWidth.valueOf() + this.spacingX.valueOf()) + this.spacingX.valueOf();
        }
        this.updateHeightForData();
    }

    updateDataNoChangeIndex(list:any){
        if(!list || list.length <= 0){
            this.dataList.content.x = 0;
            return;
        }
        this.dataList = list;
        for (let i = 0; i < this.itemList.length; i++) {
            let itemComp = this.itemList[i].getComponent(DateListItemNew);
            let data = this.dataList[itemComp.index.valueOf()];
            itemComp.updateItem(itemComp.index.valueOf(),data,this.obj);
        }
        this.content.getComponent(UITransform).width = Math.ceil(this.dataList.length / this.colNum.valueOf()) * (this.itemWidth.valueOf() + this.spacingX.valueOf()) + this.spacingX.valueOf();
    }

    //更新列表内数据，分帧加载。
    updateDataAndSplitLoad(list:any){
        this.initialled = false;
        this.dataList = list;
        this.scrollView.stopAutoScroll();
        if(this.callBack){
            this.unschedule(this.callBack);
        }
        if(this.direction == this.DirectionVertical){
            let i = 0;
            this.scrollView.scrollToTop();
            this.content.getComponent(UITransform).height = 0;
            this.callBack = ()=>{
                if(i >= this.itemList.length || !isValid(this.content)){
                    this.unschedule(this.callBack);
                    this.callBack = null;
                    this.initialled = true;
                    if(this.content){
                        this.content.getComponent(UITransform).height = Math.ceil(this.dataList.length / this.colNum.valueOf()) * (this.itemHeight.valueOf() + this.spacingY.valueOf()) + this.spacingY.valueOf();
                        return;
                    }
                }
                let row = Math.floor(i / this.colNum.valueOf());
                this.itemList[i].setPosition(this.itemList[i].getPosition().x,-this.itemHeight * (0.5 + row) - this.spacingY.valueOf() * (row + 1),0)
                let itemComp = this.itemList[i].getComponent(DateListItemNew);
                let data = this.dataList[i];
                itemComp.index = i;
                itemComp.updateItem(i, data, this.obj);
                i++;
            };
        }else{
            let i = 0;
            this.scrollView.scrollToLeft();
            this.content.getComponent(UITransform).width = 0;
            this.callBack = ()=>{
                if(i >= this.dataList.length || !isValid(this.content)){
                    this.unschedule(this.callBack);
                    this.callBack = null;
                    this.initialled = true;
                    if(this.content){
                        this.content.getComponent(UITransform).width = Math.ceil(this.dataList.length / this.rowNum.valueOf()) * (this.itemWidth.valueOf() + this.spacingX.valueOf()) + this.spacingX.valueOf();
                        return;
                    }
                }
                let col = Math.floor(i / this.rowNum.valueOf());
                this.itemList[i].getPosition().x = this.itemWidth.valueOf() * (0.5 + col) + this.spacingX.valueOf() * (col + 1);
                let itemComp = this.itemList[i].getComponent(DateListItemNew);
                itemComp.index = i;
                let data = this.dataList[i];
                itemComp.updateItem(i,data,this.obj);
                i++;
            };
        }
        this.schedule(this.callBack,0.02,macro.REPEAT_FOREVER);
    }

    updateHeightForData(data?: any){
        if(data){
            this.dataList = data;
        }
        if(this.dataList){
            let length = this.dataList.length;
            if(this.direction == this.DirectionVertical){
                // 计算真是高度
                this.content.getComponent(UITransform).height = Math.ceil(length / this.colNum.valueOf()) * (this.itemHeight.valueOf() + this.spacingY.valueOf()) + this.spacingY.valueOf();
                // 设置最小高度，使其能滚动
                let viewHeight = this.content.parent.getComponent(UITransform).height;
                if(this.content.getComponent(UITransform).height < viewHeight){
                    this.content.getComponent(UITransform).height = viewHeight;
                }
            }else{
                // 计算真是宽度
                this.content.getComponent(UITransform).width = Math.ceil(length / this.rowNum.valueOf()) * (this.itemWidth.valueOf() + this.spacingX.valueOf()) + this.spacingX.valueOf();
                // 设置最小宽度，使其能滚动
                let viewWidth = this.content.parent.getComponent(UITransform).width;
                if(this.content.getComponent(UITransform).width < viewWidth){
                    this.content.getComponent(UITransform).width = viewWidth;
                }
            }
        }

    }
}


