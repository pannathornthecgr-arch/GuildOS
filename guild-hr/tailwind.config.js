/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // 🌟 แปะโค้ดแอนิเมชันของ ChatGPT ตรงนี้เลยครับบอส!
      animation: {
        glow: 'glow 3s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
        shine: 'shine 4s linear infinite'
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(168,85,247,.2)' },
          '50%': { boxShadow: '0 0 35px rgba(168,85,247,.45)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        shine: {
          '0%': { transform: 'translateX(-200px) rotate(12deg)' },
          '100%': { transform: 'translateX(800px) rotate(12deg)' }
        }
      }
    },
  },
  plugins: [],
}