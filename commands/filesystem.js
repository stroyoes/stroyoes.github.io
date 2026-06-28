// Virtual filesystem — data loaded from data/books.json

let _fs_books_data = null; // cache after first fetch

async function _load_books_data() {
    if (_fs_books_data) return _fs_books_data;
    try {
        const res    = await fetch('data/books.json');
        _fs_books_data = await res.json();
        return _fs_books_data;
    } catch {
        return null;
    }
}

// tracks current virtual directory
let _current_path = '~';

// ls 
async function cmd_ls(args) {
    const target = (args[0] || '').trim();

    // ls with no args or ls books/
    if (!target || target === 'books' || target === 'books/') {
        const data = await _load_books_data();
        if (!data) { print_output(_fs_err_str('ls: could not load books data')); return; }

        const keys = Object.keys(data);
        print_output(keys.map(k => {
            const is_dir = k !== 'reading-now';
            return `<span class="${is_dir ? 'accent' : 'fg'}">${k}${is_dir ? '/' : ''}</span>`;
        }).join('&nbsp;&nbsp;&nbsp;'));
        return;
    }

    // ls books/2024 etc
    if (target.startsWith('books/')) {
        const year = target.replace('books/', '').replace('/', '');
        const data = await _load_books_data();
        if (!data) { print_output(_fs_err_str('ls: could not load books data')); return; }
        if (!data[year]) { print_output(_fs_err_str(`ls: '${target}': no such directory`)); return; }

        const entries = data[year];
        if (!entries || entries.length === 0) {
            print_output(`<span class="muted">(empty)</span>`);
            return;
        }
        print_output(entries.map((b, i) =>
            `<div class="fs-book">
                <span class="hist-idx">${String(i).padStart(2, ' ')}</span>
                <span class="accent">${_esc_the_html(b.title)}</span>
                <span class="muted">— ${_esc_the_html(b.author)}</span>
                ${b.rating ? `<span class="now-label">&nbsp;${_esc_the_html(b.rating)}</span>` : ''}
            </div>`
        ).join(''));
        return;
    }

    print_output(_fs_err_str(`ls: '${target}': no such directory`));
}

// cd
async function cmd_cd(args) {
    const target = (args[0] || '~').trim();

    if (target === '~') {
        _current_path = '~';
        _update_prompt_path('~');
        return;
    }

    if (target === 'books' || target === 'books/') {
        _current_path = '~/books';
        _update_prompt_path('~/books');
        return;
    }

    if (target.startsWith('books/')) {
        const year = target.replace('books/', '').replace('/', '');
        const data = await _load_books_data();
        if (!data) { print_output(_fs_err_str('cd: could not load books data')); return; }
        if (!data[year]) { print_output(_fs_err_str(`cd: '${target}': no such directory`)); return; }
        _current_path = `~/books/${year}`;
        _update_prompt_path(_current_path);
        return;
    }

    print_output(_fs_err_str(`cd: '${target}': no such directory`));
}

// cat 
async function cmd_cat(args) {
    const target = (args[0] || '').trim();
    if (!target) { print_output(_fs_err_str('cat: missing filename')); return; }

    const data = await _load_books_data();
    if (!data) { print_output(_fs_err_str('cat: could not load books data')); return; }

    // cat books/reading-now or just reading-now if inside books/
    const key = target.replace('books/', '');

    if (!data[key]) {
        print_output(_fs_err_str(`cat: '${target}': no such file`));
        return;
    }

    const entries = data[key];

    if (!entries || entries.length === 0) {
        print_output(`<span class="muted">(empty)</span>`);
        return;
    }

    print_output(entries.map((b, i) =>
        `<div class="fs-book">
            <span class="hist-idx">${String(i).padStart(2, ' ')}</span>
            <span class="accent">${_esc_the_html(b.title)}</span>
            <span class="muted">— ${_esc_the_html(b.author)}</span>
            ${b.rating ? `<span class="now-label">&nbsp;${_esc_the_html(b.rating)}</span>` : ''}
        </div>`
    ).join(''));
}

// helpers
function _update_prompt_path(p) {
    const el = document.querySelector('.prompt-path');
    if (el) el.textContent = p;
}

function _fs_err_str(msg) {
    return `<span class="err">${_esc_the_html(msg)}</span>`;
}
