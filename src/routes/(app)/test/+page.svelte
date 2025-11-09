<script>
  import { Banana } from '@lucide/svelte';
</script>

<div class="demo-section">
  <div class="demo-title">HOVER TO PREVIEW ANNOTATION</div>

  <div class="icon-row">
    <!-- Light background -->
    <div class="icon-wrapper">
      <div class="icon-container">
        <div class="image-icon">
          <div class="sun"></div>
          <div class="mountain-back"></div>
          <div class="mountain-front"></div>
          <div class="scan-bar"></div>
          <div class="label label-1"></div>
          <div class="label label-2"></div>
          <div class="label label-3"></div>
        </div>
      </div>
      <div class="size-label">LIGHT THEME</div>
    </div>

    <!-- Dark background -->
    <div class="icon-wrapper dark-bg">
      <div class="icon-container">
        <div class="image-icon">
          <div class="sun"></div>
          <div class="mountain-back"></div>
          <div class="mountain-front"></div>
          <div class="scan-bar"></div>
          <div class="label label-1"></div>
          <div class="label label-2"></div>
          <div class="label label-3"></div>
        </div>
      </div>
      <div class="size-label">DARK THEME</div>
    </div>
  </div>
</div>

<div class="mt-20 bg-background">
  <!-- <svg
    version="1.0"
    xmlns="http://www.w3.org/2000/svg"
    width="100pt"
    height="100pt"
    viewBox="0 0 288.0 288.0"
    preserveAspectRatio="xMidYMid meet"
  >
    <g transform="matrix(0.1, 0, 0, -0.1, -17.042952, 308.766937)" fill="#000000" stroke="none">
      <path
        d="M 585 2495 C 569 2488 548 2479 540 2475 C 479 2451 409 2381 385 2320 C 381 2312 372 2290 364 2272 C 343 2223 343 625 364 583 C 372 568 382 548 385 540 C 408 480 479 409 540 385 C 548 381 570 372 588 364 C 615 352 751 350 1430 350 C 2282 350 2258 349 2330 391 C 2338 396 2354 404 2365 409 C 2396 423 2457 495 2475 540 C 2479 548 2488 570 2496 588 C 2517 637 2517 2223 2496 2272 C 2488 2290 2479 2312 2475 2320 C 2451 2381 2380 2452 2320 2475 C 2312 2478 2292 2488 2277 2496 C 2236 2516 631 2516 585 2495 Z M 476.201 2216.422 L 505 2276 C 539 2330 592 2365 662 2380 C 686 2384 1043 2388 1455 2387 C 2192 2385 2206 2385 2250 2364 C 2303 2339 2353 2286 2371 2233 C 2382 2203 2385 2063 2385 1523 C 2385 1154 2382 849 2379 845 C 2375 842 2267 945 2139 1075 C 1898 1319 1808 1399 1746 1425 C 1662 1460 1572 1432 1484 1345 C 1423 1284 1390 1225 1390 1175 C 1390 1156 1386 1140 1381 1140 C 1375 1140 1322 1184 1263 1238 C 1065 1416 1029 1440 947 1440 C 868 1440 809 1400 647 1238 C 566 1157 495 1090 490 1090 C 471 1090 457.173 1169 460.173 1691 L 464.592 2115.942 M 479.908 822.432 C 476.043 871.331 480.007 915.575 509.8 958.598 L 729 1165 C 806 1241 881 1311 897 1321 C 933 1345 965 1345 1004 1321 C 1021 1310 1140 1195 1268 1066 L 1462.096 905.625 L 1542.269 856.606 C 1581.029 831.055 1601.7 817.271 1635.095 839.507 C 1677.819 867.955 1665.368 880.907 1659.574 900.24 C 1647.23 941.43 1617.299 956.337 1568.299 1006.337 C 1539.299 1036.337 1504.673 1066.821 1492.587 1095.63 C 1476.149 1134.813 1480 1185 1482 1192 C 1487 1214 1619 1329 1646 1336 C 1659 1339 1682 1339 1697 1335 C 1715 1331 1824 1230 1996 1062 L 2267 795 L 2374.189 695.113 C 2375.189 626.113 2368.877 622.723 2362.95 595.031 C 2344.887 510.639 2290.118 483.178 2203.687 479.403 L 1415.406 473.697 L 730.973 482.401 C 562.255 484.747 547.214 502.077 500.875 584.274 C 489.045 632.455 479.908 634.432 479.908 822.432 Z"
      ></path>

      <circle
        cx="1960"
        cy="1850"
        r="220"
        fill="none"
        stroke="currentColor"
        stroke-miterlimit="10"
        stroke-width="100"
      />
    </g>
  </svg> -->

  <Banana size={52} />
</div>

<style>
  .icon-container {
    position: relative;
    width: 48px;
    height: 48px;
    cursor: pointer;
  }

  .image-icon {
    width: 100%;
    height: 100%;
    border: 2px solid #1a1a1a;
    border-radius: 4px;
    background: #ffffff;
    position: relative;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  /* Simple geometric shapes for image representation */
  .mountain-back {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 0;
    border-left: 24px solid transparent;
    border-right: 24px solid transparent;
    border-bottom: 18px solid #e5e5e5;
  }

  .mountain-front {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-bottom: 14px solid #d4d4d4;
  }

  .sun {
    position: absolute;
    width: 8px;
    height: 8px;
    background: #a3a3a3;
    border-radius: 50%;
    top: 10px;
    right: 10px;
  }

  /* Scanning bar */
  .scan-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #1a1a1a, transparent);
    transform: translateY(-10px);
    opacity: 0;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  }

  /* Label boxes */
  .label {
    position: absolute;
    border: 0.5px solid #1a1a1a;
    border-radius: 0.2rem;
    background: rgba(0, 0, 0, 0.05);
    opacity: 0;
    transform: scale(0.8);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    /* box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); */
  }

  .label-1 {
    top: 8px;
    left: 2px;
    width: 20px;
    height: 12px;
  }

  .label-2 {
    top: 28px;
    right: 8px;
    width: 16px;
    height: 10px;
  }

  .label-3 {
    bottom: 16px;
    left: 30px;
    width: 14px;
    height: 8px;
  }

  /* Hover animations */
  .icon-container:hover .scan-bar {
    opacity: 1;
    animation: scan 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .icon-container:hover .label-1 {
    animation: fadeInLabel 0.25s ease 0.4s forwards;
  }

  .icon-container:hover .label-2 {
    animation: fadeInLabel 0.25s ease 0.6s forwards;
  }

  .icon-container:hover .label-3 {
    animation: fadeInLabel 0.25s ease 0.8s forwards;
  }

  @keyframes scan {
    0% {
      transform: translateY(-10px);
      opacity: 0;
    }
    15% {
      opacity: 1;
    }
    85% {
      opacity: 1;
    }
    100% {
      transform: translateY(48px);
      opacity: 0;
    }
  }

  @keyframes fadeInLabel {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Demo section */
  .demo-section {
    text-align: center;
  }

  .demo-title {
    margin-bottom: 40px;
    color: #404040;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.3px;
  }

  .icon-row {
    display: flex;
    gap: 60px;
    align-items: center;
    justify-content: center;
  }

  .icon-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .size-label {
    font-size: 11px;
    color: #737373;
    letter-spacing: 0.5px;
  }

  /* Dark background variant */
  .dark-bg {
    background: #1a1a1a;
    padding: 20px;
    border-radius: 8px;
  }

  .dark-bg .image-icon {
    border-color: #404040;
    background: #262626;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .dark-bg .mountain-back {
    border-bottom-color: #404040;
  }

  .dark-bg .mountain-front {
    border-bottom-color: #525252;
  }

  .dark-bg .sun {
    background: #737373;
  }

  .dark-bg .scan-bar {
    background: linear-gradient(90deg, transparent, #ffffff, transparent);
    box-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
  }

  .dark-bg .label {
    border-color: #eaeaea7c;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .dark-bg .size-label {
    color: #a3a3a3;
  }
</style>
