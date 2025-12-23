import { BaseComponent } from '../core';

/**
 * SearchManager - 搜索模块管理器
 * SearchManager - Search module manager
 *
 * 功能：
 * Features:
 * - 中心位置的搜索输入框
 * - Centered search input field
 * - 玻璃拟态效果
 * - Glassmorphism effect
 * - 回车键触发搜索
 * - Enter key triggers search
 * - 可配置的搜索引擎
 * - Configurable search engine
 */
export class SearchManager extends BaseComponent {
    // 搜索引擎 URL（可配置）
    // Search engine URL (configurable)
    private searchEngineUrl: string = 'https://www.google.com/search?q=';

    // DOM 元素引用
    // DOM element references
    private SEARCH_INPUT_EL: HTMLInputElement | null = null;

    // 搜索引擎配置
    // Search engine configurations
    private static readonly SEARCH_ENGINES: Record<string, string> = {
        google: 'https://www.google.com/search?q=',
        bing: 'https://www.bing.com/search?q=',
        duckduckgo: 'https://duckduckgo.com/?q=',
        baidu: 'https://www.baidu.com/s?wd=',
    };

    constructor(engine: string = 'google') {
        super();
        this.SetSearchEngine(engine);
        this.BuildDOM();
    }

    /**
     * 设置搜索引擎
     * Set search engine
     */
    public SetSearchEngine(engine: string): void {
        const url = SearchManager.SEARCH_ENGINES[engine.toLowerCase()];
        if (url) {
            this.searchEngineUrl = url;
        }
    }

    /**
     * 构建 DOM 结构
     * Build DOM structure
     */
    private BuildDOM(): void {
        // 创建根容器
        // Create root container
        this.rootEl = this.CreateElement('div', 'search-widget');

        // 搜索图标
        // Search icon
        const iconEl = this.CreateElement('span', 'search-widget__icon');
        iconEl.textContent = '🔍';

        // 搜索输入框
        // Search input field
        this.SEARCH_INPUT_EL = this.CreateElement('input', 'search-widget__input', {
            type: 'text',
            placeholder: 'Search...',
            autocomplete: 'off',
            spellcheck: 'false',
        });

        // 批量添加子元素
        // Batch append children
        this.BatchAppendChildren(this.rootEl, [iconEl, this.SEARCH_INPUT_EL]);

        // 绑定事件
        // Bind events
        this.BindEvents();
    }

    /**
     * 绑定事件监听器
     * Bind event listeners
     */
    private BindEvents(): void {
        if (!this.SEARCH_INPUT_EL) return;

        // 回车键搜索
        // Enter key to search
        this.AddEventListener(this.SEARCH_INPUT_EL, 'keydown', (ev: KeyboardEvent) => {
            if (ev.key === 'Enter') {
                this.HandleSearch();
            }
        });

        // 聚焦时添加样式
        // Add style on focus
        this.AddEventListener(this.SEARCH_INPUT_EL, 'focus', () => {
            this.rootEl?.classList.add('search-widget--focused');
        });

        // 失焦时移除样式
        // Remove style on blur
        this.AddEventListener(this.SEARCH_INPUT_EL, 'blur', () => {
            this.rootEl?.classList.remove('search-widget--focused');
        });
    }

    /**
     * 挂载组件
     * Mount component
     */
    public override Mount(container: HTMLElement): void {
        super.Mount(container);

        // 延迟自动聚焦，避免布局偏移
        // Delayed auto-focus to avoid layout shift
        requestAnimationFrame(() => {
            this.SEARCH_INPUT_EL?.focus();
        });
    }

    /**
     * 处理搜索
     * Handle search
     */
    private HandleSearch(): void {
        if (!this.SEARCH_INPUT_EL) return;

        const query = this.SEARCH_INPUT_EL.value.trim();
        if (!query) return;

        // 构建搜索 URL 并跳转
        // Build search URL and navigate
        const searchUrl = `${this.searchEngineUrl}${encodeURIComponent(query)}`;
        window.open(searchUrl, '_blank');

        // 清空输入框
        // Clear input field
        this.SEARCH_INPUT_EL.value = '';
    }

    /**
     * 获取当前搜索查询
     * Get current search query
     */
    public GetQuery(): string {
        return this.SEARCH_INPUT_EL?.value.trim() || '';
    }

    /**
     * 更新组件（无操作）
     * Update component (no-op)
     */
    public override Update(): void {
        // 搜索组件无需定期更新
        // Search component doesn't need periodic updates
    }
}
