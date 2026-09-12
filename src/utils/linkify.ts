const URL_PATTERN = /(https?:\/\/[^\s]+)/g;

/**
 * Renders `text` into `containerEl`, turning any http(s) URL into a clickable
 * link that opens externally. Everything else is plain text — this is not a
 * full markdown renderer, just enough to make pasted links usable.
 */
export function renderTextWithLinks(containerEl: HTMLElement, text: string): void {
	let lastIndex = 0;
	URL_PATTERN.lastIndex = 0;

	let match: RegExpExecArray | null;
	while ((match = URL_PATTERN.exec(text)) !== null) {
		if (match.index > lastIndex) {
			containerEl.appendText(text.slice(lastIndex, match.index));
		}

		let url = match[0];
		const trailingPunctuation = /[.,;:!?)\]]+$/;
		const trimmed = url.match(trailingPunctuation);
		if (trimmed) url = url.slice(0, url.length - trimmed[0].length);

		containerEl.createEl("a", {
			text: url,
			href: url,
			attr: { target: "_blank", rel: "noopener" },
		});

		if (trimmed) containerEl.appendText(trimmed[0]);

		lastIndex = match.index + match[0].length;
	}

	if (lastIndex < text.length) {
		containerEl.appendText(text.slice(lastIndex));
	}
}
