import './styles/index.css';
import { IComponent, EventBus } from './core';
import { WeatherManager } from './modules';

/**
 * AppManager - 应用程序管理器，负责初始化和协调所有组件
 * AppManager - Application manager responsible for initializing and coordinating all components
 */
class AppManager {
    // 已注册的组件列表
    // List of registered components
    private components: IComponent[] = [];

    // 应用根容器
    // Application root container
    private readonly APP_CONTAINER_EL: HTMLElement;

    constructor() {
        // 获取应用容器
        // Get application container
        const container = document.getElementById('app');
        if (!container) {
            throw new Error('[AppManager] #app container not found in DOM');
        }
        this.APP_CONTAINER_EL = container;
    }

    /**
     * 注册组件
     * Register a component
     * @param component - 要注册的组件
     * @param component - Component to register
     */
    public RegisterComponent(component: IComponent): void {
        this.components.push(component);
    }

    /**
     * 初始化所有组件
     * Initialize all components
     */
    public async Init(): Promise<void> {
        console.log('[AppManager] Initializing application...');

        // 挂载所有组件
        // Mount all components
        for (let i = 0; i < this.components.length; i++) {
            const v = this.components[i];
            v.Mount(this.APP_CONTAINER_EL);
        }

        console.log(
            `[AppManager] ${this.components.length} components initialized.`
        );

        // 发布应用就绪事件
        // Emit application ready event
        EventBus.Emit('app:ready');
    }

    /**
     * 销毁所有组件并清理
     * Destroy all components and cleanup
     */
    public Destroy(): void {
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].Destroy();
        }
        this.components = [];
        EventBus.Clear();
        console.log('[AppManager] Application destroyed.');
    }
}

// 应用入口
// Application entry point
document.addEventListener('DOMContentLoaded', () => {
    const app = new AppManager();

    // 注册天气组件
    // Register weather component
    app.RegisterComponent(new WeatherManager());

    // TODO: 后续添加更多组件
    // TODO: Add more components later
    // app.RegisterComponent(new ClockComponent());
    // app.RegisterComponent(new SearchComponent());
    // app.RegisterComponent(new LinksComponent());

    app.Init().catch((error) => {
        console.error('[AppManager] Initialization failed:', error);
    });

    // 开发模式：暴露到全局以便调试
    // Development mode: expose to global for debugging
    if (import.meta.env.DEV) {
        (window as unknown as { __app: AppManager }).__app = app;
    }
});
