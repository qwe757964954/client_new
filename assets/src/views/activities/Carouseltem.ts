import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Carouseltem')
export class Carouseltem extends Component {

    @property(Node)
    public item:Node = null;

    @property(Label)
    public num_text:Label = null;

    
}

