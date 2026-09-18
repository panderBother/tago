<script setup lang="ts">
// 置顶卡片内联 SVG 纸张背景
</script>

<template>
  <svg class="pinned-paper" viewBox="0 0 900 360" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="pinned-rough" x="-4%" y="-8%" width="108%" height="116%">
        <feTurbulence type="fractalNoise" baseFrequency=".009 .054" numOctaves="2" seed="17" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="B"/>
      </filter>
      <filter id="pinned-grain">
        <feTurbulence type="fractalNoise" baseFrequency=".45" numOctaves="3" seed="8" result="n"/>
        <feColorMatrix in="n" values=".65 0 0 0 .22 0 .56 0 0 .19 0 0 .28 0 .08 0 0 0 .20 0"/>
        <feBlend in="SourceGraphic" mode="multiply"/>
      </filter>
      <linearGradient id="pinned-base" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#fff8d8"/>
        <stop offset="0.46" stop-color="#fff4cc"/>
        <stop offset="1" stop-color="#f7e6aa"/>
      </linearGradient>
      <radialGradient id="pinned-wash" cx="28%" cy="37%" r="62%">
        <stop offset="0" stop-color="#fff" stop-opacity=".72"/>
        <stop offset=".58" stop-color="#fff" stop-opacity=".14"/>
        <stop offset="1" stop-color="#e6c866" stop-opacity=".13"/>
      </radialGradient>
    </defs>
    <path
      class="pinned-paper__shadow"
      d="M15 15 C77 7 128 15 192 10 C267 5 329 14 395 10 C485 5 557 15 640 9 C730 4 807 11 889 17 L893 50 C899 88 890 124 895 160 C901 204 889 246 895 283 L889 348 C815 353 752 347 678 352 C587 358 516 348 426 354 C335 359 252 349 176 354 C113 358 66 350 13 348 L9 303 C4 268 14 227 8 190 C3 147 15 107 9 69 Z"
      fill="#bfa34f"
      opacity=".12"
    />
    <g filter="url(#pinned-rough)">
      <path
        d="M13 11 C76 5 126 13 190 8 C264 3 328 12 393 8 C483 3 555 13 638 7 C728 2 805 9 887 14 L891 48 C897 86 888 122 893 158 C899 202 887 244 893 281 L887 345 C813 351 750 344 676 349 C585 355 514 346 424 351 C333 357 250 346 174 351 C111 356 64 347 11 345 L7 301 C2 266 12 225 6 188 C1 145 13 105 7 67 Z"
        fill="url(#pinned-base)"
      />
      <path
        d="M13 11 C76 5 126 13 190 8 C264 3 328 12 393 8 C483 3 555 13 638 7 C728 2 805 9 887 14 L891 48 C897 86 888 122 893 158 C899 202 887 244 893 281 L887 345 C813 351 750 344 676 349 C585 355 514 346 424 351 C333 357 250 346 174 351 C111 356 64 347 11 345 L7 301 C2 266 12 225 6 188 C1 145 13 105 7 67 Z"
        fill="url(#pinned-wash)"
        filter="url(#pinned-grain)"
        opacity=".72"
      />
    </g>
    <path d="M31 42 C180 25 292 35 405 29" fill="none" stroke="#fff" stroke-width="17" stroke-linecap="round" opacity=".22"/>
    <path d="M26 315 C178 329 294 317 442 325 C596 332 741 316 867 325" fill="none" stroke="#d6ba63" stroke-width="9" stroke-linecap="round" opacity=".09"/>
  </svg>
</template>

<style scoped lang="scss">
.pinned-paper { position: absolute; inset: -10rpx -10rpx -10rpx -10rpx; width: calc(100% + 20rpx); height: calc(100% + 20rpx); pointer-events: none; }
</style>
