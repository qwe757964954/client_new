import { c2sWordbookCorrectWord, c2sWordbookErrorbook, c2sWordbookWordDetail, c2sWordbookWordSubmit } from "../models/NetModel";
import { NetMgr } from "../net/NetManager";


export class WordbookService {
    /**错题本 */
    public reqErrorbook(word_type: string) {
        console.log("reqErrorbook", word_type);
        let para = new c2sWordbookErrorbook();
        para.word_type = word_type;
        NetMgr.sendMsg(para);
    }
    /**单词收藏 */
    public reqCollectWord(w_id: string, action: number) {
        console.log("reqCollectWord", w_id, action);
        let para = new c2sWordbookCorrectWord();
        para.w_id = w_id;
        para.action = action;
        NetMgr.sendMsg(para);
    }
    /**单词详情 */
    public reqWordDetail(word: string) {
        console.log("reqWordDetail", word);
        let para = new c2sWordbookWordDetail();
        para.word = word;
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