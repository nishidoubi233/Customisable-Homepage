import { IComponent, ComponentState } from './IComponent';

/**
 * BaseComponent - 抽象基类，提供通用 DOM 操作辅助方法
 * BaseComponent - Abstract base class providing common DOM manipulation helpers
 */
export abstract class BaseComponent implements IComponent {
    // 组件根元素
    // Component root element
    protected rootEl: HTMLElement | null = null;

    // 组件当前状态
    // Component current state
    protected state: ComponentState = ComponentState.CREATED;

    // 事件监听器清理函数列表
    // List of event listener cleanup functions
    protected eventCleanups: (() => void)[] = [];

    /**
     * 创建 DOM 元素
     * Create a DOM element
     * @param tag - HTML 标签名
     * @param tag - HTML tag name
     * @param className - CSS 类名（可选）
     * @param className - CSS class name (optional)
     * @param attributes - 属性对象（可选）
     * @param attributes - Attributes object (optional)
     */
    protected CreateElement<K extends keyof HTMLElementTagNameMap>(
        tag: K,
        className?: string,
        attributes?: Record<string, string>
    ): HTMLElementTagNameMap[K] {
        const el = document.createElement(tag);

        if (className) {
            el.className = className;
        }

        if (attributes) {
            for (const key in attributes) {
                el.setAttribute(key, attributes[key]);
            }
        }

        return el;
    }

    /**
     * 安全地查询 DOM 元素
     * Safely query a DOM element
     * @param selector - CSS 选择器
     * @param selector - CSS selector
     * @param parent - 父元素（默认 document）
     * @param parent - Parent element (default: document)
     */
    protected QuerySelector<T extends HTMLElement>(
        selector: string,
        parent: ParentNode = document
    ): T | null {
        return parent.querySelector<T>(selector);
    }

    /**
     * 添加事件监听器（自动追踪以便销毁时清理）
     * Add event listener (automatically tracked for cleanup on destroy)
     * @param target - 目标元素
     * @param target - Target element
     * @param event - 事件类型
     * @param event - Event type
     * @param handler - 处理函数
     * @param handler - Handler function
     * @param options - 事件选项（可选）
     * @param options - Event options (optional)
     */
    protected AddEventListener<K extends keyof HTMLElementEventMap>(
        target: HTMLElement | Window | Document,
        event: K,
        handler: (ev: HTMLElementEventMap[K]) => void,
        options?: AddEventListenerOptions
    ): void {
        target.addEventListener(event, handler as EventListener, options);

        // 记录清理函数
        // Record cleanup function
        this.eventCleanups.push(() => {
            target.removeEventListener(event, handler as EventListener, options);
        });
    }

    /**
     * 使用 DocumentFragment 批量添加子元素（避免布局抖动）
     * Batch append children using DocumentFragment (avoid layout thrashing)
     * @param parent - 父元素
     * @param parent - Parent element
     * @param children - 子元素数组
     * @param children - Array of child elements
     */
    protected BatchAppendChildren(
        parent: HTMLElement,
        children: HTMLElement[]
    ): void {
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < children.length; i++) {
            fragment.appendChild(children[i]);
        }

        parent.appendChild(fragment);
    }

    /**
     * 挂载组件到容器
     * Mount component to container
     * @param container - 目标容器
     * @param container - Target container
     */
    public Mount(container: HTMLElement): void {
        if (this.state === ComponentState.DESTROYED) {
            console.warn('[BaseComponent] Cannot mount a destroyed component.');
            return;
        }

        // 子类需要在调用 super.Mount() 之前设置 rootEl
        // Subclasses should set rootEl before calling super.Mount()
        if (this.rootEl) {
            container.appendChild(this.rootEl);
            this.state = ComponentState.MOUNTED;
        }
    }

    /**
     * 更新组件（子类实现具体逻辑）
     * Update component (subclasses implement specific logic)
     */
    public abstract Update(): void;

    /**
     * 销毁组件并清理资源
     * Destroy component and cleanup resources
     */
    public Destroy(): void {
        // 清理所有事件监听器
        // Cleanup all event listeners
        for (let i = 0; i < this.eventCleanups.length; i++) {
            this.eventCleanups[i]();
        }
        this.eventCleanups = [];

        // 从 DOM 中移除
        // Remove from DOM
        if (this.rootEl && this.rootEl.parentNode) {
            this.rootEl.parentNode.removeChild(this.rootEl);
        }

        this.rootEl = null;
        this.state = ComponentState.DESTROYED;
    }

    /**
     * 获取组件当前状态
     * Get component current state
     */
    public GetState(): ComponentState {
        return this.state;
    }
}
