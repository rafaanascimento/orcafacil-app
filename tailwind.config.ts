import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E40AF',
        secondary: '#2563EB',
        action: '#F97316',
        surface: '#F3F4F6',
        ink: '#1F2937',
      },
    },
  },
  plugins: [],
};

export default config;
