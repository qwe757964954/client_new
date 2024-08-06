export default class ChallengeUtil {
    public static calculateMapsNeeded(totalLevels: number, levelsPerMap: number): number {
        return Math.ceil(totalLevels / levelsPerMap);
    }
}
