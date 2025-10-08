/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      scale: {
        '98': '0.98',
        '102': '1.02',
      },
      boxShadow: {
        '3xl': '0 35px 60px -12px rgba(0, 212, 255, 0.25)',
        'cosmic': '0 0 50px rgba(0, 212, 255, 0.3)',
        'nebula': '0 0 60px rgba(139, 92, 246, 0.4)',
      }
    },
  },
  plugins: [],
}
