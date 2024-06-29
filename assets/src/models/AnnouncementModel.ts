import { InterfacePath } from "../net/InterfacePath";
import { BaseRepPacket } from "./NetModel";


export class c2sAnnouncement {
    command_id: string = InterfacePath.Classification_Announcement;
}

export interface AnnouncementItem {
    id: string;
    title: string;
    content: string;
    start_time: string;
    end_time: string;
    is_active: boolean;
}

export interface AnnouncementDataResponse extends BaseRepPacket {
    announcement_list: AnnouncementItem[];
}