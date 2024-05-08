import { InterfacePath } from "../net/InterfacePath";

//大冒险岛屿状态
export class c2sIslandStatus {
    command_id: string = InterfacePath.Island_Status;
    big_id: number;
}

//大冒险岛屿进度
export class c2sIslandProgress {
    command_id: string = InterfacePath.Island_Progress;
    big_id: number;
}

//单词大冒险获取单词数据
export class c2sWordGameWords {
    command_id: string = InterfacePath.WordGame_Words;
    big_id: number;
    small_id: number;
    micro_id: number;
    game_mode: number;
}

//获取单词详情
export class c2sClassificationWord {
    command_id: string = InterfacePath.Classification_Word;
    Word: string;
}