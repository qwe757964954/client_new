import { ArticleExercise, BossTopicData, GradeSkipExercisesListReply, UnitGroup, UnitWord, WordGroupModel } from "../../models/AdventureModel";

export enum SubjectType {
    WordMeaning = 0,
    WordSpelling = 1,
    WordReading = 2,
    WordExam = 3,
    UnitPractice = 4,
}
export class UnitSubject {
    type: number; //0词意模式 1拼写模式 2朗读模式 3测评模式 4单元练习题
    word?: UnitWord;
    wordOpts?: UnitWord[];
    exercises?: ArticleExercise;
    unitGroup?: UnitGroup;

    bossTopic?: BossTopicData;
    bossTopicOpts?: BossTopicData[];
}
class GradeSkipSubjectManager {
    private static _instance: GradeSkipSubjectManager;
    private _data: GradeSkipExercisesListReply;
    private _wordSubject: UnitWord[];
    private _exercisesSubject: ArticleExercise[];
    private _unitGroupList: UnitGroup[];
    private _allWordOpts?: UnitWord[];
    public totalSubjectLen: number = 0;

    public static get i(): GradeSkipSubjectManager {
        if (!this._instance) {
            this._instance = new GradeSkipSubjectManager();
        }
        return this._instance;
    }

    public setData(data: GradeSkipExercisesListReply) {
        this._data = data;
        this.randomSubject();
    }

    randomSubject() {
        this._unitGroupList = this._data.unit_group_list
        this._wordSubject = this._data.unit_word_list;
        this._exercisesSubject = this._data.unit_exercises_list;
        this._allWordOpts = [].concat(this._wordSubject);
        this._wordSubject.sort((a, b) => {
            return Math.random() > 0.5 ? 1 : -1;
        })
        this._exercisesSubject.sort((a, b) => {
            return Math.random() > 0.5 ? 1 : -1;
        })
        let subjectLen = (this._wordSubject.length + this._exercisesSubject.length > 10) ? 10 : (this._wordSubject.length + this._exercisesSubject.length);
        this.totalSubjectLen = subjectLen;
    }

    getSubjet(): UnitSubject {
        let unitSubject: UnitSubject = new UnitSubject();
        if (Math.random() > 0.5 && this._wordSubject.length > 0) { //单词题目
            unitSubject.type = Math.floor(Math.random() * 4); //单词题目模式随机
            unitSubject.word = this._wordSubject.pop();
            if (unitSubject.type == SubjectType.WordMeaning) {
                unitSubject.wordOpts = this._allWordOpts;
            } else if (unitSubject.type == SubjectType.WordSpelling) {
                unitSubject.unitGroup = this.getUnitGroupByWord(unitSubject.word);
            }
        } else {
            unitSubject.type = SubjectType.UnitPractice;
            unitSubject.exercises = this._exercisesSubject.pop();
        }
        return unitSubject;
    }

    getUnitGroupByWord(word: UnitWord): UnitGroup {
        return this._unitGroupList.find(unitGroup => unitGroup.word == word.word);
    }
}

export const GradeSkipSubjectMgr = GradeSkipSubjectManager.i;