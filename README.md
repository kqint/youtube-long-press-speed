# YouTube 右方向键长按倍速播放

这是一个 Tampermonkey (油猴) 脚本（代码使用 AI 生成），让 YouTube 网页版拥有和 Bilibili 网页版一致的视频倍速播放体验。

## 核心功能

重构了 YouTube 网页版 **右方向键 (`→`)** 的原始逻辑，改为：

- **短按 (< 0.25s)**：触发精准快进 **5 秒**。
- **长按 (> 0.25s)**：立即进入 **3.0x 倍速**（松手即恢复原速）。
- **全态支持**：无论视频处于播放还是暂停状态，均可直接触发对应的交互。

## 视觉反馈

- 短按提示：`+ 5s`
- 长按提示：`>>> 倍速播放中 (3x)`

## 个性化配置

脚本头部内置了 `CONFIG` 对象，你可以根据喜好轻松修改参数：

```javascript
const CONFIG = {
    // 长按倍速：默认 3.0 倍速
    LONG_PRESS_SPEED: 3.0,

    // 短按快进：默认 5秒
    SEEK_SECONDS: 5,

    // 长按灵敏度：默认 250ms。数值越小，触发加速越快
    PRESS_THRESHOLD: 250,

    // UI 位置：距离顶部的距离 (支持 % 或 px)
    TIP_TOP_POSITION: '5%',

    // UI 颜色：默认黑色半透明
    COLOR_UI: 'rgba(0, 0, 0, 0.7)'
};
```

## 安装指南

### 方法一：通过 GreasyFork 一键安装（推荐）

1. 访问 GreasyFork 脚本页面：
   [youtube-右方向键长按倍速播放](https://greasyfork.org/zh-CN/scripts/565146-youtube-%E5%8F%B3%E6%96%B9%E5%90%91%E9%94%AE%E9%95%BF%E6%8C%89%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE)
2. 点击页面上的「安装此脚本」绿色按钮。
3. Tampermonkey 会自动弹出安装确认窗口，点击「安装」即可。

### 方法二：手动安装

1. 安装浏览器扩展 **Tampermonkey** (Chrome / Edge / Firefox / Safari)。
2. 点击扩展图标 ->「添加新脚本」。
3. 删除编辑器内所有默认代码。
4. 将 [youtube-long-press-speed.user.js](https://github.com/kqint/youtube-long-press-speed/blob/master/youtube-long-press-speed.user.js) 中的脚本代码完整粘贴进去。
5. 按 `Ctrl + S` 保存即可生效。

## 许可证

基于 **[MIT License](https://github.com/kqint/youtube-long-press-speed/blob/master/LICENSE)** 开源。