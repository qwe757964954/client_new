import { TaskTabIds, TaskTabInfo } from "../task/TaskInfo";

// 定义 RankTabInfos 数组
export const RankTabInfos: TaskTabInfo[] = [
    {
        id: TaskTabIds.VocabularyRanking,
        title: "词汇量排名",
        subTabItems: []
    },
    {
        id: TaskTabIds.KingdomRanking,
        title: "王国分排名",
        subTabItems: []
    },
    {
        id: TaskTabIds.CombatPowerRanking,
        title: "战力排名",
        subTabItems: []
    }
];