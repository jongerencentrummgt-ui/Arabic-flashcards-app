<script>
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/stores';

	let { children } = $props();

	// View Transitions API — graceful no-op in browsers that don't support it.
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<title>Arabic Flashcards</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="topnav">
	<a href="/" class="logo">🕌 Arabic Flashcards</a>
	{#if $page.url.pathname !== '/'}
		<a href="/" class="nav-home">Home</a>
	{/if}
</header>

{@render children()}

<style>
	.topnav {
		position: sticky;
		top: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 1.5rem;
		height: 52px;
		background: var(--bg);
		border-bottom: 1px solid var(--border);
	}

	.logo {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--gold-light);
		text-decoration: none;
		letter-spacing: 0.01em;
	}

	.logo:hover {
		color: var(--gold);
	}

	.nav-home {
		font-size: 0.875rem;
		color: var(--muted);
		text-decoration: none;
		transition: color 0.15s;
	}

	.nav-home:hover {
		color: var(--text);
	}
</style>
