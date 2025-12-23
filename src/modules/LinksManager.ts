import { BaseComponent } from '../core';

/**
 * LinkItem - 链接项数据类型
 * LinkItem - Link item data type
 */
interface LinkItem {
    // 链接标签（用于 aria-label）
    // Link label (for aria-label)
    label: string;

    // 链接 URL
    // Link URL
    url: string;

    // SVG 图标字符串
    // SVG icon string
    icon: string;

    // 可选：图标颜色
    // Optional: icon color
    color?: string;
}

// 预定义 SVG 图标
// Predefined SVG icons
const ICONS = {
    // GitHub 图标
    // GitHub icon
    github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`,

    // Twitter/X 图标
    // Twitter/X icon
    twitter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,

    // Instagram 图标
    // Instagram icon
    instagram: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`,

    // Google 图标
    // Google icon
    google: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>`,

    // Email 图标
    // Email icon
    email: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`,

    // YouTube 图标
    // YouTube icon
    youtube: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,

    // 设置/显示器图标
    // Settings/Monitor icon
    monitor: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/></svg>`,
};

// 默认链接数据
// Default links data
const DEFAULT_LINKS: LinkItem[] = [
    { label: 'GitHub', url: 'https://github.com', icon: ICONS.github },
    { label: 'Twitter', url: 'https://twitter.com', icon: ICONS.twitter },
    { label: 'Instagram', url: 'https://instagram.com', icon: ICONS.instagram },
    { label: 'Google', url: 'https://google.com', icon: ICONS.google },
    { label: 'Email', url: 'mailto:', icon: ICONS.email },
    { label: 'YouTube', url: 'https://youtube.com', icon: ICONS.youtube },
    { label: 'Settings', url: '#settings', icon: ICONS.monitor },
];

/**
 * LinksManager - 快捷链接模块管理器
 * LinksManager - Quick links module manager
 */
export class LinksManager extends BaseComponent {
    // 链接数据
    // Links data
    private links: LinkItem[];

    constructor(links: LinkItem[] = DEFAULT_LINKS) {
        super();
        this.links = links;
        this.BuildDOM();
    }

    /**
     * 构建 DOM 结构
     * Build DOM structure
     */
    private BuildDOM(): void {
        // 创建根容器
        // Create root container
        this.rootEl = this.CreateElement('div', 'links-widget');

        // 创建链接容器
        // Create links container
        const linksContainer = this.CreateElement('div', 'links-widget__container');

        // 动态渲染链接
        // Dynamically render links
        const linkElements: HTMLElement[] = [];

        for (let i = 0; i < this.links.length; i++) {
            const v = this.links[i];
            const linkEl = this.CreateLinkElement(v);
            linkElements.push(linkEl);
        }

        // 批量添加链接
        // Batch append links
        this.BatchAppendChildren(linksContainer, linkElements);
        this.rootEl.appendChild(linksContainer);
    }

    /**
     * 创建单个链接元素
     * Create single link element
     */
    private CreateLinkElement(item: LinkItem): HTMLAnchorElement {
        const link = this.CreateElement('a', 'links-widget__link', {
            href: item.url,
            target: item.url.startsWith('http') ? '_blank' : '_self',
            rel: 'noopener noreferrer',
            'aria-label': item.label,
            title: item.label,
        });

        // 设置自定义颜色
        // Set custom color
        if (item.color) {
            link.style.setProperty('--link-color', item.color);
        }

        // 插入 SVG 图标
        // Insert SVG icon
        link.innerHTML = item.icon;

        return link;
    }

    /**
     * 添加链接
     * Add a link
     */
    public AddLink(item: LinkItem): void {
        this.links.push(item);

        // 如果已挂载，动态添加到 DOM
        // If mounted, dynamically add to DOM
        if (this.rootEl) {
            const container = this.rootEl.querySelector('.links-widget__container');
            if (container) {
                const linkEl = this.CreateLinkElement(item);
                container.appendChild(linkEl);
            }
        }
    }

    /**
     * 获取所有链接
     * Get all links
     */
    public GetLinks(): LinkItem[] {
        return [...this.links];
    }

    /**
     * 更新组件（无操作）
     * Update component (no-op)
     */
    public override Update(): void {
        // 链接组件无需定期更新
        // Links component doesn't need periodic updates
    }
}
