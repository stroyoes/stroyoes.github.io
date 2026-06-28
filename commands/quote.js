// Reads from data/quotes.json

async function cmd_quote() {
    let quotes;
    try {
        const res = await fetch('data/quotes.json');
        quotes = await res.json();
    } catch {
        _log_print_err('quote: could not /oad data/quotes.json');
        return;
    }

    if (!quotes || quotes.length === 0) {
        print_output(`<span class="muted">[ no quotes yet ]</span>`);
        return;
    }

    const q = quotes[Math.floor(Math.random() * quotes.length)];
    print_output(`
<div class="quote-block">
  <div class="quote-text">${_esc_the_html(q.text)}</div>
  <div class="quote-author">— ${_esc_the_html(q.author)}</div>
</div>
    `);
}
