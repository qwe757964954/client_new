import { PrefabType } from "../../config/PrefabType";
import { GameMode } from "../../models/AdventureModel";

export default class ChallengeUtil {
    public static calculateMapsNeeded(totalLevels: number, levelsPerMap: number): number {
        return Math.ceil(totalLevels / levelsPerMap);
    }
}


export const GameStudyViewMap = {
    [GameMode.Study]: PrefabType.StudyModeView,
    [GameMode.Practice]: PrefabType.WordPracticeView,
    [GameMode.Spelling]: PrefabType.WordSpellView,
    [GameMode.WordMeaning]: PrefabType.WordMeaningView,
    [GameMode.Reading]: PrefabType.WordReadingView,
    [GameMode.Exam]: PrefabType.WordExamView
};