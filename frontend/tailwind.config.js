/** @type {import('tailwindcss').Config} */
// Escalas derivadas da paleta oficial do DailyMind:
// azul claro 185,205,241 · azul médio 102,117,181 · pêssego 235,198,180 · rosa 210,113,134
// verde claro 202,211,132 · verde escuro 132,158,22 · lilás 211,192,204
module.exports = {
  content: ['./index.html', './js/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'ui-rounded', 'Segoe UI', 'system-ui', 'sans-serif']
      },
      colors: {
        mint: { 50: '#F5F7E6', 100: '#ECF0CC', 200: '#DDE4A9', 300: '#CAD384', 400: '#A9BC45', 500: '#849E16', 600: '#667B10', 700: '#4E610C' },
        lavender: { 50: '#F8F3F6', 100: '#F0E7ED', 200: '#E3D5DE', 300: '#D3C0CC', 400: '#B99AAE', 500: '#9A7690', 600: '#74546A' },
        peach: { 50: '#FDF6F2', 100: '#FAEBE3', 200: '#F3D8CA', 300: '#EBC6B4', 400: '#DDA488', 500: '#C98060', 600: '#92533A' },
        sky: { 50: '#F1F5FD', 100: '#E2EAFB', 200: '#CEDBF6', 300: '#B9CDF1', 400: '#8E9FD6', 500: '#6675B5', 600: '#4B5898' },
        rosa: { 50: '#FBEEF1', 100: '#F6DCE2', 200: '#EDC3CD', 300: '#E39BAB', 400: '#D27186', 500: '#B9546C', 600: '#A13D57' }
      }
    }
  }
}
