"use client";

import { useEffect, useState, type RefObject } from "react";

/// true enquanto o elemento estiver visível na tela — usado pra só animar as
/// vitrines quando o visitante está olhando pra elas. Com `once`, fica true
/// depois da primeira aparição (entradas que não devem se repetir).
export function useInView(ref: RefObject<Element | null>, { threshold = 0.35, once = false } = {}) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (once && entry.isIntersecting) observer.disconnect();
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold, once]);

  return inView;
}

/// Respeita o "reduzir movimento" do sistema operacional.
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}
