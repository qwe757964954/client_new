import { Component } from "cc";

// 基础组件
export class BaseComponent extends Component {
    
    protected _zIndex:number = 0;//层级

    public get ZIndex():number {
        return this._zIndex;
    }

}