import { error } from '@sveltejs/kit';

export const ssr = false;

const modules = import.meta.glob('$lib/content/sets/*.json', { eager: true });

export function load({ params, url }) {
	const entry = Object.entries(modules).find(
		([path]) => path.split('/').at(-1).replace('.json', '') === params.slug
	);

	if (!entry) error(404, 'Set not found');

	const direction = url.searchParams.get('direction') ?? 'ar-nl';

	return {
		slug: params.slug,
		mode: params.mode,
		direction,
		set: entry[1].default
	};
}
