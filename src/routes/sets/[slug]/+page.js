import { error } from '@sveltejs/kit';

const modules = import.meta.glob('$lib/content/sets/*.json', { eager: true });

export function load({ params }) {
	const entry = Object.entries(modules).find(
		([path]) => path.split('/').at(-1).replace('.json', '') === params.slug
	);

	if (!entry) error(404, 'Set not found');

	return { slug: params.slug, set: entry[1].default };
}
