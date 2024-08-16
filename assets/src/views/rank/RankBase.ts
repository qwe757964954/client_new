import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { LoadManager } from '../../manager/LoadManager';
import { UserRank } from '../../models/RankModel';
import ImgUtil from '../../util/ImgUtil';
const { ccclass,property } = _decorator;

@ccclass('RankBase')
export abstract class RankBase extends Component {
    @property(Node)
    public rank_icon: Node = null;

    @property(Node)
    public avatar_icon: Node = null;

    @property(Label)
    public rank_num: Label = null;

    @property(Label)
    public myname: Label = null;

    @property(Label)
    public score: Label = null;

    @property(Label)
    public praise: Label = null;

    private static readonly RANK_ICON_BASE_URL = "rank/rank_icon";
    private static readonly SPRITE_FRAME_SUFFIX = "/spriteFrame";

    protected getRankUrl(rank: string): string {
        return `${RankBase.RANK_ICON_BASE_URL}${rank}${RankBase.SPRITE_FRAME_SUFFIX}`;
    }

    protected updateRankIcon(data: UserRank): void {
        const isTopThree = parseInt(data.rank) <= 3;
        this.rank_icon.active = isTopThree;
        this.rank_num.node.active = !isTopThree;
        this.rank_num.string = data.rank;

        if (isTopThree) {
            const rankUrl = this.getRankUrl(data.rank);
            const rankIconSprite = this.rank_icon.getComponent(Sprite);
            if (rankIconSprite) {
                LoadManager.loadSprite(rankUrl, rankIconSprite);
            }
        }
    }

    protected updateAvatar(data: UserRank): void {
        const headUrl = ImgUtil.getAvatarUrl(data.avatar);
        const avatarSprite = this.avatar_icon.getComponent(Sprite);
        if (avatarSprite) {
            LoadManager.loadSprite(headUrl, avatarSprite);
        }
    }

    public abstract updateMyRankData(data: UserRank): void;
}
