import { _decorator, Label, Node, resources, Sprite, SpriteFrame } from 'cc';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;

export enum ButtomSelectType {
    SuperSearch= 0,/**超级查询 */
    WordSplitting= 1,/**单词拆分 */
    PhonicsLessons= 2,/**拼读课程 */
    VoiceEvaluation= 3,/**语音评测 */
    ReviewPush= 4,/**复习推送 */
    NewWordRecord= 5,/**生词记录 */
    AcademicRecord= 6,/**学情记录*/
    PhonicsGame= 7,/**拼读游戏 */
    GrammarLearning= 8,/**语法学习 */
}

export class BottomItemData {
    bottomType: ButtomSelectType;
}

@ccclass('BottomItem')
export class BottomItem extends ListItem {
    @property(Node)
    public bottom_img:Node = null;          // bottom_text
    @property(Label) 
    public bottom_text:Label = null;          // bottom_text名称
    private bottomStringMap: Map<number, string> = new Map([
        [ButtomSelectType.SuperSearch, "超级查询"],
        [ButtomSelectType.WordSplitting, "单词拆分"],
        [ButtomSelectType.PhonicsLessons, "拼读课程"],
        [ButtomSelectType.VoiceEvaluation, "语音评测"],
        [ButtomSelectType.ReviewPush, "复习推送"],
        [ButtomSelectType.NewWordRecord, "生词记录"],
        [ButtomSelectType.AcademicRecord, "学情记录"],
        [ButtomSelectType.PhonicsGame, "拼读游戏"],
        [ButtomSelectType.GrammarLearning, "语法学习"],
    ]);
    private bottomResourceMap: Map<number, string> = new Map([
        [ButtomSelectType.SuperSearch, "074"],
        [ButtomSelectType.WordSplitting, "iconpet"],
        [ButtomSelectType.PhonicsLessons, "019"],
        [ButtomSelectType.VoiceEvaluation, "mic"],
        [ButtomSelectType.ReviewPush, "chip"],
        [ButtomSelectType.NewWordRecord, "60"],
        [ButtomSelectType.AcademicRecord, "graph"],
        [ButtomSelectType.PhonicsGame, "108"],
        [ButtomSelectType.GrammarLearning, "113"],
    ]);
    updateItemProps(idx: number,itemInfo:BottomItemData){
        let type:ButtomSelectType = itemInfo.bottomType;
        this.bottom_text.string = this.bottomStringMap.get(type);
        let url: string = `setting/${this.bottomResourceMap.get(type)}/spriteFrame`;
        resources.load(url, SpriteFrame, (err, spriteFrame) => {
            if (!err) {
                this.bottom_img.getComponent(Sprite).spriteFrame = spriteFrame;
            }else{
                console.log(err);
            }
        });
    }
}


