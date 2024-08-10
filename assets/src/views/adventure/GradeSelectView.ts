import { _decorator, Label, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { KeyConfig } from '../../config/KeyConfig';
import { BasePopup } from '../../script/BasePopup';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import StorageUtil from '../../util/StorageUtil';
import { educationAndExams, EducationGrade } from './AdventureInfo';
import { GradeItem } from './item/GradeItem';
import { LevelItem } from './item/LevelItem';
const { ccclass, property } = _decorator;

@ccclass('GradeSelectView')
export class GradeSelectView extends BasePopup {
    @property(Node)
    public closeBtn: Node = null;
    @property(List)
    public levelList: List = null;
    @property(Node)
    public sureBtn: Node = null;
    @property(Label)
    public selectLabel: Label = null;


    protected initUI(): void {
        this.enableClickBlankToClose([this.node.getChildByName("frame")]);
        this.levelList.numItems = educationAndExams.length;
        StorageUtil.saveData(KeyConfig.FIRST_WORLD_MAP, "0");
    }
    protected onInitModuleEvent() {
        this.addModelListeners([
            [EventType.Grade_Select_Event, this.onGradeSelectEvent.bind(this)],
        ]);
	}
    protected initEvent(): void {
        CCUtil.onBtnClick(this.closeBtn,this.onCloseClick.bind(this));
    }
    onCloseClick(){
        this.closePop();
    }
    onLevelListRender(item: Node, index: number) {
        let script = item.getComponent(LevelItem);
        script.setData(educationAndExams[index]);
    }
    onLevelListSelected(item: Node, selectedId: number) {
        
    }
    onGradeSelectEvent(gradeData: EducationGrade) {
        // 遍历所有关卡项
        for (let i = 0; i < this.levelList.numItems; i++) {
            const item = this.levelList.getItemByListId(i);
            const script: LevelItem = item.getComponent(LevelItem);
            
            // 查找在 gradeDatas 中匹配的等级索引
            const selectedIndex = script.gradeDatas.findIndex(data => data.grade === gradeData.grade);
    
            // 设置选中的关卡项
            if (selectedIndex >= 0) {
                this.levelList.selectedId = i;
            }
    
            // 更新 gradeList 中项目的颜色
            this.updateGradeListColors(script.gradeList, selectedIndex);
        }
    }
    
    // 工具函数：更新 gradeList 项目的颜色
    private updateGradeListColors(gradeList: List, selectedIndex: number) {
        console.log("updateGradeListColors",selectedIndex);
        gradeList.selectedId = selectedIndex;
        for (let j = 0; j < gradeList.numItems; j++) {
            const gradeItem = gradeList.getItemByListId(j);
            const gradeScript: GradeItem = gradeItem.getComponent(GradeItem);
            
            // 根据是否选中来设置颜色
            if (selectedIndex >= 0 && j === selectedIndex) {
                gradeScript.setSelectColor();
            } else {
                gradeScript.setNormalColor();
            }
        }
    }
    
    
}


