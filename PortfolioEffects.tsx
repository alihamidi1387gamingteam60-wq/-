'use client';

import { useEffect } from 'react';
import { initAsciiRain } from '@/features/effects/ascii-rain.js';
import { initCursorRing } from '@/features/effects/cursor-ring.js';
import { initTypewriterGlitch } from '@/features/effects/typewriter-glitch.js';
import { initThemeLanguage } from '@/features/theme/theme-language.js';
import { initCodeWindow } from '@/features/hero/code-window.js';
import { initHeroStats } from '@/features/hero/hero-stats.js';
import { initGlobeMesh } from '@/features/about/globe-mesh.js';
import { initSpotlightText } from '@/features/about/spotlight-text.js';
import { initCourseSearch } from '@/features/search/course-search.js';

type PortfolioWindow = Window & { __aliVorynEffectsInitialized?: boolean };

/** Isolates legacy canvas/DOM effects from the server-rendered React component tree. */
export function PortfolioEffects() {
  useEffect(() => {
    const appWindow = window as PortfolioWindow;
    if (appWindow.__aliVorynEffectsInitialized) return;
    appWindow.__aliVorynEffectsInitialized = true;

    initThemeLanguage();
    initCursorRing();
    initAsciiRain();
    initTypewriterGlitch();
    initCodeWindow();
    initGlobeMesh();
    initSpotlightText();
    initCourseSearch();
    initHeroStats();
  }, []);

  return null;
}
