import { _decorator, Color, Component, Label, Node, ProgressBar } from 'cc';
import { GameMode } from '../../../models/AdventureModel';
import List from '../../../util/list/List';
import { ToolUtil } from '../../../util/ToolUtil';
import { ProgressMarkers } from './ProgressMarkers';

const { ccclass, property } = _decorator;

export interface TopStudyItem {
    mode: GameMode;
    img: string;
}

const TopStudyModes: TopStudyItem[] = [
    { mode: GameMode.Study, img: "character_study" },
    { mode: GameMode.WordMeaning, img: "character_translate" },
    { mode: GameMode.Practice, img: "character_white_silk" },
    { mode: GameMode.Spelling, img: "character_spell" },
    { mode: GameMode.Reading, img: "character_read" },
];

@ccclass('TopLabel')
export class TopLabel extends Component {
    @property({ type: ProgressBar, tooltip: "进度条" })
    public progressbar: ProgressBar = null;

    @property({ type: Node, tooltip: "警告icon" })
    public warnIcon: Node = null;

    @property({ type: Label, tooltip: "错误次数" })
    public errorNumLabel: Label = null;

    @property({ type: Label, tooltip: "剩余时间" })
    public timeLabel: Label = null;

    @property(List)
    public mode_list: List = null;

    protected gameMode: GameMode = 0;
    private timeHandler: Function | null = null;
    private delayIndex: number = 0;
    private modeIndex: number = 0;


    showCountdown(totalIndex: number, game_mode: GameMode) {
        this.gameMode = game_mode;
        this.delayIndex = totalIndex;

        if (this.gameMode === GameMode.Exam) {
            this.cancelTimeSchedule();
            return;
        }

        this.modeIndex = TopStudyModes.findIndex(item => item.mode === this.gameMode);
        this.mode_list.numItems = TopStudyModes.length;

        this.updateProgressBar();
        this.warnIcon.active = true;

        if (this.delayIndex > 0) {
            this.startTimeSchedule();
        } else {
            this.cancelTimeSchedule();
        }
    }

    updateErrorNumber(errorNum: number) {
        this.errorNumLabel.string = `错误次数: ${errorNum}`;
    }

    updateLabelProcess(index: number, length: number, error: number) {
        this.errorNumLabel.string = `闯关进度：${index}/${length}`;
        this.timeLabel.string = `错误次数：${error}`;
    }

    cancelTimeSchedule() {
        if (this.timeHandler) {
            this.unschedule(this.timeHandler);
            this.timeHandler = null;
        }
        this.timeLabel.string = "已超时";
        this.timeLabel.color = Color.RED;
    }

    setTimeString() {
        this.warnIcon.active = this.delayIndex < 60;
        this.timeLabel.color = Color.WHITE;
        this.timeLabel.string = `剩余时间: ${ToolUtil.secondsToTimeFormat(this.delayIndex)}`;
    }

    startTimeSchedule() {
        if (this.timeHandler) return;

        this.setTimeString();
        this.timeHandler = () => {
            this.delayIndex -= 1;
            if (this.delayIndex <= 0) {
                this.cancelTimeSchedule();
            } else {
                this.setTimeString();
            }
        };
        this.schedule(this.timeHandler, 1);
    }

    updateProgressBar() {
        const total = TopStudyModes.length;
        this.progressbar.progress = this.modeIndex / total;
    }

    onLoadModeHorizontal(item: Node, idx: number) {
        const itemScript = item.getComponent(ProgressMarkers);
        if (itemScript) {
            const data = TopStudyModes[idx];
            itemScript.updateProps(data, this.modeIndex >= idx);
        }
    }
}
