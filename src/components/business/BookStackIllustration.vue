<script setup lang="ts">
// 纯装饰插画：书脊无文字，避免与界面语言绑定。
</script>

<template>
  <svg class="book-stack" viewBox="0 0 150 112" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <filter id="book-wobble" x="-10%" y="-10%" width="120%" height="125%">
        <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="8" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.7" />
      </filter>
    </defs>
    <g filter="url(#book-wobble)" stroke-linejoin="round">
      <path d="M26 83 118 72l8 22-91 11z" fill="#6f8d75" stroke="#506b58" stroke-width="3" />
      <path d="m35 84 82-9 3 8-82 10z" fill="#f2e5bc" stroke="#b69d70" stroke-width="2" />
      <path d="M20 57 111 48l7 23-91 10z" fill="#d79b5f" stroke="#a56d3e" stroke-width="3" />
      <path d="m28 58 79-7 4 8-81 9z" fill="#f6e7bd" stroke="#bd9d69" stroke-width="2" />
      <path d="M34 27 121 36l-7 23-88-9z" fill="#7890a0" stroke="#566d7a" stroke-width="3" />
      <path d="m38 31 77 8-3 8-78-8z" fill="#efe4c4" stroke="#bca981" stroke-width="2" />
      <path d="M45 17c19-7 43-5 62 5l-8 7c-16-7-34-8-50-3z" fill="#e6d5a4" stroke="#aa8d5b" stroke-width="2" />
      <path d="M104 24c6 2 12 7 15 12" stroke="#e2b742" stroke-width="4" stroke-linecap="round" />
    </g>
    <path d="M132 16v13M126 22h13M17 39l-6 7M15 35l-8-2" stroke="#f0c84d" stroke-width="3" stroke-linecap="round" />
  </svg>
</template>

<style scoped>
.book-stack { display: block; width: 100%; height: 100%; overflow: visible; }
</style>
