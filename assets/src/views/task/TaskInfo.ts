
export const taskInfos = [
    { id: 1, title: "登录天数", description: "登录2次" },
    { id: 2, title: "登陆时长", description: "登陆时长达到40分钟" },
    { id: 3, title: "词意模式新通关", description: "本周通3关新的词意模式" },
    { id: 4, title: "抄写模式新通关", description: "本周通3关新的抄写模式" },
    { id: 5, title: "组合模式新通关", description: "本周通3关新的组合模式" },
    { id: 6, title: "朗读模式新通关", description: "本周通3关新的朗读模式" },
    { id: 7, title: "拼写模式新通关", description: "本周通3关新的拼写模式" },
    { id: 8, title: "本周采矿次数", description: "本周采矿2次" },
    { id: 9, title: "本周浇树次数", description: "本周浇树2次" },
    { id: 10, title: "完成复习规划", description: "完成复习规划1次" }
  ];

  // Box animation data array
 export const boxAniData = [
    { id: 1, aniurl: "chest_tutor", x: 130, y: -20 },
    { id: 2, aniurl: "chest_uncommon", x: 255, y: -20 },
    { id: 3, aniurl: "chest_rare", x: 380, y: -20 },
    { id: 4, aniurl: "chest_epic", x: 510, y: -20 },
    { id: 5, aniurl: "chest_legend", x: 625, y: -20 }
  ];
  
  export const AchevementRewardInfos = [
    { id: 1, title: "成就总览", imageUrl: "totallook" },
    { id: 2, title: "成长", imageUrl: "juese" },
    { id: 3, title: "王国", imageUrl: "badge" },
    { id: 4, title: "副本", imageUrl: "fuben" },
    { id: 5, title: "精灵", imageUrl: "jingling" },
    { id: 6, title: "社交", imageUrl: "shejiao" },
  ];

  export const TaskTabInfos = [
    { id: 1, title: "成就挑战"},
    { id: 2, title: "每周任务"},
    { id: 3, title: "主线任务"},
    { id: 4, title: "每日任务"},
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
  reward: Reward[];
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
  reward: Reward[];
}

// 完整的数据结构
export interface TaskData {
  task_main: Task[];
  task_week: WeeklyTask[];
  task_week_box: WeeklyTaskBox[];
}