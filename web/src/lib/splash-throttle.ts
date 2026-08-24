const REPEAT_AFTER_MS = 24 * 60 * 60 * 1000;
const LAST_SHOWN_KEY = "sr_splash_last_shown";

export function shouldShowSplash(): boolean {
  try {
    const last = window.localStorage.getItem(LAST_SHOWN_KEY);
    if (last && Date.now() - Number(last) < REPEAT_AFTER_MS) return false;
    window.localStorage.setItem(LAST_SHOWN_KEY, String(Date.now()));
    return true;
  } catch {
    return true;
  }
}
