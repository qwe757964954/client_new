import { EventType } from "../config/EventType";
import { WordCollectInfo } from "../config/WordConfig";
import { c2sWordbookCorrectWord, c2sWordbookErrorbook, c2sWordbookWordDetail, c2sWordbookWordSubmit, s2cWordbookCorrectWord } from "../models/NetModel";
import { InterfacePath } from "../net/InterfacePath";
import { NetMgr } from "../net/NetManager";
import { BaseControll } from "../script/BaseControll";
import { EventMgr } from "../util/EventManager";


export class WordbookService extends BaseControll {
    constructor() {
        super("WordbookService");
    }
    protected onInitModuleEvent(): void {
        this.addModelListener(InterfacePath.c2sWordbookCorrectWord, this.onRepCorrectWord.bind(this));
    }

    /**单词收藏回调 */
    private onRepCorrectWord(data: s2cWordbookCorrectWord) {
        if (200 != data.code) {
            return;
        }
        let obj = new WordCollectInfo();
        obj.w_id = data.w_id;
        obj.source = data.source_type;
        obj.is_collect = data.action;
        EventMgr.emit(EventType.Word_Collect_Refresh);
    }

    /**错题本 */
    public reqErrorbook(word_type: string) {
        console.log("reqErrorbook", word_type);
        let para = new c2sWordbookErrorbook();
        para.word_type = word_type;
        NetMgr.sendMsg(para);
    }
    /**单词收藏 */
    public reqCollectWord(w_id: string, action: number, souceType: number) {
        console.log("reqCollectWord", w_id, action, souceType);
        let para = new c2sWordbookCorrectWord();
        para.w_id = w_id;
        para.action = action;
        para.source_type = souceType;
        NetMgr.sendMsg(para);
    }
    /**单词详情 */
    public reqWordDetail(w_id: string, souceType: number) {
        console.log("reqWordDetail", w_id, souceType);
        let para = new c2sWordbookWordDetail();
        para.w_id = w_id;
        para.source_type = souceType;
        NetMgr.sendMsg(para);
    }
    /**单词本单词提交 */
    public reqWordSubmit(m_id: string, word: string, answer: string, status: number, cost_time: number, word_type: string) {
        console.log("reqWordSubmit", m_id, word, answer, status, cost_time, word_type);
        let para = new c2sWordbookWordSubmit();
        para.m_id = m_id;
        para.answer = answer;
        para.status = status;
        para.cost_time = cost_time;
        para.word_type = word_type;
        NetMgr.sendMsg(para);
    }
}