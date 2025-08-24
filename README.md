# 百叶窗转场动画

## 项目简介
这是一个纯前端静态项目，实现了 **页面之间的动态转场动画**，核心效果类似“百叶窗”展开与收起。项目使用 **原生 ES Modules** 和 **GSAP** 来实现动画，支持在多个 HTML 页面间平滑跳转，并提供可扩展的回调机制。

---

## 核心模块

### 1. `loading.js`
- 负责创建动画 DOM，包括：
  - `transition-overlay` 百叶窗块
  - `logo-overlay` 中心 logo SVG
- 提供三个方法：
  - `init()`：初始化动画 DOM
  - `in()`：播放进入动画
  - `out()`：播放退出动画
- 内部使用 GSAP 控制百叶窗块和 SVG 路径的动画效果。

### 2. `loadingManager.js`
`LoadingManager` 是对 `loading.js` 的封装，用于管理页面间的动画逻辑和回调。

#### 核心方法
- `init()`  
  - 初始化 LoadingManager，仅执行一次  
  - 自动调用 `loading.init()` 和 `out()`  
  - 为所有 `.page-link` 链接添加点击监听，触发 `in()` 动画后再跳转页面  
  - 监听浏览器 `popstate` 和 `pageshow` 事件，保证返回历史页面时动画正确执行

- `out()`  
  - 调用 `loading.out()` 播放退出动画  
  - 执行注册在 `outEnd` 的回调函数

- `in()`  
  - 调用 `loading.in()` 播放进入动画  
  - 执行注册在 `inEnd` 的回调函数

#### 回调接口示例

```javascript
// 注册回调
loadingManager.onOutEnd(() => {
  console.log("退出动画完成，执行额外逻辑");
});
loadingManager.onInEnd(() => {
  console.log("进入动画完成，执行额外逻辑");
});

// 注销回调
loadingManager.offOutEnd(callbackFunction);
loadingManager.offInEnd(callbackFunction);
```
#### 引入模块
```
<script type="module">
import { loadingManager } from "./loadingManager.js";

document.addEventListener("DOMContentLoaded", () => {
    loadingManager.init();
});
</script>
```
#### 页面跳转
```
<p class="page-link" data-url="./page2.html"></p>
```
#### 可选回调
```
loadingManager.onOutEnd(() => { /* 退出动画完成逻辑 */ });
loadingManager.onInEnd(() => { /* 进入动画完成逻辑 */ });
```
#### 演示

![百叶窗动画示意](./animation.gif)
