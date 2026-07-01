import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useNavbarScrollReveal } from './useNavbarScrollReveal';

const SCROLL_DELTA = 6;
const TOP_REVEAL_OFFSET = 48;
const IDLE_REVEAL_DELAY_MS = 140;

const fireScroll = (scrollY: number) => {
  Object.defineProperty(window, 'scrollY', { value: scrollY, writable: true });
  window.dispatchEvent(new Event('scroll'));
};

describe('useNavbarScrollReveal', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('powinien zwracać domyślne wartości przy montowaniu', () => {
    const { result } = renderHook(() => useNavbarScrollReveal());
    expect(result.current.isHidden).toBe(false);
    expect(result.current.revealInstant).toBe(false);
  });

  it('powinien ukryć navbar przy scrollowaniu w dół o SCROLL_DELTA', () => {
    const { result } = renderHook(() => useNavbarScrollReveal());
    
    act(() => fireScroll(TOP_REVEAL_OFFSET + 10));
    act(() => fireScroll(TOP_REVEAL_OFFSET + 10 + SCROLL_DELTA + 1));
    
    expect(result.current.isHidden).toBe(true);
  });

  it('powinien ujawnić navbar po scrollowaniu w górę', () => {
    const { result } = renderHook(() => useNavbarScrollReveal());
    
    act(() => fireScroll(100));
    act(() => fireScroll(150));
    expect(result.current.isHidden).toBe(true);

    act(() => fireScroll(150 - SCROLL_DELTA - 1));
    expect(result.current.isHidden).toBe(false);
  });

  it('powinien ujawnić navbar automatycznie, gdy użytkownik przestanie scrollować', () => {
    const { result } = renderHook(() => useNavbarScrollReveal());
    
    act(() => fireScroll(200));
    expect(result.current.isHidden).toBe(true);
    
    act(() => {
      vi.advanceTimersByTime(IDLE_REVEAL_DELAY_MS);
    });
    
    expect(result.current.isHidden).toBe(false);
  });

  it('nie powinien chować navbara, jeśli użytkownik najechał na niego myszką', () => {
    const { result } = renderHook(() => useNavbarScrollReveal());
    
    act(() => result.current.onMouseEnter());
    expect(result.current.revealInstant).toBe(true);
    
    act(() => fireScroll(200));
    expect(result.current.isHidden).toBe(false);
  });

  it('nie powinien chować navbara, jeśli jest on wyłączony', () => {
    const { result, rerender } = renderHook(
      (props) => useNavbarScrollReveal(props),
      { initialProps: { isDisabled: false } }
    );
    
    act(() => rerender({ isDisabled: true }));
    act(() => fireScroll(300));
    
    expect(result.current.isHidden).toBe(false);
  });
});
