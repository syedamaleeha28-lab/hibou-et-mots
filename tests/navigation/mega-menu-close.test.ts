import { describe, expect, it, vi, afterEach } from "vitest"
import {
  MEGA_MENU_CLOSE_DELAY_MS,
  createDelayedClose,
} from "@/lib/navigation/mega-menu-close"

describe("mega menu close delay", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("uses a 200-300ms close delay", () => {
    expect(MEGA_MENU_CLOSE_DELAY_MS).toBeGreaterThanOrEqual(200)
    expect(MEGA_MENU_CLOSE_DELAY_MS).toBeLessThanOrEqual(300)
  })

  it("closes after the delay when scheduled", () => {
    vi.useFakeTimers()
    const onClose = vi.fn()
    const closer = createDelayedClose(MEGA_MENU_CLOSE_DELAY_MS, onClose)

    closer.schedule()
    expect(onClose).not.toHaveBeenCalled()

    vi.advanceTimersByTime(MEGA_MENU_CLOSE_DELAY_MS)
    expect(onClose).toHaveBeenCalledTimes(1)

    closer.dispose()
  })

  it("cancels a pending close when the pointer re-enters", () => {
    vi.useFakeTimers()
    const onClose = vi.fn()
    const closer = createDelayedClose(MEGA_MENU_CLOSE_DELAY_MS, onClose)

    closer.schedule()
    vi.advanceTimersByTime(100)
    closer.cancel()
    vi.advanceTimersByTime(MEGA_MENU_CLOSE_DELAY_MS)

    expect(onClose).not.toHaveBeenCalled()
    closer.dispose()
  })

  it("resets the timer when schedule is called again", () => {
    vi.useFakeTimers()
    const onClose = vi.fn()
    const closer = createDelayedClose(MEGA_MENU_CLOSE_DELAY_MS, onClose)

    closer.schedule()
    vi.advanceTimersByTime(200)
    closer.schedule()
    vi.advanceTimersByTime(200)
    expect(onClose).not.toHaveBeenCalled()

    vi.advanceTimersByTime(50)
    expect(onClose).toHaveBeenCalledTimes(1)

    closer.dispose()
  })
})
