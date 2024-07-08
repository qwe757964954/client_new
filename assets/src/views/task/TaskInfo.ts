
  // Box animation data array
 export const boxAniData = [
    { id: 1, aniurl: "chest_tutor", x: 130, y: -20 },
    { id: 2, aniurl: "chest_uncommon", x: 255, y: -20 },
    { id: 3, aniurl: "chest_rare", x: 380, y: -20 },
    { id: 4, aniurl: "chest_epic", x: 510, y: -20 },
    { id: 5, aniurl: "chest_legend", x: 625, y: -20 }
  ];
  
// 定义 TaskTabIds 枚举
export enum TaskTabIds {
  AchievementChallenge = 1, // 成就挑战
  WeeklyTasks,
  MainTasks,
  DailyTasks,
  AchievementMedals,
  WordMonsterCards,
  BuildingAtlas,
  ClothingAtlas,
  ImageStore,
  DebrisArea,
  BuildingShop,
  Decoration,
  VocabularyRanking,
  KingdomRanking,
  CombatPowerRanking
}

// 定义 AchevementRewardIds 枚举
export enum AchevementRewardIds {
  Overview = 1,      // 成就总览
  Growth,            // 成长
  Kingdom,           // 王国
  Instance,          // 副本
  Elf,               // 精灵
  Social,             // 社交
  All, //全部
  Functional, //功能建筑
  Landmark, //地标建筑
  Decorative, //装饰建筑
  Flooring, //地板
  AllClothing, //服装全部
  Hairstyle,  //发型
  Hat,   //帽子
  Jacket, //上衣
  FunctionalBuilding,
  LandmarkBuilding,
  Decoration,
  ShopFlooring,
  ShopHat,
  ShopHairstyle,  // Hairstyles
  ShopTop,  // Tops
  ShopPants,  // Pants
  ShopShoes,  // Shoes
  ShopFaceShape  // Face Shapes
}



// 定义 AchevementRewardInfo 接口
export interface AchevementRewardInfo {
  id: AchevementRewardIds;
  title: string;
  imageUrl: string;
}

// 定义 TaskTabInfo 接口
export interface TaskTabInfo {
  id: TaskTabIds;
  title: string;
  subTabItems?: AchevementRewardInfo[];
}

// 定义 AchevementRewardInfos 数组
export const AchevementRewardInfos: AchevementRewardInfo[] = [
  { id: AchevementRewardIds.Overview, title: "成就总览", imageUrl: "totallook" },
  { id: AchevementRewardIds.Growth, title: "成长", imageUrl: "juese" },
  { id: AchevementRewardIds.Kingdom, title: "王国", imageUrl: "badge" },
  { id: AchevementRewardIds.Instance, title: "副本", imageUrl: "fuben" },
  { id: AchevementRewardIds.Elf, title: "精灵", imageUrl: "jingling" },
  { id: AchevementRewardIds.Social, title: "社交", imageUrl: "shejiao" },
];

// 定义 TaskTabInfos 数组
export const TaskTabInfos: TaskTabInfo[] = [
  {
      id: TaskTabIds.AchievementChallenge,
      title: "成就挑战",
      subTabItems: AchevementRewardInfos
  },
  {
      id: TaskTabIds.WeeklyTasks,
      title: "每周任务",
      subTabItems: [],
  },
  {
      id: TaskTabIds.MainTasks,
      title: "主线任务",
      subTabItems: [],
  },
  {
      id: TaskTabIds.DailyTasks,
      title: "每日任务",
      subTabItems: [],
  }
];

  // Define the types for the different parts of the data
  export interface Medal {
      MedalConfId: number;
  }
  
  export interface AchievementStatus {
      CurrentAchConfId: number;
      Mid: number;
      Status: number;
      NextIds: number[];
  }
  
  export interface Statistic {
      AchType: number;
      AchTotalNum: number;
      AchEndNum: number;
  }
  
  // Main data structure
  export interface AchInfoData {
      Level: number;
      MedalList: Medal[];
      RecStatusList: AchievementStatus[];
      Statistics: Statistic[];
  }
  
  // Main response structure
 export interface AchInfoResponse {
      Code: number;
      Data: AchInfoData;
      Msg: string;
      Path: string;
  }
  
  // 定义奖励的类型
export interface Reward {
  type: number;
  amount: number;
}

// 主任务结构
export interface Task {
  id: number;
  name: string;
  module_id: number;
  cond: string;
  reward: number[];
}

// 周任务结构
export interface WeeklyTask extends Task {
  require_num: number;
  exp: number;
  live_num: number;
}

// 周任务宝箱结构
export interface WeeklyTaskBox {
  id: number;
  need_live_num: number;
  reward: number[];
}

// 完整的数据结构
export interface TaskData {
  task_main: Task[];
  task_week: WeeklyTask[];
  task_week_box: WeeklyTaskBox[];
}