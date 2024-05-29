export interface RecordPhoneme {
    phoneme: string;
    pronunciation: number;
    span: {
        start: number;
        end: number;
    };
}

export interface RecordPhonics {
    overall: number;
    phoneme: string[];
    spell: string;
}

export interface RecordStress {
    overall: number;
    phoneme_offset: number;
    phonetic: string;
    ref_stress: number;
    spell: string;
    stress: number;
}

export interface RecordWord {
    charType: number;
    pause: {
        duration: number;
        type: number;
    };
    phonemes: RecordPhoneme[];
    phonics: RecordPhonics[];
    readType: number;
    scores: {
        overall: number;
        pronunciation: number;
        stress: RecordStress[];
    };
    span: {
        start: number;
        end: number;
    };
    word: string;
    word_parts: {
        beginIndex: number;
        charType: number;
        endIndex: number;
        part: string;
    }[];
}

export interface RecordWarning {
    code: number;
    message: string;
}

export interface RecordResult {
    duration: string;
    kernel_version: string;
    overall: number;
    pause_count: number;
    pronunciation: number;
    resource_version: string;
    stress: number;
    warning: RecordWarning[];
    words: RecordWord[];
}

export interface RecordResponseData {
    applicationId: string;
    audioUrl: string;
    dtLastResponse: string;
    eof: number;
    recordId: string;
    refText: string;
    result: RecordResult;
    tokenId: string;
}
