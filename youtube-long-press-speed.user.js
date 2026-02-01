// ==UserScript==
// @name         YouTube 右方向键长按倍速播放
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  接管右方向键：短按快进，长按倍速播放，暂停时操作自动播放
// @author       kqint
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // --- ⚙️ 用户配置区 ---
    const CONFIG = {
        LONG_PRESS_SPEED: 3.0,          // 长按倍速
        SEEK_SECONDS: 5,                // 短按快进秒数
        PRESS_THRESHOLD: 250,           // 长按判定阈值 (毫秒)

        // UI 位置与颜色
        TIP_TOP_POSITION: '5%',         // 提示框距离顶部的位置 (越小越靠上)
        COLOR_UI: 'rgba(0, 0, 0, 0.7)'  // 统一黑色半透明背景
    };

    // --- 内部变量 ---
    let video = null;
    let longPressTimer = null;
    let isLongPressActive = false;
    let isKeyDown = false;
    let tipDiv = null;

    // --- 核心工具函数：创建并显示提示 ---
    function showTip(text, autoHideDelay = 0) {
        if (!tipDiv) {
            tipDiv = document.createElement('div');
            tipDiv.style.cssText = `
                position: absolute;
                top: ${CONFIG.TIP_TOP_POSITION}; /* 动态应用位置 */
                left: 50%;
                transform: translateX(-50%);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 16px;
                font-family: Roboto, Arial, sans-serif;
                font-weight: bold;
                pointer-events: none;
                z-index: 9999;
                transition: opacity 0.2s ease;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            `;
            const container = document.querySelector('.html5-video-player') || document.body;
            container.appendChild(tipDiv);
        }

        tipDiv.innerText = text;
        tipDiv.style.background = CONFIG.COLOR_UI;
        tipDiv.style.opacity = '1';
        tipDiv.style.display = 'block';

        if (autoHideDelay > 0) {
            setTimeout(() => {
                if (tipDiv.innerText === text) {
                    tipDiv.style.opacity = '0';
                }
            }, autoHideDelay);
        }
    }

    function hideTip() {
        if (tipDiv) tipDiv.style.opacity = '0';
    }

    const getVideo = () => document.querySelector('video');

    // --- 按键监听逻辑 ---
    document.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA', 'CONTENTEDITABLE'].includes(e.target.tagName)) return;

        if (e.key === 'ArrowRight') {
            e.stopImmediatePropagation();
            e.preventDefault();

            if (isKeyDown) return;
            isKeyDown = true;
            isLongPressActive = false;

            video = getVideo();
            if (!video) return;

            longPressTimer = setTimeout(() => {
                isLongPressActive = true;

                // 🚀 长按逻辑：加速 + 强制播放
                video.playbackRate = CONFIG.LONG_PRESS_SPEED;
                video.play();

                showTip(`>>> 倍速播放中 (${CONFIG.LONG_PRESS_SPEED}x)`);
            }, CONFIG.PRESS_THRESHOLD);
        }
    }, true);

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowRight' && isKeyDown) {
            e.stopImmediatePropagation();
            e.preventDefault();

            isKeyDown = false;
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }

            video = getVideo();
            if (!video) return;

            if (isLongPressActive) {
                // 长按结束：恢复 1倍速，保持播放状态
                video.playbackRate = 1.0;
                hideTip();
            } else {
                // ⏩ 短按逻辑：快进 + 强制播放
                video.currentTime += CONFIG.SEEK_SECONDS;
                video.play();

                showTip(`+ ${CONFIG.SEEK_SECONDS}s`, 600);
            }

            isLongPressActive = false;
        }
    }, true);
})();