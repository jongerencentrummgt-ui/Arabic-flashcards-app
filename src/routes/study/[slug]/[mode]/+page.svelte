<script>
	import { t, locale } from 'svelte-i18n';
	import Flashcard from '$lib/components/Flashcard.svelte';
	import MultipleChoice from '$lib/components/MultipleChoice.svelte';
	import TypeAnswer from '$lib/components/TypeAnswer.svelte';
	import SpacedRepetition from '$lib/components/SpacedRepetition.svelte';
	import { getDueCards, markCard, getSetStats } from '$lib/stores/progress.js';

	let { data } = $props();
	const slug = $derived(data.slug);
	const mode = $derived(data.mode);
	const set = $derived(data.set);
	const direction = $derived(data.direction);

	// Build card list: term = shown on front, translation = revealed on back.
	const toCard = (c) =>
		direction === 'ar-tl'
			? { term: c.arabic, translation: c.translation }
			: { term: c.translation, translation: c.arabic };

	function fisherYates(arr) {
		const a = [...arr];
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}

	// origIdx preserves the card's position in the source JSON so we can
	// re-map to new translation data when the locale changes mid-session.
	const rawCards = set.cards.map((c, i) => ({ ...toCard(c), origIdx: i }));

	// Scored modes start pre-shuffled; SR uses due-card ordering; flashcard starts in order.
	const scoredMode = mode === 'multiple-choice' || mode === 'type-answer';
	let cards = $state(
		scoredMode ? fisherYates(rawCards) :
		mode === 'spaced-repetition' ? getDueCards(slug, rawCards) :
		rawCards
	);
	let index = $state(0);

	// ── Flashcard state ──────────────────────────────────────────────
	let flipped = $state(false);

	function flip() { flipped = !flipped; }

	function prev() {
		if (index > 0) { index -= 1; flipped = false; }
	}

	function next() {
		if (index < cards.length - 1) { index += 1; flipped = false; scrollTop(); }
	}

	function shuffle() {
		cards = fisherYates(cards);
		index = 0;
		flipped = false;
	}

	// ── Spaced repetition state ──────────────────────────────────────
	let srReviewed = $state(0);

	function handleSRAnswer(isCorrect) {
		markCard(slug, cards[index].originalIndex, isCorrect);
		srReviewed += 1;
		if (index === cards.length - 1) {
			done = true;
		} else {
			index += 1;
			scrollTop();
		}
	}

	// ── Scored mode state (multiple-choice + type-answer) ────────────
	let score = $state(0);
	let answered = $state(false);
	let done = $state(false);

	function buildOptions(cardList, i) {
		const correct = cardList[i].translation;
		const pool = fisherYates(
			cardList.filter((_, idx) => idx !== i).map((c) => c.translation)
		).slice(0, 3);
		return fisherYates([...pool, correct]);
	}

	let mcOptions = $state(mode === 'multiple-choice' ? buildOptions(cards, 0) : []);

	function handleAnswer(isCorrect) {
		if (isCorrect) score += 1;
		answered = true;
	}

	function advanceCard() {
		if (index === cards.length - 1) {
			done = true;
		} else {
			index += 1;
			answered = false;
			if (mode === 'multiple-choice') mcOptions = buildOptions(cards, index);
			scrollTop();
		}
	}

	// ── Locale-reactive card content ─────────────────────────────────
	const allModules = import.meta.glob('$lib/content/sets/*.json');
	let localeReady = false;

	$effect(() => {
		const loc = $locale;
		if (!localeReady) { localeReady = true; return; }

		let cancelled = false;
		async function reload() {
			const target = `${slug}.${loc}.json`;
			const fallback = `${slug}.en.json`;
			const entry =
				Object.entries(allModules).find(([p]) => p.split('/').at(-1) === target) ??
				Object.entries(allModules).find(([p]) => p.split('/').at(-1) === fallback);
			if (!entry) return;
			const m = await entry[1]();
			if (cancelled) return;
			const newSourceCards = m.default.cards;
			cards = cards.map((card) => {
				const src = newSourceCards[card.origIdx];
				const { term, translation } = toCard(src);
				return { ...card, term, translation };
			});
			if (mode === 'multiple-choice') mcOptions = buildOptions(cards, index);
		}
		reload();
		return () => { cancelled = true; };
	});

	// ── Shared ───────────────────────────────────────────────────────
	const current = $derived(cards[index]);
	const progress = $derived((index / cards.length) * 100);

	// SR fallback notice: studied cards exist but nothing is due today.
	const srStats = mode === 'spaced-repetition' ? getSetStats(slug, set.cards.length) : null;
	const srIsFallback = srStats !== null && srStats.studied > 0 && srStats.due === 0;

	// Mode key for <title> and nav chip.
	const modeKeys = {
		flashcard: 'set.modes.flashcard',
		'multiple-choice': 'set.modes.multiple_choice',
		'type-answer': 'set.modes.type_answer',
		'spaced-repetition': 'set.modes.spaced_repetition'
	};

	function scrollTop() {
		window.scrollTo({ top: 0, behavior: 'instant' });
	}
</script>

<svelte:window
	onkeydown={(e) => {
		if (mode !== 'flashcard') return;
		if (e.key === 'ArrowRight') next();
		else if (e.key === 'ArrowLeft') prev();
		else if (e.key === ' ') { e.preventDefault(); flip(); }
	}}
/>

<svelte:head>
	<title>{$t(`sets.${slug}.title`)} · {$t(modeKeys[mode])} — Arabic Flashcards</title>
</svelte:head>

{#if done}
	<!-- ── Results screen ── -->
	<main>
		<nav>
			<a href="/sets/{slug}" class="back">← {$t(`sets.${slug}.title`)}</a>
		</nav>

		{#if mode === 'spaced-repetition'}
			<div class="results">
				<p class="results-label">{$t('study.results.done_sr')}</p>
				<p class="results-score">{srReviewed}</p>
				<p class="results-pct">{$t('study.results.reviewed', { values: { count: srReviewed } })}</p>
				<div class="results-actions">
					<a href="/sets/{slug}" class="nav-btn">{$t('study.results.back')}</a>
					<a href="/study/{slug}/spaced-repetition?direction={direction}" class="nav-btn primary">
						{$t('study.results.again_sr')}
					</a>
				</div>
			</div>
		{:else}
			<div class="results">
				<p class="results-label">{$t('study.results.done')}</p>
				<p class="results-score">{score} / {cards.length}</p>
				<p class="results-pct">{$t('study.results.pct', { values: { pct: Math.round((score / cards.length) * 100) } })}</p>
				<div class="results-actions">
					<a href="/sets/{slug}" class="nav-btn">{$t('study.results.back')}</a>
					<a href="/study/{slug}/{mode}?direction={direction}" class="nav-btn primary">
						{$t('study.results.again')}
					</a>
				</div>
			</div>
		{/if}
	</main>
{:else}
	<main>
		<nav>
			<a href="/sets/{slug}" class="back">← {$t(`sets.${slug}.title`)}</a>
			{#if mode === 'flashcard'}
				<button class="shuffle-btn" onclick={shuffle} title={$t('study.shuffle_title')}>
					{$t('study.shuffle')}
				</button>
			{:else if mode === 'spaced-repetition'}
				<span class="score-chip">{$t('study.due_chip', { values: { count: cards.length } })}</span>
			{:else}
				<span class="score-chip">{$t('study.correct_chip', { values: { count: score } })}</span>
			{/if}
		</nav>

		<div class="counter">{index + 1} / {cards.length}</div>

		<div class="progress-bar" role="progressbar" aria-valuenow={index + 1} aria-valuemax={cards.length}>
			<div class="progress-fill" style="width: {progress}%"></div>
		</div>

		{#if srIsFallback}
			<p class="sr-notice">{$t('study.no_due')}</p>
		{/if}

		{#if mode === 'flashcard'}
			<div class="card-area">
				<Flashcard
					term={current.term}
					translation={current.translation}
					{flipped}
					onclick={flip}
				/>
				<p class="hint">{$t('study.flip_hint')}</p>
			</div>

			<div class="controls">
				<button class="nav-btn" onclick={prev} disabled={index === 0}>{$t('study.prev')}</button>
				<button class="nav-btn" onclick={next} disabled={index === cards.length - 1}>{$t('study.next')}</button>
			</div>

		{:else if mode === 'multiple-choice'}
			<div class="card-area">
				{#key index}
					<MultipleChoice
						term={current.term}
						options={mcOptions}
						correctAnswer={current.translation}
						onAnswer={handleAnswer}
					/>
				{/key}
			</div>

			{#if answered}
				<div class="controls">
					<button class="nav-btn primary" onclick={advanceCard}>
						{index === cards.length - 1 ? $t('study.see_results') : $t('study.next')}
					</button>
				</div>
			{/if}

		{:else if mode === 'type-answer'}
			<div class="card-area">
				{#key index}
					<TypeAnswer
						term={current.term}
						correctAnswer={current.translation}
						onAnswer={handleAnswer}
					/>
				{/key}
			</div>

			{#if answered}
				<div class="controls">
					<button class="nav-btn primary" onclick={advanceCard}>
						{index === cards.length - 1 ? $t('study.see_results') : $t('study.next')}
					</button>
				</div>
			{/if}

		{:else if mode === 'spaced-repetition'}
			<div class="card-area">
				{#key index}
					<SpacedRepetition
						term={current.term}
						translation={current.translation}
						onAnswer={handleSRAnswer}
					/>
				{/key}
			</div>
		{/if}
	</main>
{/if}

<style>
	main {
		max-width: 680px;
		margin: 0 auto;
		padding: 2rem 1.5rem 4rem;
	}

	nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.5rem;
	}

	.back {
		color: var(--muted);
		text-decoration: none;
		font-size: 0.875rem;
	}

	.back:hover {
		color: var(--text);
	}

	.shuffle-btn {
		background: none;
		border: 1px solid var(--border);
		border-radius: 999px;
		color: var(--muted);
		font-family: inherit;
		font-size: 0.8125rem;
		padding: 0.3rem 0.875rem;
		cursor: pointer;
		transition: border-color 0.15s, color 0.15s;
	}

	.shuffle-btn:hover {
		border-color: var(--gold);
		color: var(--gold);
	}

	.score-chip {
		font-size: 0.8125rem;
		color: var(--green-text);
	}

	.counter {
		text-align: center;
		font-size: 0.8125rem;
		color: var(--muted);
		margin-bottom: 0.625rem;
	}

	.progress-bar {
		height: 4px;
		background: var(--surface2);
		border-radius: 999px;
		overflow: hidden;
		margin-bottom: 2.5rem;
	}

	.progress-fill {
		height: 100%;
		background: var(--gold);
		border-radius: 999px;
		transition: width 0.25s ease;
	}

	.sr-notice {
		text-align: center;
		font-size: 0.8125rem;
		color: var(--muted);
		margin-bottom: 1.5rem;
		margin-top: -1.5rem;
	}

	.card-area {
		margin-bottom: 1.75rem;
	}

	.hint {
		text-align: center;
		font-size: 0.75rem;
		color: var(--muted);
		margin-top: 0.875rem;
	}

	.controls {
		display: flex;
		justify-content: center;
		gap: 1rem;
	}

	.nav-btn {
		padding: 0.625rem 1.75rem;
		border-radius: var(--radius);
		border: 1px solid var(--border);
		background: var(--surface);
		color: var(--text);
		font-family: inherit;
		font-size: 0.9375rem;
		text-decoration: none;
		cursor: pointer;
		transition: border-color 0.15s, background 0.15s;
		display: inline-block;
	}

	.nav-btn:hover:not(:disabled) {
		border-color: var(--gold);
		background: var(--surface2);
	}

	.nav-btn:disabled {
		opacity: 0.3;
		cursor: default;
	}

	.nav-btn.primary {
		border-color: var(--gold);
		color: var(--gold);
	}

	.nav-btn.primary:hover {
		background: var(--surface2);
	}

	/* ── Results ── */

	.results {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 4rem 0 2rem;
		text-align: center;
	}

	.results-label {
		font-size: 0.875rem;
		color: var(--muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.results-score {
		font-size: 4rem;
		font-weight: 600;
		color: var(--gold);
		line-height: 1;
	}

	.results-pct {
		font-size: 1rem;
		color: var(--green-text);
		margin-bottom: 1rem;
	}

	.results-actions {
		display: flex;
		gap: 1rem;
	}

	@media (max-width: 480px) {
		main {
			padding: 1.25rem 1rem 3rem;
		}

		.controls {
			flex-direction: column;
			align-items: stretch;
		}

		.nav-btn {
			text-align: center;
		}
	}
</style>
