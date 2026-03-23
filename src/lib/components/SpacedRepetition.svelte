<script>
	import { t } from 'svelte-i18n';
	import Flashcard from './Flashcard.svelte';

	let { term, translation, onAnswer } = $props();

	let flipped = $state(false);

	// Only allow flipping to the back — rating locks the card state.
	function flip() {
		if (!flipped) flipped = true;
	}
</script>

<div class="sr">
	<Flashcard {term} {translation} {flipped} onclick={flip} />

	{#if !flipped}
		<p class="hint">{$t('spaced_rep.hint')}</p>
	{:else}
		<div class="rating">
			<button class="miss" onclick={() => onAnswer(false)}>
				<span class="icon">✗</span> {$t('spaced_rep.missed')}
			</button>
			<button class="got" onclick={() => onAnswer(true)}>
				<span class="icon">✓</span> {$t('spaced_rep.got_it')}
			</button>
		</div>
	{/if}
</div>

<svelte:window
	onkeydown={(e) => {
		if (e.key === ' ') { e.preventDefault(); flip(); }
	}}
/>

<style>
	.sr {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.hint {
		text-align: center;
		font-size: 0.75rem;
		color: var(--muted);
	}

	.rating {
		display: flex;
		gap: 1rem;
		justify-content: center;
	}

	.rating button {
		flex: 1;
		max-width: 200px;
		padding: 0.75rem 1.25rem;
		border-radius: var(--radius);
		border: 1px solid var(--border);
		background: var(--surface);
		font-family: inherit;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		transition: border-color 0.15s, background 0.15s, color 0.15s;
	}

	.icon {
		font-style: normal;
	}

	.miss {
		color: #e07070;
	}

	.miss:hover {
		border-color: #e07070;
		background: rgba(224, 112, 112, 0.1);
	}

	.got {
		color: var(--green-text);
	}

	.got:hover {
		border-color: var(--green-text);
		background: rgba(168, 216, 176, 0.1);
	}
</style>
