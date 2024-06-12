export class TextbookUtil { 
    public static calculateDays(totoal_level:number,challengesPerDay: number){
        return Math.ceil(totoal_level / challengesPerDay);
    }

    public static calculateLevels(totoal_level:number,days: number){
        return Math.ceil(totoal_level / days);
    }
}