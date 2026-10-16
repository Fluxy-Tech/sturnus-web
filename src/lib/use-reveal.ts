"use client";

import { useEffect } from "react";

/// Marca com .is-in, uma única vez, cada [data-reveal] que entra na tela. O
/// CSS (globals.css) só esconde as partes com JS ativo, e uma rede de
/// segurança mostra tudo que estiver visível se o observer não disparar.
export function useRevealOnScroll() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!targets.length) return;
    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 },
    );
    targets.forEach((el) => observer.observe(el));

    const safety = setTimeout(() => {
      targets.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < innerHeight && rect.bottom > 0) el.classList.add("is-in");
      });
    }, 2500);

    return () => {
      observer.disconnect();
      clearTimeout(safety);
    };
  }, []);
}
