/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // 'sans': ['Proxima Nova', ...defaultTheme.fontFamily.sans],
        'bebas': ['Bebas Neue', 'cursive'],
        'nato':['Noto Sans JP', 'sans-serif'],
        'ProtoMono-Light':['ProtoMono-Light', 'Helvetica', 'Arial', 'Sans-Serif'],
        'ProtoMono-LightShadow':['ProtoMono-LightShadow', 'Helvetica', 'Arial', 'Sans-Serif'],
        'ProtoMono-SemiBold':['ProtoMono-SemiBold', 'Helvetica', 'Arial', 'Sans-Serif'],
        
      },
      borderRadius:{
        'twistBorder':'255px 15px 225px 15px/15px 225px 15px 255px;'
      },
      keyframes: {
        wiggle: {
          '0%': { transform: 'translateY(-400px)' },
          '100%': { transform: 'translateY(900px)' },
        },
        animation: {
          wiggle: 'wiggle 1s cubic-bezier(0.21, 0.14, 0.52, 0.59) infinite',
        }
  
      }
    },
  },
  plugins: [],
}