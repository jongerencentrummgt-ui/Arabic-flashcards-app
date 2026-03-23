<script>
	let { term, translation, flipped, onclick } = $props();

	// Detect which side is Arabic by checking for Arabic Unicode block characters.
	// Arabic characters fall in the range U+0600–U+06FF.
	const isArabic = (str) => /[\u0600-\u06FF]/.test(str);
</script>

<div class="scene" {onclick}>
	<div class="card" class:flipped>
		<div class="face front">
			<span
				class:arabic={isArabic(term)}
				lang={isArabic(term) ? 'ar' : undefined}
			>{term}</span>
		</div>
		<div class="face back">
			<span
				class:arabic={isArabic(translation)}
				lang={isArabic(translation) ? 'ar' : undefined}
			>{translation}</span>
		</div>
	</div>
</div>

<style>
	.scene {
		width: 100%;
		max-width: 560px;
		aspect-ratio: 3 / 2;
		min-height: 180px;
		perspective: 1000px;
		cursor: pointer;
		margin: 0 auto;
	}

	.card {
		width: 100%;
		height: 100%;
		position: relative;
		transform-style: preserve-3d;
		transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.card.flipped {
		transform: rotateY(180deg);
	}

	.face {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
	}

	.face.back {
		transform: rotateY(180deg);
		background: var(--surface2);
		border-color: var(--gold);
	}

	span {
		font-size: 1.5rem;
		font-weight: 500;
		color: var(--text);
		text-align: center;
		line-height: 1.4;
	}

	span.arabic {
		font-family: 'Amiri', serif;
		font-size: 2rem;
		color: var(--cream);
		direction: rtl;
	}
</style>
