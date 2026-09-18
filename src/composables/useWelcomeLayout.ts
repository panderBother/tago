import { computed, shallowRef } from 'vue'

interface ViewportSize {
  width: number
  height: number
}

const IMAGE_WIDTH = 941
const IMAGE_HEIGHT = 1672

const CTA_BOX = {
  left: 0.101,
  top: 0.7919,
  width: 0.796,
  height: 0.0772,
}

export function useWelcomeLayout() {
  const viewport = shallowRef<ViewportSize>(readViewport())

  const layout = computed(() => {
    const vw = viewport.value.width
    const vh = viewport.value.height
    if (!vw || !vh) return null

    const scale = Math.max(vw / IMAGE_WIDTH, vh / IMAGE_HEIGHT)
    const width = IMAGE_WIDTH * scale
    const height = IMAGE_HEIGHT * scale

    // Slide the artwork inside its overflow so the CTA stays fully visible,
    // which keeps every viewport edge covered on any aspect ratio.
    const offset = (boxStart: number, boxEnd: number, view: number, overflow: number) => {
      const min = Math.max(-overflow, -boxStart)
      const max = Math.min(0, view - boxEnd)
      const centered = -overflow / 2
      if (min > max) return Math.min(Math.max(centered, -overflow), 0)
      return Math.min(Math.max(centered, min), max)
    }

    const left = offset(CTA_BOX.left * width, (CTA_BOX.left + CTA_BOX.width) * width, vw, width - vw)
    const top = offset(CTA_BOX.top * height, (CTA_BOX.top + CTA_BOX.height) * height, vh, height - vh)

    return {
      image: { width: `${width}px`, height: `${height}px`, left: `${left}px`, top: `${top}px` },
      cta: {
        width: `${CTA_BOX.width * width}px`,
        height: `${CTA_BOX.height * height}px`,
        left: `${left + CTA_BOX.left * width}px`,
        top: `${top + CTA_BOX.top * height}px`,
      },
    }
  })

  function syncViewport(size?: { windowWidth: number, windowHeight: number }) {
    viewport.value = size
      ? { width: size.windowWidth, height: size.windowHeight }
      : readViewport()
  }

  return { layout, syncViewport }
}

function readViewport() {
  try {
    const info = uni.getSystemInfoSync()
    return { width: info.windowWidth, height: info.windowHeight }
  }
  catch {
    return { width: 375, height: 667 }
  }
}
