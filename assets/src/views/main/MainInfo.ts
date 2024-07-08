export enum MainActivityIds {
    Package = 1, // 背包
    Collect, //收集
    Rank, //排行
}

export interface MainActivityInfo {
    id: MainActivityIds;
    title: string;
    imageUrl: string;
  }

  // 定义 AchevementRewardInfos 数组
export const MainActivityInfos: MainActivityInfo[] = [
    { id: MainActivityIds.Package, title: "背包", imageUrl: "" },
    { id: MainActivityIds.Collect, title: "收集", imageUrl: "" },
    { id: MainActivityIds.Rank, title: "排行", imageUrl: "" },
  ];