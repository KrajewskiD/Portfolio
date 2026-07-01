import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useParchmentScroll from './useParchmentScroll';

describe('useParchmentScroll', () => {
  let mockRef: { current: HTMLElement | null };
  let mockHeroElement: HTMLElement;
  let mockDefaultElement: HTMLElement;
  let requestAnimationFrameSpy: any;
  let cancelAnimationFrameSpy: any;

  beforeEach(() => {
    vi.useFakeTimers();

    requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 1;
    });
    cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});

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

    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });

    mockHeroElement = document.createElement('div');
    mockHeroElement.className = 'site-section--hero';
    mockHeroElement.getBoundingClientRect = vi.fn().mockReturnValue({ top: 100, height: 500 });
    
    mockDefaultElement = document.createElement('div');
    mockDefaultElement.className = 'site-section--default';
    mockDefaultElement.getBoundingClientRect = vi.fn().mockReturnValue({ top: 800, height: 600 });

    const rootElement = document.createElement('div');
    rootElement.appendChild(mockHeroElement);
    rootElement.appendChild(mockDefaultElement);
    
    mockRef = { current: rootElement };
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('nie robi nic, gdy prefersReducedMotion jest włączone', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({ matches: true })),
    });

    renderHook(() => useParchmentScroll(mockRef));
    expect(mockHeroElement.style.transform).toBe('');
  });

  it('dodaje transformacje rotateX przy scrollu po uruchomieniu', () => {
    Object.defineProperty(window, 'scrollY', { value: 500, writable: true });

    renderHook(() => useParchmentScroll(mockRef));
    
    // transformacje powinny być ustawione po renderze (dzięki update() w useEffect)
    expect(mockHeroElement.style.transform).toContain('rotateX');
    expect(mockDefaultElement.style.transform).toContain('rotateX');
  });

  it('usuwa nasłuchiwacze i transformacje po odmontowaniu', () => {
    mockHeroElement.style.transform = 'rotateX(5deg)';
    
    const { unmount } = renderHook(() => useParchmentScroll(mockRef));
    unmount();

    expect(cancelAnimationFrameSpy).toHaveBeenCalled();
    expect(mockHeroElement.style.transform).toBe('');
  });
});
