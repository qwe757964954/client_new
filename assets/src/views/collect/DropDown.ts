import { _decorator, Component, Node, tween, UITransform, v3 } from 'cc';
import List from '../../util/list/List';
const { ccclass, property } = _decorator;

@ccclass('Dropdown')
export class Dropdown extends Component {
    @property(Node)
    public toggleButton: Node = null; // The button to toggle the dropdown

    @property(Node)
    public toggleIcon: Node = null; // The icon that rotates when toggling

    @property(List)
    public content: List = null; // The content of the dropdown

    @property(Node)
    public contentBg: Node = null; // The content of the dropdown

    @property(Number)
    public itemHeight: number = 55.3; // The height of each item

    private isOpen: boolean = false;

    onLoad() {
        this.toggleButton.on(Node.EventType.TOUCH_END, this.toggleDropdown, this);
        this.updateLayout();
    }

    toggleDropdown() {
        this.isOpen = !this.isOpen;
        this.updateLayout();
    }

    updateLayout() {
        const totalHeight = this.isOpen ? this.content.numItems * this.itemHeight : 0;
        const angle = this.isOpen ?  0: 180;
        this.animateHeightChange(this.contentBg, totalHeight);
        this.animateHeightChange(this.content.scrollView, totalHeight);
        this.animateHeightChange(this.content.scrollView.view, totalHeight);
        this.animateRotation(this.toggleIcon, angle);
    }

    animateHeightChange(node: any, height: number) {
        if (node && node.isValid) {
            tween(node.getComponent(UITransform))
                .to(0.2, { height: height })
                .start();
        }
    }

    animateRotation(node: Node, angle: number) {
        if (node && node.isValid) {
            tween(node)
                .to(0.2, { eulerAngles: v3(0, 0, angle) })
                .start();
        }
    }
}
