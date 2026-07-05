export const THEME = {
  colors: {
    light: {
      background: '#f8fafc',
      foreground: '#0f172a',
      primary: '#113c2b',
      primaryHover: '#1e5e44',
      primaryForeground: '#ffffff',
      glassBg: 'rgba(255, 255, 255, 0.7)',
      glassBorder: 'rgba(17, 60, 43, 0.08)',
    },
    dark: {
      background: '#091a13',
      foreground: '#f1f5f9',
      primary: '#1e5e44',
      primaryHover: '#2d825f',
      primaryForeground: '#ffffff',
      glassBg: 'rgba(9, 26, 19, 0.8)',
      glassBorder: 'rgba(255, 255, 255, 0.08)',
    },
  },
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    xxl: '3rem',     // 48px
  },
  borderRadius: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    full: '9999px',
  },
  shadows: {
    glass: '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
    glassDark: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
  },
  transitions: {
    default: 'all 0.3s ease',
    fast: 'all 0.2s ease-in-out',
  },
} as const;
