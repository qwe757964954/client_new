import { Layers, Node } from "cc";

export namespace NodeUtil{
    /**
     * 定义一个递归函数，用于遍历节点及其所有子节点并设置图层
     * @param node 
     * @param layer 
     * 
     * // 在实例化角色后，调用递归函数设置图层
let role = instantiate(this.roleModel);
console.log("initRolePlayer_________", role);
this.role_node.addChild(role);
NodeUtil.setLayerRecursively(role,Layers.Enum.UI_2D);
     */
    export function setLayerRecursively(node: Node, layer: Layers.Enum): void {
        // 设置当前节点的图层
        node.layer = layer;
        // 遍历当前节点的所有子节点，并递归调用本函数
        for (let i = 0; i < node.children.length; i++) {
            let child = node.children[i];
            setLayerRecursively(child, layer);
        }
    }
}