import { _decorator, Component, error, Label, Node, Sprite, SpriteFrame, UITransform } from 'cc';
import { ResLoader } from '../../manager/ResLoader';
import { CurrentBookStatus } from '../../models/TextbookModel';
import List from '../../util/list/List';
import { EducationDataInfo, EducationDataInfos } from '../TextbookVocabulary/TextbookInfo';
import { UnitNumItem } from './UnitNumItem';

const { ccclass, property } = _decorator;

@ccclass('ChallengeBottomView')
export class ChallengeBottomView extends Component {
    @property(Label)
    private collectNum: Label = null;

    @property(Label)
    private collectTotal: Label = null;

    @property(Label)
    private moreText: Label = null;

    @property(List)
    private collectScroll: List = null;

    @property(Node)
    private chestBox: Node = null;

    private totalUnit: number = 0;
    private currentUnitIndex: number = 0;
    private educationInfo: EducationDataInfo = null;

    start() {
        // Initialization code, if any
    }

    public updateItemList(data: CurrentBookStatus) {
        this.educationInfo = EducationDataInfos.find(item => item.id === data.monster_id) || null;
        if (!this.educationInfo) {
            error(`EducationDataInfo not found for id: ${data.monster_id}`);
            return;
        }

        this.loadRewardBox();
        this.totalUnit = data.unit_total_num;
        this.currentUnitIndex = data.unit_pass_num;

        this.collectScroll.numItems = this.totalUnit;
        this.collectScroll.update();

        const isComplete = this.currentUnitIndex >= this.totalUnit;
        this.chestBox.getComponent(Sprite).grayscale = !isComplete;

        this.collectNum.string = this.currentUnitIndex.toString();
        this.collectTotal.string = this.totalUnit.toString();

        this.updateMoreTextVisibility();
    }

    private loadRewardBox() {
        const keyStr = this.educationInfo.box;
        ResLoader.instance.load(keyStr, SpriteFrame, (err: Error | null, spriteFrame: SpriteFrame) => {
            if (err) {
                error('Failed to load sprite frame:', err);
                return;
            }
            const sprite = this.chestBox.getComponent(Sprite);
            if (sprite) {
                sprite.spriteFrame = spriteFrame;
            }
        });
    }

    private updateMoreTextVisibility() {
        const scrollWidth = this.collectScroll.scrollView.getComponent(UITransform).width;
        const contentWidth = this.collectScroll.scrollView.content.getComponent(UITransform).width;
        this.moreText.node.active = contentWidth > scrollWidth;
    }

    public onLoadCollectHorizontal(item: Node, idx: number) {
        const unitNumItem = item.getComponent(UnitNumItem);
        if (unitNumItem) {
            const unitNum = idx + 1;
            const isComplete = this.currentUnitIndex >= unitNum;
            unitNumItem.updateRewardStatus(this.educationInfo, isComplete);
        } else {
            error('UnitNumItem component not found on the node.');
        }
    }
}
