/**单词来源 */
export enum WordSourceType {
    total = 0,//总词库
    classification = 1,//教材单词
    word_game = 2,//单词大冒险
}

/**单词收藏状态 */
export class WordCollectInfo {
    w_id: string;//单词id 总词库是word单词
    source: WordSourceType;//来源 2表示单词大冒险 1表示教材单词 0表示总词库
    is_collect: number;//是否收藏 1收藏 0未收藏
    /**总词库单词可以不用传w_id */
    compare(word: string, source: WordSourceType, w_id?: string): boolean {
        if (source != this.source) return false;
        if (WordSourceType.total == source && word != this.w_id) return false;
        if (WordSourceType.total != source && w_id != this.w_id) return false;
        return true;
    }
}

/**单词信息 */
export class WordModel {
    word: string;//单词
    cn: string;//中文解释
    symbol: string;//音标 英标
    symbolus: string;//音标 美标

    phonic: string;//拼写
    syllable: string;//音节

    book_id: string;//书籍id
    unit_id: string;//单元id
    big_id: number;//岛屿id
    small_id: number;//关卡id
    subject_id: number;//主题id

    source: WordSourceType;//来源 2表示单词大冒险 1表示教材单词 0表示总词库
    w_id: string;//单词id
    wp_id: string;//复习计划id
    e_id: string;//错词id
    cw_id: string;//收藏单词id

    is_collect: number;//是否收藏
}

/**例句信息 */
export class WordSentenceModel {
    cn: string;
    sentence: string;
}
/**单词变形 */
export class WordVariantModel {
    word: string;
    spellvar: string;
    threeps: string;
    regpast: string;
    irregpast: string;
    reging: string;
    irreging: string;
    regperfect: string;
    irregperfect: string;
    plural: string;
    comparative: string;
    superlative: string;
}
/**单词组成 */
export class WordStructureModel {
    prefix_id: string;
    root_id: string;
    suffix_id: string;
}

/**单词详情信息 */
export class WordDetailModel {
    word: WordModel;
    sentence_list: WordSentenceModel[];
    similar_list: [];
    variant: WordVariantModel;
    structure: WordStructureModel;
}
