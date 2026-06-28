// terminal/input.js
// keyboard and click handling

input.addEventListener('keydown', e => {

    // ed mode (normal ed + ed:replace)
    if (get_mode() === 'ed' || get_mode() === 'ed:replace') {
        if (e.key === 'Enter') {
            const val = input.value;
            input.value = '';
            const div = document.createElement('div');
            div.className = 'cmd-echo';
            div.textContent = val;
            output.appendChild(div);
            ed_handle_line(val);
            _go_loww();
        }
        return; // swallow history/tab in ed modes
    }

    // normal mode 
    if (e.key === 'Enter') {
        const val = input.value;
        input.value = '';
        dispatch(val);
        _go_loww();
        return;
    }

    if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = history_up();
        if (prev !== null) input.value = prev;
        return;
    }

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        input.value = history_down();
        return;
    }

    if (e.key === 'Tab') {
        e.preventDefault();
        tab_completion();
        return;
    }

    // Ctrl+C — cancel current input
    if (e.key === 'c' && e.ctrlKey) {
        if (input.value) {
            show_prompt(input.value + ' ^C');
            input.value = '';
        }
        return;
    }

    // Ctrl+L — clear screen
    if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault();
        output.innerHTML = '';
        _append_the_banner();
        return;
    }

});

// click anywhere to focus input
document.addEventListener('click', () => input.focus());
