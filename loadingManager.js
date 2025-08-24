// 从 loading.js 模块中导入 loading 对象，用于执行具体的动画逻辑
import { loading } from "./loading.js";

// 定义 LoadingManager 类，管理页面转场动画的初始化与控制
class LoadingManager {
  constructor() {
    // 是否已经初始化过，避免重复初始化
    this.isInitialized = false;

    // 定义事件监听器列表，方便外部注册回调
    this.listeners = {
      outEnd: [], // out 动画完成的回调
      inEnd: [],  // in 动画完成的回调
    };
  }

  // 初始化方法，只会执行一次
  init() {
    if (this.isInitialized) return; // 如果已经初始化，直接返回
    this.isInitialized = true;

    console.log("LoadingManager 初始化...");

    // 初始化 loading，动态创建 overlay、logo、blocks 等 DOM
    loading.init();

    // 页面刚加载时执行 out 动画，让 overlay 消失
    this.out();

    // 给所有带 page-link 类的元素绑定点击事件
    document.querySelectorAll(".page-link").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault(); // 阻止默认跳转
        const target = el.dataset.url; // 获取目标页面 URL

        // 执行 in 动画（overlay 入场），动画完成后跳转页面
        this.in().then(() => {
          window.location.href = target;
        });
      });
    });

    // 监听浏览器前进/后退按钮（popstate），执行 out 动画
    window.addEventListener("popstate", () => {
      console.log("popstate → 执行 loading.out()");
      this.out();
    });

    // 监听 bfcache 页面恢复事件（页面从缓存恢复）
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) {
        console.log("pageshow(bfcache) → 执行 loading.out()");
        this.out();
      }
    });
  }

  // out 动画方法：执行 overlay 消失动画
  out() {
    // 调用 loading.out() 返回的 Promise
    return loading.out().then(() => {
      // 动画完成后，触发所有注册的 outEnd 回调
      this.listeners.outEnd.forEach((cb) => cb());
    });
  }

  // in 动画方法：执行 overlay 入场动画
  in() {
    // 调用 loading.in() 返回的 Promise
    return loading.in().then(() => {
      // 动画完成后，触发所有注册的 inEnd 回调
      this.listeners.inEnd.forEach((cb) => cb());
    });
  }

  // 注册 out 动画完成的回调
  onOutEnd(callback) {
    this.listeners.outEnd.push(callback);
  }

  // 注册 in 动画完成的回调
  onInEnd(callback) {
    this.listeners.inEnd.push(callback);
  }

  // 移除某个 out 动画完成的回调
  offOutEnd(callback) {
    this.listeners.outEnd = this.listeners.outEnd.filter((cb) => cb !== callback);
  }

  // 移除某个 in 动画完成的回调
  offInEnd(callback) {
    this.listeners.inEnd = this.listeners.inEnd.filter((cb) => cb !== callback);
  }
}

// 导出单例对象，页面中直接使用 loadingManager 即可
export const loadingManager = new LoadingManager();
