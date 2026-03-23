const KEY_PREFIX = 'arabic-flashcards:progress:';

function storageKey(slug) {
	return KEY_PREFIX + slug;
}

// YYYY-MM-DD in local time (avoids UTC-offset issues with toISOString).
function localDate(date = new Date()) {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, '0');
	const d = String(date.getDate()).padStart(2, '0');
	return `${y}-${m}-${d}`;
}

function addDays(n) {
	const d = new Date();
	d.setDate(d.getDate() + n);
	return localDate(d);
}

/** Returns the raw progress map for a slug: { [cardIndex]: { interval, due } } */
export function getProgress(slug) {
	if (typeof localStorage === 'undefined') return {};
	try {
		const raw = localStorage.getItem(storageKey(slug));
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
}

function saveProgress(slug, data) {
	try {
		localStorage.setItem(storageKey(slug), JSON.stringify(data));
	} catch {
		// Storage unavailable or full — silently skip.
	}
}

/**
 * Record a card result and update its schedule.
 * Correct → interval doubles (0 → 1 → 2 → 4 → 8 days)
 * Wrong   → reset to interval 1 (due tomorrow)
 */
export function markCard(slug, cardIndex, isCorrect) {
	const data = getProgress(slug);
	const prev = data[cardIndex];
	const prevInterval = prev?.interval ?? 0;

	const interval = isCorrect ? (prevInterval === 0 ? 1 : prevInterval * 2) : 1;
	data[cardIndex] = { interval, due: addDays(interval) };

	saveProgress(slug, data);
}

/**
 * Returns aggregate stats for a set.
 * - studied:  cards seen at least once (any entry exists, since interval is always ≥ 1)
 * - due:      cards due today or overdue
 * - mastered: cards with interval ≥ 8 days
 */
export function getSetStats(slug, totalCards) {
	const data = getProgress(slug);
	const today = localDate();
	const entries = Object.values(data);

	return {
		studied: entries.length,
		due: entries.filter((e) => e.due <= today).length,
		mastered: entries.filter((e) => e.interval >= 8).length,
		total: totalCards
	};
}

/**
 * Returns the subset of cards due today or overdue, sorted earliest-due first.
 * Each returned card gets an `originalIndex` field (its position in the source array)
 * so the page can call markCard with the right index.
 * Falls back to all cards if nothing is due.
 */
export function getDueCards(slug, cards) {
	const data = getProgress(slug);
	const today = localDate();

	const annotated = cards.map((card, i) => ({
		...card,
		originalIndex: i,
		_entry: data[i]
	}));

	const due = annotated
		.filter(({ _entry }) => !_entry || _entry.due <= today)
		.sort((a, b) => {
			// Never-seen cards go after overdue cards.
			if (!a._entry && !b._entry) return 0;
			if (!a._entry) return 1;
			if (!b._entry) return -1;
			return a._entry.due.localeCompare(b._entry.due);
		});

	const result = due.length > 0 ? due : annotated;

	// Strip the internal _entry field before returning.
	return result.map(({ _entry: _, ...card }) => card);
}
