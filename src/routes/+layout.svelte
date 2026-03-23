<script>
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { t } from 'svelte-i18n';
	import { setupI18n, switchLocale, locale } from '$lib/i18n/index.js';
	import { initTheme, toggleTheme, theme } from '$lib/stores/theme.js';

	let { children } = $props();

	setupI18n();
	initTheme();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	const langs = ['EN', 'NL', 'TR'];
</script>

<svelte:head>
	<title>Arabic Flashcards</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="topnav">
	<a href="/" class="logo">{$t('nav.logo')}</a>

	<div class="nav-right">
		<div class="lang-switcher">
			{#each langs as lang}
				<button
					class:active={$locale === lang.toLowerCase()}
					onclick={() => switchLocale(lang.toLowerCase())}
				>
					{lang}
				</button>
			{/each}
		</div>

		<button class="theme-btn" onclick={toggleTheme} title="Toggle theme">
			{$theme === 'dark' ? '☀︎' : '☽'}
		</button>

		{#if $page.url.pathname !== '/'}
			<a href="/" class="nav-home">{$t('nav.home')}</a>
		{/if}
	</div>
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

	.nav-right {
		display: flex;
		align-items: center;
		gap: 1.25rem;
	}

	.lang-switcher {
		display: flex;
		gap: 0.125rem;
	}

	.lang-switcher button {
		background: none;
		border: none;
		padding: 0.25rem 0.5rem;
		font-family: inherit;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		color: var(--muted);
		cursor: pointer;
		border-radius: 4px;
		transition: color 0.15s;
	}

	.lang-switcher button:hover {
		color: var(--text);
	}

	.lang-switcher button.active {
		color: var(--gold-light);
	}

	.theme-btn {
		background: none;
		border: 1px solid var(--border);
		border-radius: 999px;
		padding: 0.25rem 0.625rem;
		font-size: 0.875rem;
		line-height: 1;
		color: var(--muted);
		font-family: inherit;
		cursor: pointer;
		transition: border-color 0.15s, color 0.15s;
	}

	.theme-btn:hover {
		border-color: var(--gold);
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
