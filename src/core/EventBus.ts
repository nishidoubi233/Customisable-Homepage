/**
 * EventBus - 全局事件总线，用于组件间解耦通信
 * EventBus - Global event bus for decoupled inter-component communication
 */

// 事件处理函数类型
// Event handler function type
type EventHandler<T = unknown> = (data: T) => void;

// 事件订阅者映射
// Event subscribers map
interface EventSubscribers {
    [eventName: string]: EventHandler[];
}

class EventBusClass {
    // 订阅者存储
    // Subscribers storage
    private subscribers: EventSubscribers = {};

    /**
     * 订阅事件
     * Subscribe to an event
     * @param eventName - 事件名称
     * @param eventName - Event name
     * @param handler - 处理函数
     * @param handler - Handler function
     * @returns 取消订阅函数
     * @returns Unsubscribe function
     */
    public On<T = unknown>(
        eventName: string,
        handler: EventHandler<T>
    ): () => void {
        if (!this.subscribers[eventName]) {
            this.subscribers[eventName] = [];
        }

        this.subscribers[eventName].push(handler as EventHandler);

        // 返回取消订阅函数
        // Return unsubscribe function
        return () => {
            this.Off(eventName, handler);
        };
    }

    /**
     * 取消订阅事件
     * Unsubscribe from an event
     * @param eventName - 事件名称
     * @param eventName - Event name
     * @param handler - 要移除的处理函数
     * @param handler - Handler function to remove
     */
    public Off<T = unknown>(eventName: string, handler: EventHandler<T>): void {
        const handlers = this.subscribers[eventName];
        if (!handlers) return;

        const idx = handlers.indexOf(handler as EventHandler);
        if (idx !== -1) {
            handlers.splice(idx, 1);
        }
    }

    /**
     * 触发事件
     * Emit an event
     * @param eventName - 事件名称
     * @param eventName - Event name
     * @param data - 事件数据
     * @param data - Event data
     */
    public Emit<T = unknown>(eventName: string, data?: T): void {
        const handlers = this.subscribers[eventName];
        if (!handlers) return;

        for (let i = 0; i < handlers.length; i++) {
            try {
                handlers[i](data);
            } catch (error) {
                console.error(
                    `[EventBus] Error in handler for event "${eventName}":`,
                    error
                );
            }
        }
    }

    /**
     * 清除所有订阅
     * Clear all subscriptions
     */
    public Clear(): void {
        this.subscribers = {};
    }
}

// 导出单例实例
// Export singleton instance
export const EventBus = new EventBusClass();
