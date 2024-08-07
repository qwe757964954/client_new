import { Node, NodePool, _decorator, isValid } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PoolUtil')
export class PoolUtil {
    private static _instance: PoolUtil = null;
    private _nodeMap: Map<string, NodePool> = new Map();

    public static getInstance(): PoolUtil {
        if (!this._instance) {
            this._instance = new PoolUtil();
        }
        return this._instance;
    }

    /** 
     * Create or get a node pool by name
     * @param name Pool name
     * @returns NodePool
     */
    getNodePool(name: string): NodePool {
        if (!this._nodeMap.has(name) || !isValid(this._nodeMap.get(name))) {
            this._nodeMap.set(name, new NodePool());
        }
        return this._nodeMap.get(name);
    }

    /**
     * Add nodes to the pool
     * @param name Pool name
     * @param nodes Nodes to add
     */
    putNodesInPool(name: string, nodes: Node[]) {
        let nodePool = this.getNodePool(name);
        nodes.forEach(node => {
            // Optionally reset node state here
            nodePool.put(node);
        });
    }

    /**
     * Get a node from the pool
     * @param name Pool name
     * @returns Node
     */
    getNodeFromPool(name: string): Node {
        return this.getNodePool(name).get();
    }

    /**
     * Recycle nodes back to their respective pools
     * @param name Pool name
     * @param nodes Nodes to recycle
     */
    recycleNodes(name: string, nodes: Node[]) {
        let nodePool = this.getNodePool(name);
        nodes.forEach(node => {
            // Optionally reset node state here
            if (isValid(node)) {
                nodePool.put(node);
            }
        });
    }
}

export const PoolMgr = PoolUtil.getInstance();
