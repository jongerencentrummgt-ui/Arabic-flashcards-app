<script>
	import { getSetStats } from '$lib/stores/progress.js';

	const modules = import.meta.glob('$lib/content/sets/*.json', { eager: true });

	const sets = Object.entries(modules).map(([path, module]) => {
		const slug = path.split('/').at(-1).replace('.json', '');
		return { slug, ...module.default };
	});

	// Populated client-side only (localStorage unavailable during SSR).
	let statsMap = $state({});

	$effect(() => {
		const map = {};
		for (const set of sets) {
			map[set.slug] = getSetStats(set.slug, set.cards.length);
		}
		statsMap = map;
	});
</script>

<svelte:head>
	<title>Arabic Flashcards</title>
</svelte:head>

<main>
	<header>
		<h1>Arabic Flashcards</h1>
		<p>Choose a set to study</p>
	</header>

	{#if sets.length === 0}
		<div class="empty">
			<p class="empty-icon">📭</p>
			<p class="empty-title">No sets found</p>
			<p class="empty-body">Add a JSON file to <code>src/lib/content/sets/</code> to get started.</p>
		</div>
	{:else}
		<div class="grid">
			{#each sets as set}
				{@const stats = statsMap[set.slug]}
				<a href="/sets/{set.slug}" class="card">
					<h2>{set.title}</h2>
					<p class="description">{set.description}</p>

					{#if stats?.studied > 0}
						<div class="progress-row">
							<div class="progress-track">
								<div
									class="progress-fill"
									style="width: {(stats.studied / set.cards.length) * 100}%"
								></div>
							</div>
							<span class="progress-label">
								{stats.studied} / {set.cards.length} studied{stats.due > 0 ? ` · ${stats.due} due` : ''}
							</span>
						</div>
					{:else}
						<span class="count">{set.cards.length} cards</span>
					{/if}
				</a>
			{/each}
		</div>
	{/if}
</main>

<style>
	main {
		max-width: 960px;
		margin: 0 auto;
		padding: 3rem 1.5rem;
	}

	header {
		margin-bottom: 2.5rem;
	}

	h1 {
		font-size: 2rem;
		font-weight: 600;
		color: var(--gold);
		margin-bottom: 0.375rem;
	}

	header p {
		color: var(--muted);
		font-size: 1rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 1.25rem;
	}

	.card {
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
		padding: 1.5rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		text-decoration: none;
		color: inherit;
		transition: border-color 0.15s, background 0.15s;
	}

	.card:hover {
		border-color: var(--gold);
		background: var(--surface2);
	}

	.card h2 {
		font-size: 1.0625rem;
		font-weight: 500;
		color: var(--text);
	}

	.description {
		font-size: 0.875rem;
		color: var(--muted);
		flex: 1;
	}

	.count {
		font-size: 0.8125rem;
		color: var(--green-text);
		font-weight: 500;
	}

	.empty {
		text-align: center;
		padding: 4rem 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.625rem;
	}

	.empty-icon {
		font-size: 2.5rem;
		margin-bottom: 0.25rem;
	}

	.empty-title {
		font-size: 1.125rem;
		font-weight: 500;
		color: var(--text);
	}

	.empty-body {
		font-size: 0.875rem;
		color: var(--muted);
	}

	.empty-body code {
		font-family: monospace;
		color: var(--gold);
		font-size: 0.8125rem;
	}

	.progress-row {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.progress-track {
		height: 3px;
		background: var(--surface2);
		border-radius: 999px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: var(--green-text);
		border-radius: 999px;
		transition: width 0.3s ease;
	}

	.progress-label {
		font-size: 0.75rem;
		color: var(--muted);
	}
</style>
