<script>
	import { getSetStats } from '$lib/stores/progress.js';

	let { data } = $props();
	const { slug, set } = data;

	let direction = $state('ar-nl');

	const modes = [
		{ label: 'Flashcards', value: 'flashcard' },
		{ label: 'Multiple Choice', value: 'multiple-choice' },
		{ label: 'Type Answer', value: 'type-answer' },
		{ label: 'Spaced Repetition', value: 'spaced-repetition' }
	];

	// Populated client-side only.
	let stats = $state(null);

	$effect(() => {
		stats = getSetStats(slug, set.cards.length);
	});
</script>

<svelte:head>
	<title>{set.title} — Arabic Flashcards</title>
</svelte:head>

<main>
	<nav>
		<a href="/" class="back">← All sets</a>
	</nav>

	<header>
		<h1>{set.title}</h1>
		<p class="description">{set.description}</p>
		<span class="count">{set.cards.length} cards</span>

		{#if stats?.studied > 0}
			<div class="stats-bar">
				<span class="stat">
					<span class="stat-value">{stats.studied} / {set.cards.length}</span>
					<span class="stat-label">studied</span>
				</span>
				<span class="stat-divider">·</span>
				<span class="stat" class:stat-due={stats.due > 0}>
					<span class="stat-value">{stats.due}</span>
					<span class="stat-label">due today</span>
				</span>
				<span class="stat-divider">·</span>
				<span class="stat">
					<span class="stat-value">{stats.mastered}</span>
					<span class="stat-label">mastered</span>
				</span>
			</div>
		{/if}
	</header>

	<section class="study">
		<div class="direction-toggle">
			<button
				class:active={direction === 'ar-nl'}
				onclick={() => (direction = 'ar-nl')}
			>
				Arabic → Dutch
			</button>
			<button
				class:active={direction === 'nl-ar'}
				onclick={() => (direction = 'nl-ar')}
			>
				Dutch → Arabic
			</button>
		</div>

		<div class="modes">
			{#each modes as mode}
				{@const isSR = mode.value === 'spaced-repetition'}
				{@const hasDue = isSR && (stats?.due ?? 0) > 0}
				<a
					href="/study/{slug}/{mode.value}?direction={direction}"
					class="mode-btn"
					class:mode-due={hasDue}
				>
					{mode.label}
					{#if hasDue}
						<span class="due-badge">{stats.due}</span>
					{/if}
				</a>
			{/each}
		</div>
	</section>

	<section class="card-list">
		<h2>All terms</h2>
		<ul>
			{#each set.cards as card}
				<li>
					<span class="arabic" lang="ar">{card.arabic}</span>
					<span class="dutch">{card.dutch}</span>
				</li>
			{/each}
		</ul>
	</section>
</main>

<style>
	main {
		max-width: 760px;
		margin: 0 auto;
		padding: 2rem 1.5rem 4rem;
	}

	nav {
		margin-bottom: 1.75rem;
	}

	.back {
		color: var(--muted);
		text-decoration: none;
		font-size: 0.875rem;
	}

	.back:hover {
		color: var(--text);
	}

	header {
		margin-bottom: 2.5rem;
	}

	h1 {
		font-size: 1.75rem;
		font-weight: 600;
		color: var(--gold);
		margin-bottom: 0.375rem;
	}

	header .description {
		color: var(--muted);
		font-size: 0.9375rem;
		margin-bottom: 0.5rem;
	}

	.count {
		font-size: 0.8125rem;
		color: var(--green-text);
		font-weight: 500;
	}

	.stats-bar {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		margin-top: 0.875rem;
		padding: 0.75rem 1rem;
		background: var(--surface2);
		border-radius: var(--radius);
		flex-wrap: wrap;
	}

	.stat {
		display: flex;
		align-items: baseline;
		gap: 0.3rem;
	}

	.stat-value {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--text);
	}

	.stat-label {
		font-size: 0.75rem;
		color: var(--muted);
	}

	.stat-due .stat-value {
		color: var(--gold);
	}

	.stat-divider {
		color: var(--border);
		font-size: 0.875rem;
	}

	/* ── Study section ── */

	.study {
		margin-bottom: 3rem;
	}

	.direction-toggle {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1.25rem;
	}

	.direction-toggle button {
		padding: 0.4rem 1rem;
		border-radius: 999px;
		border: 1px solid var(--border);
		background: var(--surface);
		color: var(--muted);
		font-family: inherit;
		font-size: 0.875rem;
		cursor: pointer;
		transition: border-color 0.15s, color 0.15s, background 0.15s;
	}

	.direction-toggle button.active {
		border-color: var(--gold);
		color: var(--gold);
		background: var(--surface2);
	}

	.modes {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: 0.75rem;
	}

	.mode-btn {
		display: block;
		padding: 0.875rem 1.25rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		color: var(--text);
		text-decoration: none;
		font-size: 0.9375rem;
		font-weight: 500;
		text-align: center;
		transition: border-color 0.15s, background 0.15s;
	}

	.mode-btn:hover {
		border-color: var(--gold);
		background: var(--surface2);
	}

	.mode-btn.mode-due {
		border-color: var(--gold);
		color: var(--gold);
		position: relative;
	}

	.due-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: var(--gold);
		color: var(--bg);
		font-size: 0.6875rem;
		font-weight: 700;
		line-height: 1;
		padding: 0.175rem 0.4rem;
		border-radius: 999px;
		margin-left: 0.375rem;
	}

	/* ── Card list ── */

	.card-list h2 {
		font-size: 1rem;
		font-weight: 500;
		color: var(--muted);
		margin-bottom: 1rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-size: 0.75rem;
	}

	ul {
		list-style: none;
		border-top: 1px solid var(--border);
	}

	li {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding: 0.875rem 0;
		border-bottom: 1px solid var(--border);
	}

	.arabic {
		flex: 1;
		font-family: 'Amiri', serif;
		font-size: 1.25rem;
		color: var(--cream);
		direction: rtl;
		text-align: right;
	}

	.dutch {
		flex: 1;
		font-size: 0.9375rem;
		color: var(--text);
	}
</style>
