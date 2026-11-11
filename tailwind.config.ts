import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        space: 'var(--page-bg)',
        accent: 'var(--accent)',
        crystal: 'var(--crystal)'
      },
      fontFamily: {
        sans: ['Vazir', 'Arial', 'sans-serif'],
        heading: ['Estedad', 'Vazir', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;
