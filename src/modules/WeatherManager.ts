import { BaseComponent } from '../core';

/**
 * WeatherData - 天气数据接口
 * WeatherData - Weather data interface
 */
interface WeatherData {
    // 温度（摄氏度）
    // Temperature in Celsius
    temperature: number;

    // 天气描述（中文）
    // Weather description (Chinese)
    description: string;

    // 天气代码（用于图标）
    // Weather code (for icon)
    weatherCode: string;

    // 位置名称
    // Location name
    location: string;

    // 数据获取时间戳
    // Data fetch timestamp
    timestamp: number;
}

/**
 * WttrResponse - wttr.in API 响应结构（带中文支持）
 * WttrResponse - wttr.in API response structure (with Chinese support)
 */
interface WttrResponse {
    current_condition: Array<{
        temp_C: string;
        weatherDesc: Array<{ value: string }>;
        // 中文天气描述
        // Chinese weather description
        lang_zh: Array<{ value: string }>;
        weatherCode: string;
    }>;
    nearest_area: Array<{
        areaName: Array<{ value: string }>;
        country: Array<{ value: string }>;
    }>;
}

// 缓存键
// Cache key
const CACHE_KEY = 'weather_cache';

// 缓存过期时间（10 分钟）
// Cache expiry time (10 minutes)
const CACHE_EXPIRY_MS = 10 * 60 * 1000;

// 天气图标映射（完整版，基于 wttr.in weatherCode）
// Weather icon mapping (complete version, based on wttr.in weatherCode)
const WEATHER_ICONS: Record<string, string> = {
    // 晴天 / Sunny
    '113': '☀️',
    // 局部多云 / Partly cloudy
    '116': '⛅',
    // 多云 / Cloudy
    '119': '☁️',
    // 阴天 / Overcast
    '122': '☁️',
    // 雾 / Fog
    '143': '🌫️',
    '248': '🌫️',
    '260': '🌫️',
    // 小雨 / Light rain
    '176': '🌦️',
    '263': '🌦️',
    '266': '🌦️',
    '293': '🌦️',
    '296': '🌦️',
    '353': '🌦️',
    // 中雨/大雨 / Moderate/Heavy rain
    '299': '🌧️',
    '302': '🌧️',
    '305': '🌧️',
    '308': '🌧️',
    '356': '🌧️',
    '359': '🌧️',
    // 雨夹雪/冻雨 / Sleet/Freezing rain
    '179': '🌨️',
    '182': '🌨️',
    '185': '🌨️',
    '281': '🌨️',
    '284': '🌨️',
    '311': '🌨️',
    '314': '🌨️',
    '317': '🌨️',
    '362': '🌨️',
    '365': '🌨️',
    // 雪 / Snow
    '320': '❄️',
    '323': '❄️',
    '326': '❄️',
    '329': '❄️',
    '332': '❄️',
    '335': '❄️',
    '338': '❄️',
    '368': '❄️',
    '371': '❄️',
    // 冰雹 / Hail
    '350': '🧊',
    '374': '🧊',
    '377': '🧊',
    // 雷暴 / Thunderstorm
    '200': '⛈️',
    '386': '⛈️',
    '389': '⛈️',
    '392': '⛈️',
    '395': '⛈️',
    // 大风 / Wind
    '227': '💨',
    '230': '💨',
    // 默认 / Default
    default: '🌡️',
};

/**
 * WeatherManager - 天气模块管理器
 * WeatherManager - Weather module manager
 *
 * 性能策略：
 * Performance strategy:
 * 1. 首先从 localStorage 加载缓存数据立即显示
 * 1. First load cached data from localStorage for immediate display
 * 2. 然后在后台获取新数据更新视图
 * 2. Then fetch new data in background to update view
 */
export class WeatherManager extends BaseComponent {
    // 天气数据
    // Weather data
    private weatherData: WeatherData | null = null;

    // DOM 元素引用
    // DOM element references
    private iconEl: HTMLSpanElement | null = null;
    private tempEl: HTMLSpanElement | null = null;
    private locationEl: HTMLSpanElement | null = null;

    // 是否正在加载
    // Loading state
    private isLoading: boolean = false;

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
        this.rootEl = this.CreateElement('div', 'weather-widget');

        // 天气图标
        // Weather icon
        this.iconEl = this.CreateElement('span', 'weather-widget__icon');
        this.iconEl.textContent = WEATHER_ICONS.default;

        // 温度显示
        // Temperature display
        this.tempEl = this.CreateElement('span', 'weather-widget__temp');
        this.tempEl.textContent = '--°C';

        // 位置显示（初始为空，避免 Loading 文字闪烁）
        // Location display (empty initially to avoid Loading text flash)
        this.locationEl = this.CreateElement('span', 'weather-widget__location');
        this.locationEl.textContent = '';

        // 批量添加子元素
        // Batch append children
        this.BatchAppendChildren(this.rootEl, [
            this.iconEl,
            this.tempEl,
            this.locationEl,
        ]);
    }

    /**
     * 挂载组件并初始化数据
     * Mount component and initialize data
     */
    public override Mount(container: HTMLElement): void {
        super.Mount(container);
        this.Init();
    }

    /**
     * 初始化：加载缓存 → 后台更新
     * Initialize: load cache → background update
     */
    private async Init(): Promise<void> {
        // 步骤 1：尝试从缓存加载
        // Step 1: Try to load from cache
        const cached = this.LoadFromCache();

        if (cached) {
            // 使用缓存数据立即渲染
            // Use cached data for immediate render
            this.weatherData = cached;
            this.Render();

            // 检查缓存是否过期
            // Check if cache is expired
            const isExpired = Date.now() - cached.timestamp > CACHE_EXPIRY_MS;

            if (isExpired) {
                // 后台更新
                // Background update
                this.FetchData();
            }
        } else {
            // 无缓存，直接获取
            // No cache, fetch directly
            await this.FetchData();
        }
    }

    /**
     * 从 localStorage 加载缓存
     * Load cache from localStorage
     */
    private LoadFromCache(): WeatherData | null {
        try {
            const raw = localStorage.getItem(CACHE_KEY);
            if (!raw) return null;

            const data = JSON.parse(raw) as WeatherData;
            return data;
        } catch (error) {
            console.warn('[WeatherManager] Failed to load cache:', error);
            return null;
        }
    }

    /**
     * 保存数据到 localStorage
     * Save data to localStorage
     */
    private SaveToCache(data: WeatherData): void {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        } catch (error) {
            console.warn('[WeatherManager] Failed to save cache:', error);
        }
    }

    /**
     * 从 API 获取天气数据（两步策略）
     * Fetch weather data from API (two-step strategy)
     * 1. 使用 ipapi.co 获取用户 IP 定位的城市名
     * 1. Use ipapi.co to get user's city from IP geolocation
     * 2. 使用 wttr.in 获取该城市的天气
     * 2. Use wttr.in to get weather for that city
     */
    public async FetchData(): Promise<void> {
        if (this.isLoading) return;

        this.isLoading = true;

        try {
            // 步骤 1：获取用户城市（通过 IP 定位）
            // Step 1: Get user city (via IP geolocation)
            const city = await this.GetUserCity();
            console.log(`[WeatherManager] Detected city: ${city}`);

            // 步骤 2：使用城市名查询 wttr.in
            // Step 2: Query wttr.in with city name
            const weatherUrl = `https://wttr.in/${encodeURIComponent(city)}?format=j1&lang=zh`;
            const response = await fetch(weatherUrl);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = (await response.json()) as WttrResponse;

            // 解析响应数据
            // Parse response data
            const current = data.current_condition[0];
            const area = data.nearest_area[0];

            // 优先使用中文描述，若无则使用英文
            // Prefer Chinese description, fallback to English
            const description =
                current.lang_zh?.[0]?.value ||
                current.weatherDesc[0]?.value ||
                'Unknown';

            this.weatherData = {
                temperature: parseInt(current.temp_C, 10),
                description: description,
                weatherCode: current.weatherCode,
                location: area.areaName[0]?.value || city,
                timestamp: Date.now(),
            };

            // 保存到缓存
            // Save to cache
            this.SaveToCache(this.weatherData);

            // 更新视图
            // Update view
            this.Render();

            console.log('[WeatherManager] Weather loaded successfully:', this.weatherData.location);
        } catch (error) {
            console.error('[WeatherManager] Failed to fetch weather:', error);
            this.HandleError();
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * 获取用户城市（通过 IP 定位）
     * Get user city via IP geolocation
     * 使用 ipapi.co 免费 API
     * Uses ipapi.co free API
     * 返回格式：城市名, 国家代码（消除同名城市歧义）
     * Return format: city, country_code (to disambiguate same-named cities)
     */
    private async GetUserCity(): Promise<string> {
        // 优先从 localStorage 读取用户手动设置的城市
        // First check if user has manually set a city in localStorage
        const savedCity = localStorage.getItem('userCity');
        if (savedCity) {
            return savedCity;
        }

        try {
            // 使用 ipapi.co 获取 IP 定位
            // Use ipapi.co for IP geolocation
            const response = await fetch('https://ipapi.co/json/');

            if (!response.ok) {
                throw new Error(`IP API HTTP ${response.status}`);
            }

            const data = await response.json() as {
                city?: string;
                region?: string;
                country?: string;
                country_name?: string;
            };

            // 构建城市查询字符串，加上国家代码消歧义
            // Build city query string with country code to disambiguate
            const city = data.city || data.region || 'Shanghai';
            const country = data.country || '';

            // 返回 "城市, 国家代码" 格式，如 "George Town, MY"
            // Return "city, country_code" format, e.g. "George Town, MY"
            if (country) {
                return `${city}, ${country}`;
            }
            return city;
        } catch (error) {
            console.warn('[WeatherManager] IP geolocation failed, using default city:', error);
            // 默认城市
            // Default city
            return 'Shanghai, CN';
        }
    }

    /**
     * 处理错误情况
     * Handle error state
     */
    private HandleError(): void {
        if (this.iconEl) {
            this.iconEl.textContent = '❓';
        }
        if (this.tempEl) {
            this.tempEl.textContent = '--°C';
        }
        if (this.locationEl) {
            this.locationEl.textContent = 'Unavailable';
        }
    }

    /**
     * 渲染天气数据到 DOM
     * Render weather data to DOM
     */
    private Render(): void {
        if (!this.weatherData) return;

        // 更新图标
        // Update icon
        if (this.iconEl) {
            const icon =
                WEATHER_ICONS[this.weatherData.weatherCode] || WEATHER_ICONS.default;
            this.iconEl.textContent = icon;
        }

        // 更新温度
        // Update temperature
        if (this.tempEl) {
            this.tempEl.textContent = `${this.weatherData.temperature}°C`;
        }

        // 更新位置
        // Update location
        if (this.locationEl) {
            this.locationEl.textContent = this.weatherData.location;
        }
    }

    /**
     * 更新组件（刷新数据）
     * Update component (refresh data)
     */
    public override Update(): void {
        this.FetchData();
    }
}
