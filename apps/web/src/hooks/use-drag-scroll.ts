"use client";

import { useRef, useCallback } from "react";

export function useDragScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const state = useRef({
    active: false,
    startX: 0,
    startScrollLeft: 0,
    hasDragged: false,
  });

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const s = state.current;
    s.active = true;
    s.hasDragged = false;
    s.startX = e.clientX;
    s.startScrollLeft = ref.current?.scrollLeft ?? 0;
    ref.current?.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const s = state.current;
    if (!s.active || !ref.current) return;
    const delta = s.startX - e.clientX;
    if (Math.abs(delta) > 5) s.hasDragged = true;
    ref.current.scrollLeft = s.startScrollLeft + delta;
  }, []);

  const onPointerUp = useCallback(() => {
    state.current.active = false;
  }, []);

  // Suppresses child clicks that were actually drags
  const onClickCapture = useCallback((e: React.MouseEvent) => {
    if (state.current.hasDragged) {
      e.stopPropagation();
      e.preventDefault();
      state.current.hasDragged = false;
    }
  }, []);

  return {
    ref,
    dragProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onClickCapture,
    },
  };
}
