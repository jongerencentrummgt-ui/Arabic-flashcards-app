import { addMessages, init, locale } from 'svelte-i18n';
import en from './en.json';
import nl from './nl.json';
import tr from './tr.json';

// Register all locales synchronously — no async loading needed for this app.
addMessages('en', en);
addMessages('nl', nl);
addMessages('tr', tr);

const LOCALE_KEY = 'locale';

let initialized = false;

/**
 * Call once from +layout.svelte. Reads the saved locale from localStorage
 * (client) or falls back to 'en' (server / first visit).
 */
export function setupI18n() {
	if (initialized) return;
	initialized = true;

	const saved =
		typeof localStorage !== 'undefined' ? localStorage.getItem(LOCALE_KEY) : null;

	init({
		fallbackLocale: 'en',
		initialLocale: saved ?? 'en'
	});
}

/**
 * Switch the active locale and persist it to localStorage.
 */
export function switchLocale(loc) {
	locale.set(loc);
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(LOCALE_KEY, loc);
	}
}

export { locale };
