/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans SC"', '"Microsoft YaHei"', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        ink: '#1D2129',
        body: '#4E5969',
        muted: '#86909C',
        line: '#E5E6EB',
        paper: '#F7F9FC',
        brand: {
          50: '#E8F1FF',
          100: '#D6E6FF',
          500: '#266FE8',
          600: '#0052D9',
          700: '#003CAB',
          hover: '#266FE8'
        },
        status: {
          normal: '#00A870',
          warning: '#FF7D00',
          danger: '#F53F3F'
        },
        amber: {
          soft: '#FFF6DE',
          deep: '#A86413'
        }
      },
      boxShadow: {
        card: '0 16px 40px rgba(29, 33, 41, 0.06)',
        soft: '0 8px 24px rgba(0, 82, 217, 0.10)'
      }
    }
  },
  plugins: []
};
