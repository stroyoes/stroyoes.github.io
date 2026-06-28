// Reads from data/now.json

async function cmd_now() {
    let data;
    try {
        const res = await fetch('data/now.json');
        data = await res.json();
    } catch {
        _log_print_err('now: could not load data/now.json');
        return;
    }

    const rows = [];

    if (data.reading && data.reading.length > 0) {
        data.reading.forEach(b => {
            rows.push(`
                <div class="now-row">
                    <span class="now-label">reading</span>
                    <span class="now-value">${_esc_the_html(b.title)} — ${_esc_the_html(b.author)}</span>
                </div>`);
        });
    }

    if (data.building && data.building.length > 0) {
        data.building.forEach(b => {
            rows.push(`
                <div class="now-row">
                    <span class="now-label">building</span>
                    <span class="now-value">${_esc_the_html(b)}</span>
                </div>`);
        });
    }

    if (data.listening && data.listening.length > 0) {
        data.listening.forEach(b => {
            rows.push(`
                <div class="now-row">
                    <span class="now-label">listening</span>
                    <span class="now-value">${_esc_the_html(b)}</span>
                </div>`);
        });
    }

    if (rows.length === 0) {
        print_output(`<span class="muted">[ nothing here yet ]</span>`);
        return;
    }

    print_output(`<div class="now-block">${rows.join('')}</div>`);
}
