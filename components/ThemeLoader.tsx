"use client";
import { useEffect } from 'react';
import { templates } from '../lib/templates';

export default function ThemeLoader() {
  useEffect(() => {
    let mounted = true;

    const applyTheme = (themeVal: string | null) => {
      if (!themeVal || typeof document === 'undefined') return;
      // remove other template classes then add the chosen one
      templates.forEach((t: any) => document.body.classList.remove(t.className));
      document.body.classList.add(themeVal);
      try {
        localStorage.setItem('siteTheme', themeVal);
      } catch (e) {
        // ignore if localStorage isn't available
      }
    };

    // First apply any local cached theme for immediate visual feedback
    try {
      const cached = typeof window !== 'undefined' ? localStorage.getItem('siteTheme') : null;
      if (mounted && cached) applyTheme(cached);
    } catch (e) {
      // ignore localStorage read errors
    }

    (async () => {
      try {
        const res = await fetch('/api/theme');
        if (!mounted) return;
        if (!res.ok) {
          // if server doesn't return a theme, we keep the local cached one
          return;
        }
        const data = await res.json();
        const themeVal = data?.theme?.theme || data?.theme || null;
        if (mounted && themeVal) {
          applyTheme(themeVal);
        }
      } catch (err) {
        // fetch failed — keep local cached theme if present
        // console.debug('ThemeLoader fetch error', err);
      }
    })();

    return () => { mounted = false; };
  }, []);
  return null;
}
