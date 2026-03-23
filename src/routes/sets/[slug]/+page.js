import { error } from '@sveltejs/kit';

export const ssr = false;

const modules = import.meta.glob('$lib/content/sets/*.json', { eager: true });

export function load({ params }) {
	const locale = typeof localStorage !== 'undefined' ? (localStorage.getItem('locale') ?? 'en') : 'en';

	const target = `${params.slug}.${locale}.json`;
	const fallback = `${params.slug}.en.json`;

	let entry = Object.entries(modules).find(([path]) => path.split('/').at(-1) === target);
	if (!entry) entry = Object.entries(modules).find(([path]) => path.split('/').at(-1) === fallback);
	if (!entry) error(404, 'Set not found');

	return { slug: params.slug, set: entry[1].default };
}
