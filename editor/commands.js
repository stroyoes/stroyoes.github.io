// All @ed: command handlers including :r

function ed_handle_line(line) {
    const trimmed = line.trim();

    // replace await mode 
    if (_ed_mode === 'ed:replace') {
        _ed_apply_replace(line);
        return;
    }

    // @ed: commands
    if (trimmed.startsWith('@ed:')) {
        const parts = trimmed.split(':');

        switch (parts[1]) {

            case 'q':
                _log_print_info('ed: quit.');
                exit_ed();
                break;

            case 's':
                _ed_save(); // save only, do NOT exit
                break;

            case 'p':
                _ed_print();
                break;

            case 'd':
                _ed_delete_last();
                break;

            case 'r':
                _ed_init_replace(parts);
                break;

            default:
                _print_ed_err(`ed: unknown command — ${trimmed}`);
        }
        return;
    }

    // regular line — just accumulate 
    _ed_lines.push(line);
}

// print buffer
function _ed_print() {
    if (_ed_lines.length === 0) {
        _log_print_info('ed: buffer empty.');
        return;
    }
    print_output(
        _ed_lines
            .map((l, i) => `<span class="info">${i}</span>  ${_esc_the_html(l)}`)
            .join('<br>')
    );
}

// delete last line
function _ed_delete_last() {
    if (_ed_lines.length === 0) {
        _log_print_info('ed: buffer already empty.');
        return;
    }
    const removed = _ed_lines.pop();
    _log_print_info(`ed: deleted line ${_ed_lines.length} — "${removed}"`);
}

// replace: parse
function _ed_init_replace(parts) {
    if (parts.length < 4) {
        _print_ed_err('ed: usage — @ed:r:line:word  (use _ as wildcard)');
        return;
    }

    const line_str = parts[2];
    const word_str = parts[3];
    const line_idx = line_str === '_' ? '_' : parseInt(line_str, 10);
    const word_idx = word_str === '_' ? '_' : parseInt(word_str, 10);

    if (line_str !== '_' && isNaN(line_idx)) {
        _print_ed_err(`ed: invalid line index — "${line_str}"`);
        return;
    }
    if (word_str !== '_' && isNaN(word_idx)) {
        _print_ed_err(`ed: invalid word index — "${word_str}"`);
        return;
    }
    if (line_idx !== '_' && (line_idx < 0 || line_idx >= _ed_lines.length)) {
        _print_ed_err(`ed: line ${line_idx} out of buffer bounds (buffer has ${_ed_lines.length} line${_ed_lines.length !== 1 ? 's' : ''}, 0-indexed)`);
        return;
    }

    _ed_replace = { line_idx, word_idx };
    _ed_mode    = 'ed:replace';

    const hint = _build_replace_hint(line_idx, word_idx);
    _set_prompt_replace(hint);
    _log_print_info(`ed: type replacement and press Enter — ${hint}`);
}

function _build_replace_hint(line_idx, word_idx) {
    if (line_idx === '_' && word_idx === '_') return '[entire buffer]';
    if (line_idx === '_')                     return `[word ${word_idx} on every line]`;
    if (word_idx === '_')                     return `[entire line ${line_idx}]`;
    return `[line ${line_idx}, word ${word_idx}]`;
}

// replace: apply
function _ed_apply_replace(replacement) {
    const { line_idx, word_idx } = _ed_replace;
    let had_errors = false;

    if (line_idx === '_' && word_idx === '_') {
        _ed_lines = [replacement];
        _log_print_info('ed: replaced entire buffer.');

    } else if (word_idx === '_') {
        _ed_lines[line_idx] = replacement;
        _log_print_info(`ed: replaced line ${line_idx}.`);

    } else if (line_idx === '_') {
        _ed_lines = _ed_lines.map((line, i) => {
            const words = line.split(' ');
            if (word_idx >= words.length) {
                _print_ed_err(`ed: line ${i} — word ${word_idx} out of bounds (line has ${words.length} word${words.length !== 1 ? 's' : ''})`);
                had_errors = true;
                return line;
            }
            words[word_idx] = replacement;
            return words.join(' ');
        });
        if (!had_errors) _log_print_info(`ed: replaced word ${word_idx} on all lines.`);
        else             _log_print_info('ed: replacement done with errors above.');

    } else {
        const words = _ed_lines[line_idx].split(' ');
        if (word_idx >= words.length) {
            _print_ed_err(`ed: word ${word_idx} out of bounds on line ${line_idx} (line has ${words.length} word${words.length !== 1 ? 's' : ''})`);
        } else {
            words[word_idx] = replacement;
            _ed_lines[line_idx] = words.join(' ');
            _log_print_info(`ed: replaced word ${word_idx} on line ${line_idx}.`);
        }
    }

    _ed_replace = null;
    _ed_mode    = 'ed';
    _set_prompt_ed();
}

// ed error
function _print_ed_err(msg) {
    const div = document.createElement('div');
    div.className = 'output-block';
    div.innerHTML = `<span class="ed-err">${_esc_the_html(msg)}</span>`;
    output.appendChild(div);
}
