/**
 * Theme Initializer
 *
 * This component injects a blocking script that runs BEFORE React hydrates
 * to apply the theme from localStorage, preventing any flash of unstyled content.
 *
 * The script is placed in <head> and executes synchronously to ensure
 * the theme class is applied before the page renders.
 */
export function ThemeInitializer() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var theme = localStorage.getItem('client-theme');
              if (theme === 'theme-adu-dev') {
                document.documentElement.classList.add('theme-adu-dev');
              }
            } catch (e) {
              // localStorage not available (SSR, private browsing, etc.)
              console.warn('Could not restore theme from localStorage:', e);
            }
          })();
        `,
      }}
    />
  )
}
