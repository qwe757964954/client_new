import { BaseRepPacket } from "../../models/NetModel";

export interface SearchWordItem {
    word: string;
    cn: string;
    symbol: string;
    symbolus: string;
    syllable: string;
    phonic: string;
    example: string;
    example_cn: string;
    etyma: string;
    ancillary: string;
    speech: string;
    is_collect: number;
}

export interface SearchWordResponse extends BaseRepPacket{
    word: SearchWordItem;
}