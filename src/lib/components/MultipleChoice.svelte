<script>
	let { term, options, correctAnswer, onAnswer } = $props();

	let selected = $state(null);

	const answered = $derived(selected !== null);

	// Arabic detection (same rule as Flashcard.svelte)
	const isArabic = (str) => /[\u0600-\u06FF]/.test(str);

	function choose(opt) {
		if (answered) return;
		selected = opt;
		onAnswer(opt === correctAnswer);
	}

	function status(opt) {
		if (!answered) return 'idle';
		if (opt === correctAnswer) return 'correct';
		if (opt === selected) return 'wrong';
		return 'idle';
	}
</script>

<div class="mc">
	<div class="term" class:arabic={isArabic(term)} lang={isArabic(term) ? 'ar' : undefined}>
		{term}
	</div>

	<ul class="options">
		{#each options as opt}
			<li>
				<button
					class="option"
					class:correct={status(opt) === 'correct'}
					class:wrong={status(opt) === 'wrong'}
					disabled={answered}
					onclick={() => choose(opt)}
				>
					<span class:arabic={isArabic(opt)} lang={isArabic(opt) ? 'ar' : undefined}>
						{opt}
					</span>
				</button>
			</li>
		{/each}
	</ul>
</div>

<style>
	.mc {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.term {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 2rem 1.5rem;
		font-size: 1.5rem;
		font-weight: 500;
		color: var(--text);
		text-align: center;
		min-height: 7rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.term.arabic {
		font-family: 'Amiri', serif;
		font-size: 2rem;
		color: var(--cream);
		direction: rtl;
	}

	.options {
		list-style: none;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
	}

	.option {
		width: 100%;
		padding: 0.875rem 1rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		color: var(--text);
		font-family: inherit;
		font-size: 0.9375rem;
		cursor: pointer;
		text-align: center;
		transition: border-color 0.15s, background 0.15s;
		min-height: 3.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.option:hover:not(:disabled) {
		border-color: var(--gold);
		background: var(--surface2);
	}

	.option:disabled {
		cursor: default;
	}

	.option.correct {
		border-color: var(--green-text);
		background: rgba(168, 216, 176, 0.12);
		color: var(--green-text);
	}

	.option.wrong {
		border-color: #e07070;
		background: rgba(224, 112, 112, 0.12);
		color: #e07070;
	}

	span.arabic {
		font-family: 'Amiri', serif;
		font-size: 1.25rem;
		direction: rtl;
		display: block;
	}
</style>
