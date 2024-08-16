import { InterfacePath } from "../net/InterfacePath";
import { BaseRepPacket } from "./NetModel";


//用户单词量排行榜
export class c2sUserVocabularyRank{
    command_id: string = InterfacePath.Classification_UserVocabularyRank;
}

export interface UserRank {
    user_id: number;
    user_name: string;
    nick_name: string;
    word_count: number;
    avatar: string;
    level: number;
    rank: string;
}

export interface WordRankResponse extends BaseRepPacket {
    word_rank: UserRank[];
    user_rank: UserRank;
}
