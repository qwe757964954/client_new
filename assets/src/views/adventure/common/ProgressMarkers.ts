import { _decorator, Node, Sprite, SpriteFrame } from 'cc';
import { ResLoader } from '../../../manager/ResLoader';
import ListItem from '../../../util/list/ListItem';
import { TopStudyItem } from './TopLabel';

const { ccclass, property } = _decorator;

@ccclass('ProgressMarkers')
export class ProgressMarkers extends ListItem {
    @property(Node)
    public characterStudy: Node = null;

    private static spriteFrameCache = new Map<string, SpriteFrame>();

    start() {
        // 初始化时的设置，如果有必要可以添加
    }

    async updateProps(data: TopStudyItem, select: boolean) {
        try {
            // Load character sprite frame
            await this.loadSpriteFrame(
                "adventure/sixModes/study/" + data.img + "/spriteFrame",
                this.characterStudy.getComponent(Sprite)
            );

            // Load background sprite frame based on selection
            const bgUrl = select ? 
                "adventure/sixModes/study/progress_markers1/spriteFrame" :
                "adventure/sixModes/study/progress_markers/spriteFrame";

            await this.loadSpriteFrame(bgUrl, this.node.getComponent(Sprite));
        } catch (error) {
            console.error('Failed to update props:', error);
        }
    }

    private async loadSpriteFrame(url: string, spriteComponent: Sprite | null) {
        if (!spriteComponent) return;

        // Check cache first
        let spriteFrame = ProgressMarkers.spriteFrameCache.get(url);
        if (!spriteFrame) {
            spriteFrame = await ResLoader.instance.loadAsyncPromise<SpriteFrame>("resources", url, SpriteFrame) as SpriteFrame;
            ProgressMarkers.spriteFrameCache.set(url, spriteFrame);
        }

        // Update sprite component
        if (spriteComponent) {
            spriteComponent.spriteFrame = spriteFrame;
        }
    }
}
