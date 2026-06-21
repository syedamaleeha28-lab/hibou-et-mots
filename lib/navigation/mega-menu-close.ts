export const MEGA_MENU_CLOSE_DELAY_MS = 250

export type DelayedCloseHandle = {
  schedule: () => void
  cancel: () => void
  dispose: () => void
}

/** Schedules close after a delay; cancel on re-enter or when opening another menu. */
export function createDelayedClose(
  delayMs: number,
  onClose: () => void,
): DelayedCloseHandle {
  let timer: ReturnType<typeof setTimeout> | null = null

  return {
    schedule() {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        timer = null
        onClose()
      }, delayMs)
    },
    cancel() {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    },
    dispose() {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    },
  }
}
