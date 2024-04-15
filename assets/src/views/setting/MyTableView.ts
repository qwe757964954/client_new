import { _decorator, Component, Label, Node, Size, UITransform} from 'cc';
import { ViewsManager } from '../../manager/ViewsManager';
import { PrefabType } from '../../config/PrefabType';
import { User } from '../../models/User';
import { SettingConfig } from '../../config/SettingConfig';
const { ccclass, property } = _decorator;

@ccclass('MyTableView')
export class MyTableView extends Component {
    
    @property(Node)
    public cihuiliangBox:Node = null;     // 词汇量节点
    @property(Node)
    public countList:Node = null;  // 预览的头像框
    @property(Node)
    public gradeList:Node = null;  // 预览的头像框

    private _studyWord: number = 0; // 已学习的词汇量总量

    start() {
        this._studyWord = 0;
        this.initUI();
    }

    // 初始化UI
    initUI() {
        let datas = SettingConfig.WordQuantityDataModule;
        for (let index = 0; index < datas.length; index++) {
            const data = datas[index];
            // 词汇量
            let vocabulary = this.cihuiliangBox.getChildByName("vocabularyNum" + (index+1));
            if (vocabulary) {
                vocabulary.getComponent(Label).string = data.num.toString();
            }
            // 表格左侧
            let count = this.countList.getChildByName("Label" + (index+1));
            if (count) {
                count.getComponent(Label).string = data.num.toString();
            }
            // 表格底部
            this.initTableBottom(index, data);
        }
        
    }

    initTableBottom(index: number, data: {id: number;num: number;grade: string;height: number;}) {
        let grade = this.gradeList.getChildByName("box" + (index+1));
        if (grade) {
            let nameTxt = grade.getChildByName("nameTxt");
            let quantity = grade.getChildByName("quantity");
            let current = grade.getChildByName("current");
            let numTxt = grade.getChildByName("numTxt");

            nameTxt.getComponent(Label).string = data.grade;
            quantity.getComponent(UITransform).setContentSize(new Size(50, data.height));
            let curHeight = this._studyWord / data.num * data.height;
            // 满了
            if (this._studyWord >= data.num) {
                curHeight = data.height;
            }
            else {
                // 超过前面的至少比前面的长
                if (index != 0) {
                    let preData = SettingConfig.WordQuantityDataModule[index - 1];
                    // 达不到前面的则不展示
                    if (this._studyWord < preData.num) {
                        numTxt.active = false;
                        current.active = false;
                        return;
                    }
                    else {
                        curHeight = preData.height + this._studyWord / data.num * (data.height - preData.height);
                    }
                }
                else {
                    curHeight = this._studyWord / data.num * data.height;
                }
            }
            current.getComponent(UITransform).setContentSize(new Size(50, curHeight));
            numTxt.getComponent(Label).string = this._studyWord.toString();
        }
    }

    // 关闭
    btnCloseFunc() {
        console.log("btnCloseFunc");
        ViewsManager.instance.closeView(PrefabType.MyTableView);
    }
}


