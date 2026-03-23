import { writable } from 'svelte/store';

const STORAGE_KEY = 'theme';

// Holds the resolved active theme: 'dark' | 'light'
export const theme = writable('dark');

function getSystemTheme() {
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(value) {
	if (value === 'light') {
		document.documentElement.setAttribute('data-theme', 'light');
	} else {
		document.documentElement.removeAttribute('data-theme');
	}
	theme.set(value);
}

export function initTheme() {
	if (typeof window === 'undefined') return;

	const saved = localStorage.getItem(STORAGE_KEY);
	applyTheme(saved ?? getSystemTheme());

	// Update automatically when system preference changes — only if no manual override is set.
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
		if (!localStorage.getItem(STORAGE_KEY)) {
			applyTheme(e.matches ? 'dark' : 'light');
		}
	});
}

export function toggleTheme() {
	if (typeof window === 'undefined') return;
	const saved = localStorage.getItem(STORAGE_KEY);
	const current = saved ?? getSystemTheme();
	const next = current === 'dark' ? 'light' : 'dark';
	localStorage.setItem(STORAGE_KEY, next);
	applyTheme(next);
}
