import { _decorator } from 'cc';
import { UserRank } from '../../models/RankModel';
import { RankBase } from './RankBase'; // Adjust the import path as necessary
const { ccclass } = _decorator;

@ccclass('RankItem')
export class RankItem extends RankBase {

    public updateMyRankData(data: UserRank): void {
        console.log("updateMyRankData", data);
        
        this.myname.string = data.nick_name;
        this.score.string = data.word_count.toString();
        
        this.updateRankIcon(data);
        this.updateAvatar(data);
    }
}
