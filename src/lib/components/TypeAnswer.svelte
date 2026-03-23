<script>
	import { t } from 'svelte-i18n';

	let { term, correctAnswer, onAnswer } = $props();

	let value = $state('');
	let result = $state(null); // null | 'correct' | 'wrong'

	const isArabic = (str) => /[\u0600-\u06FF]/.test(str);

	// Normalize for fuzzy comparison: trim, lowercase, strip diacritics.
	function normalize(str) {
		return str
			.trim()
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '');
	}

	function submit() {
		if (result !== null || !value.trim()) return;
		const correct = normalize(value) === normalize(correctAnswer);
		result = correct ? 'correct' : 'wrong';
		onAnswer(correct);
	}

	function onKeydown(e) {
		if (e.key === 'Enter') submit();
	}

	const inputIsArabic = isArabic(correctAnswer);
</script>

<div class="ta">
	<div class="term" class:arabic={isArabic(term)} lang={isArabic(term) ? 'ar' : undefined}>
		{term}
	</div>

	<div class="input-row">
		<input
			type="text"
			bind:value
			onkeydown={onKeydown}
			disabled={result !== null}
			dir={inputIsArabic ? 'rtl' : 'ltr'}
			lang={inputIsArabic ? 'ar' : undefined}
			class:arabic={inputIsArabic}
			placeholder={inputIsArabic ? $t('type_answer.placeholder_ar') : $t('type_answer.placeholder')}
			autofocus
		/>
		<button class="submit-btn" onclick={submit} disabled={result !== null || !value.trim()}>
			{$t('type_answer.submit')}
		</button>
	</div>

	{#if result !== null}
		<div class="feedback" class:correct={result === 'correct'} class:wrong={result === 'wrong'}>
			{#if result === 'correct'}
				<span class="icon">✓</span> {$t('type_answer.correct')}
			{:else}
				<span class="icon">✗</span> {$t('type_answer.incorrect')}
				<span
					class:arabic={isArabic(correctAnswer)}
					lang={isArabic(correctAnswer) ? 'ar' : undefined}
				>
					{correctAnswer}
				</span>
			{/if}
		</div>
	{/if}
</div>

<style>
	.ta {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
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

	.input-row {
		display: flex;
		gap: 0.625rem;
	}

	input {
		flex: 1;
		padding: 0.75rem 1rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		color: var(--text);
		font-family: inherit;
		font-size: 1rem;
		outline: none;
		transition: border-color 0.15s;
	}

	input.arabic {
		font-family: 'Amiri', serif;
		font-size: 1.25rem;
	}

	input:focus {
		border-color: var(--gold);
	}

	input:disabled {
		opacity: 0.6;
	}

	input::placeholder {
		color: var(--muted);
	}

	.submit-btn {
		padding: 0.75rem 1.25rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		color: var(--text);
		font-family: inherit;
		font-size: 0.9375rem;
		cursor: pointer;
		white-space: nowrap;
		transition: border-color 0.15s, background 0.15s;
	}

	.submit-btn:hover:not(:disabled) {
		border-color: var(--gold);
		background: var(--surface2);
	}

	.submit-btn:disabled {
		opacity: 0.35;
		cursor: default;
	}

	.feedback {
		padding: 0.875rem 1.25rem;
		border-radius: var(--radius);
		border: 1px solid;
		font-size: 0.9375rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.feedback.correct {
		border-color: var(--green-text);
		background: rgba(168, 216, 176, 0.1);
		color: var(--green-text);
	}

	.feedback.wrong {
		border-color: #e07070;
		background: rgba(224, 112, 112, 0.1);
		color: #e07070;
	}

	.icon {
		font-style: normal;
		font-weight: 600;
	}

	span.arabic {
		font-family: 'Amiri', serif;
		font-size: 1.125rem;
		direction: rtl;
		display: block;
	}
</style>
