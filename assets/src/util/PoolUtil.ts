import { Node, NodePool, _decorator, isValid } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PoolUtil')
export class PoolUtil {
    private static _instance: PoolUtil = null;
    private _nodeMap:Map<string,NodePool>=new Map();
    public static getInstance(): PoolUtil {
		if (!this._instance || this._instance == null) {
			this._instance = new PoolUtil();
		}
		return this._instance;
	}
    /**创建一个对象池
     * @param name 对象池名称
     */
    getNodePool(name: string): NodePool{
        if(!isValid(this._nodeMap.get(name))) {
            this._nodeMap.set(name,new NodePool());
        }
        return this._nodeMap.get(name);
    }

    /**
     * 添加节点至对象池
     * @param name 对象池名称
     * @param node 需要添加的节点
     */
    putNodePool(name: string,node: Node,count: number){
        for (let i = 0; i < count; i++) {
            let nodePool:NodePool = this.getNodePool(name);
            nodePool.put(node);
        }
    }

    /**
     * 从节点池获取节点
     * @param name 对象池名称
     * @returns 
     */
    getNodeFromPool(name: string): Node{
        return this._nodeMap.get(name).get();
    }
}

export const PoolMgr = PoolUtil.getInstance();
