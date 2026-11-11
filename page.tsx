import { SiteHeader } from '@/components/layout/SiteHeader';
import { HeroSection } from '@/components/hero/HeroSection';
import { PortfolioSections } from '@/components/sections/PortfolioSections';
import { ThemeDialog } from '@/components/dialogs/ThemeDialog';
import { CourseSearchDialog } from '@/components/dialogs/CourseSearchDialog';
import { PortfolioEffects } from '@/components/PortfolioEffects';

export default function HomePage() {
  return (
    <>
      <canvas id="cursorField" aria-hidden="true" />
      <SiteHeader />
      <HeroSection />
      <PortfolioSections />
      <ThemeDialog />
      <CourseSearchDialog />
      <PortfolioEffects />
    </>
  );
}
