export const loading = {
  // 初始化
  init() {
    if (document.querySelector(".transition-overlay")) {
    console.log("loading 已存在，跳过 bodyCreate");
    return;
    }
    this.bodyCreate();
  },
  // 创建加载动画DOM结构
  bodyCreate() {
    const body = document.querySelector("body");
    const transitionOverlay = document.createElement("div");
    transitionOverlay.className = "transition-overlay";
    const logoOverlay = document.createElement("div");
    logoOverlay.className = "logo-overlay";
    body.appendChild(transitionOverlay);
    body.appendChild(logoOverlay);
    if (window.innerWidth > 768) {
      for (let i = 0; i < 20; i++) {
        const block = document.createElement("div");
        block.className = "block";
        transitionOverlay.appendChild(block);
      }
    } else {
      for (let i = 0; i < 10; i++) {
        const block = document.createElement("div");
        block.className = "block";
        transitionOverlay.appendChild(block);
      }
    }

    const logContainer = document.createElement("div");
    logContainer.className = "logo-container";
    const svg = `
            <svg
          width="603"
          height="54"
          viewBox="0 0 603 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            class="loading-path"
            d="M23.5 12.68L1 52.18C11.8333 34.18 39.4 1.07996 63 12.68C64.1667 14.3467 64.2 20.4801 55 31.68C45.8 42.88 47.5 49.0134 49.5 50.68C51.8333 52.5134 69 49.18 88 29.68C83.5 41.0134 81.4 60.48 109 47.68C120.333 40.3467 141.4 23.0799 135 12.68C127 -0.319952 99 9.68004 88 28.18C96.8333 16.68 118.2 -2.52012 133 12.68C128.333 13.5133 120.6 19.28 127 35.68C136.333 42.8467 157.9 47.88 169.5 10.68C164.667 21.0134 153 43.6801 145 51.6801C158.333 33.5133 189.4 0.279892 207 12.68C208.667 14.0133 209.7 19.9801 200.5 33.1801C189 49.6801 190.5 60.6801 223 39.6801C234.333 30.0134 257.4 10.2801 259 8.68007C261 6.68007 262 2.68007 259 1.68007C256 0.680069 251.5 -4.31993 254 39.6801C253.333 45.6801 249.8 56.4802 241 51.6801C230 45.6799 251.5 27.1799 280.5 27.6799L283.5 24.1799C283.833 23.6799 283.7 22.3799 280.5 21.1799C292 27.8466 317.8 35.5799 325 15.1799C324.833 11.3466 321.1 4.37993 307.5 7.17993C290.5 10.6799 269.5 35.1799 278 49.1799C286.5 63.1799 334 38.1799 336.5 32.1799C340.667 26.3466 348.7 13.7799 347.5 10.1799C342 21.68 329.5 46.0802 323.5 51.6801C334.833 34.5134 363.4 2.57993 387 12.1799C389 13.6799 390.1 19.7799 378.5 32.1799C375.5 37.0133 370.4 47.3799 374 50.1799C378.5 53.6799 394 46.6799 409 32.1799C424 17.6799 447 6.67993 437.5 2.17993C428 -2.32007 434 36.6799 432 40.6799C431.833 45.0132 429.4 53.4798 421 52.6799C410.5 51.6801 419 29.1799 458 27.1799L462 23.6799C461.667 22.6799 460.4 20.7799 458 21.1799C470.833 27.6799 497.8 35.4799 503 14.6799C501.333 8.3466 493 -0.520068 473 14.6799C448 33.6799 455 47.1799 456.5 47.1799C458 47.1799 464.5 67.1799 515.5 32.1799H603"
            stroke="white"
            stroke-width="5"
          />
        </svg>`;
    logContainer.innerHTML = svg;
    logoOverlay.appendChild(logContainer);
    const path = document.querySelector(".loading-path");
    const length = path.getTotalLength();
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });
  },
  // 进入动画
  in() {
    const blocks = document.querySelectorAll(".block");
    const logo = document.querySelector(".logo-overlay");
    const path = document.querySelector(".loading-path");
    if (!blocks.length || !logo) {
      console.warn("loading.in: 目标元素不存在");
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const tl = gsap.timeline({ onComplete: resolve });
      tl.to(blocks, {
        scaleX: 1,
        duration: 0.5,
        ease: "power2.inOut",
        stagger: 0.03,
      })
        .to(
          logo,
          {
            opacity: 1,
            duration: 0.4,
            ease: "power2.inOut",
          },
          "-=0.2"
        )
        .to(
          path,
          {
            strokeDashoffset: 0,
            duration: 1,
            ease: "power2.inOut",
          },
          "-=0.2"
        );
    });
  },
  // 退出动画
  out() {
    const blocks = document.querySelectorAll(".block");
    const logo = document.querySelector(".logo-overlay");
    const pageContent = document.querySelector(".page-content");
    const path = document.querySelector(".loading-path");
    if (pageContent) pageContent.style.opacity = 0;
    const length = path.getTotalLength();
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: 0,
    });
    return new Promise((resolve) => {
      const tl = gsap.timeline({ onComplete: resolve });

      tl.to(path, {
        strokeDashoffset: length,
        duration: 0.5,
        ease: "power2.inOut",
      });
      tl.to(logo, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
      });

      tl.to(
        blocks,
        {
          scaleX: 0,
          duration: 1,
          ease: "power2.inOut",
          stagger: { each: 0.03, from: "start" },
        },
        "-=0.2"
      );

      // 同步显示页面内容
      if (pageContent) {
        tl.to(
          pageContent,
          {
            opacity: 1,
            duration: 0.5,
            ease: "power2.inOut",
          },
          "<"
        );
      }
    });
  },
};
