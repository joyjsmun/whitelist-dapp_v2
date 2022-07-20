/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        'my_bg_image' : "url('../public/data-science.png')",
      }
      ,
      fontFamily: {
        // 'sans': ['Proxima Nova', ...defaultTheme.fontFamily.sans],
        'bebas': ['Bebas Neue', 'cursive'],
        'nato':['Noto Sans JP', 'sans-serif'],
        'ProtoMono-Light':['ProtoMono-Light', 'Helvetica', 'Arial', 'Sans-Serif'],
        'ProtoMono-LightShadow':['ProtoMono-LightShadow', 'Helvetica', 'Arial', 'Sans-Serif'],
        'ProtoMono-SemiBold':['ProtoMono-SemiBold', 'Helvetica', 'Arial', 'Sans-Serif'],
        
      },
    },
  },
  plugins: [],
}