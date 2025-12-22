// 组件接口定义
// Component interface definition

/**
 * IComponent - 所有 UI 组件必须实现的接口
 * IComponent - Interface that all UI components must implement
 */
export interface IComponent {
    /**
     * 将组件挂载到指定的 DOM 容器
     * Mount the component to the specified DOM container
     * @param container - 目标容器元素
     * @param container - Target container element
     */
    Mount(container: HTMLElement): void;

    /**
     * 更新组件的数据和视图
     * Update the component's data and view
     */
    Update(): void;

    /**
     * 销毁组件并清理事件监听器
     * Destroy the component and cleanup event listeners
     */
    Destroy(): void;
}

/**
 * ComponentState - 组件生命周期状态
 * ComponentState - Component lifecycle states
 */
export enum ComponentState {
    // 未初始化
    // Not initialized
    CREATED = 'created',

    // 已挂载到 DOM
    // Mounted to DOM
    MOUNTED = 'mounted',

    // 已销毁
    // Destroyed
    DESTROYED = 'destroyed',
}
