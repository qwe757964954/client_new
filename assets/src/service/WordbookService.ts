import { c2sWordbookErrorbook } from "../models/NetModel";
import { NetMgr } from "../net/NetManager";


export class WordbookService {
    /**错题本 */
    public reqErrorbook(word_type: string) {
        console.log("reqErrorbook");
        let para = new c2sWordbookErrorbook();
        para.word_type = word_type;
        NetMgr.sendMsg(para);
    }
}