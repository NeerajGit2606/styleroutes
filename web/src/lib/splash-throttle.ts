const SHOWN_KEY = "sr_splash_shown";

export function shouldShowSplash(): boolean {
  try {
    if (window.localStorage.getItem(SHOWN_KEY)) return false;
    window.localStorage.setItem(SHOWN_KEY, "1");
    return true;
  } catch {
    return true;
  }
}
