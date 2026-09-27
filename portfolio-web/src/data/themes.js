// ---------------------------------------------------------------
//  The 4 color themes.
// ---------------------------------------------------------------
//  Each theme is just a set of CSS custom properties (the --c-*
//  names) plus one accent color. The actual colors live in
//  styles/theme.css, so this file stays readable and you can add
//  your own theme by copying one of these objects.
// ---------------------------------------------------------------

export const themes = [
  {
    id: 'midnight',
    name: 'Midnight',
    icon: 'M',
    // dark: true means the page background is dark
    dark: true,
    // shown in the <meta name="theme-color"> tag
    browser: '#05070f',
  },
  {
    id: 'daylight',
    name: 'Daylight',
    icon: 'D',
    dark: false,
    browser: '#f4f7fd',
  },
  {
    id: 'neon',
    name: 'Neon Noir',
    icon: 'N',
    dark: true,
    browser: '#0a0413',
  },
  {
    id: 'solar',
    name: 'Solar',
    icon: 'S',
    dark: false,
    browser: '#fdf6ec',
  },
]

// Handy lookup:  themeById['neon'].name  ->  'Neon Noir'
export const themeById = Object.fromEntries(themes.map((t) => [t.id, t]))

// What the site uses if nothing was ever saved.
export const DEFAULT_THEME = 'midnight'
