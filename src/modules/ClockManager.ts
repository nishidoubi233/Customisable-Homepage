import { BaseComponent } from '../core';

/**
 * ClockManager - 时钟模块管理器
 * ClockManager - Clock module manager
 *
 * 使用 requestAnimationFrame 代替 setInterval
 * Uses requestAnimationFrame instead of setInterval
 * - 更流畅的更新
 * - Smoother updates
 * - 标签页不活动时自动暂停节省电量
 * - Auto-pauses when tab is inactive to save battery
 */
export class ClockManager extends BaseComponent {
    // DOM 元素引用
    // DOM element references
    private timeEl: HTMLSpanElement | null = null;
    private dateEl: HTMLSpanElement | null = null;

    // requestAnimationFrame ID
    // requestAnimationFrame ID
    private animationFrameId: number | null = null;

    // 上次更新的分钟数（避免重复渲染）
    // Last updated minute (to avoid redundant renders)
    private lastMinute: number = -1;

    constructor() {
        super();
        this.BuildDOM();
    }

    /**
     * 构建 DOM 结构
     * Build DOM structure
     */
    private BuildDOM(): void {
        // 创建根容器
        // Create root container
        this.rootEl = this.CreateElement('div', 'clock-widget');

        // 时间显示（大）
        // Time display (large)
        this.timeEl = this.CreateElement('div', 'clock-widget__time');
        this.timeEl.textContent = '--:--';

        // 日期显示（小）
        // Date display (small)
        this.dateEl = this.CreateElement('div', 'clock-widget__date');
        this.dateEl.textContent = '';

        // 批量添加子元素
        // Batch append children
        this.BatchAppendChildren(this.rootEl, [this.timeEl, this.dateEl]);
    }

    /**
     * 挂载组件并启动时钟
     * Mount component and start clock
     */
    public override Mount(container: HTMLElement): void {
        super.Mount(container);
        this.StartClock();
    }

    /**
     * 启动时钟更新循环
     * Start clock update loop
     */
    private StartClock(): void {
        // 立即渲染一次
        // Render immediately once
        this.RenderTime();

        // 使用 requestAnimationFrame 循环
        // Use requestAnimationFrame loop
        const tick = (): void => {
            this.RenderTime();
            this.animationFrameId = requestAnimationFrame(tick);
        };

        this.animationFrameId = requestAnimationFrame(tick);
    }

    /**
     * 渲染当前时间
     * Render current time
     */
    private RenderTime(): void {
        const now = new Date();
        const currentMinute = now.getMinutes();

        // 只在分钟数变化时更新（避免每帧都更新 DOM）
        // Only update when minute changes (avoid updating DOM every frame)
        if (currentMinute === this.lastMinute) {
            return;
        }
        this.lastMinute = currentMinute;

        // 格式化时间 HH:MM
        // Format time HH:MM
        const hours = this.PadZero(now.getHours());
        const minutes = this.PadZero(now.getMinutes());

        if (this.timeEl) {
            this.timeEl.textContent = `${hours}:${minutes}`;
        }

        // 格式化日期
        // Format date
        if (this.dateEl) {
            const options: Intl.DateTimeFormatOptions = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            };
            this.dateEl.textContent = now.toLocaleDateString('zh-CN', options);
        }
    }

    /**
     * 数字补零
     * Pad number with leading zero
     */
    private PadZero(num: number): string {
        return num < 10 ? `0${num}` : `${num}`;
    }

    /**
     * 更新组件
     * Update component
     */
    public override Update(): void {
        this.RenderTime();
    }

    /**
     * 销毁组件并停止时钟
     * Destroy component and stop clock
     */
    public override Destroy(): void {
        // 取消 requestAnimationFrame
        // Cancel requestAnimationFrame
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        super.Destroy();
    }
}
