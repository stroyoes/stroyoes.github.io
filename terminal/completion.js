// Does the terminal tab completion

const COMMANDS = [
    'help', 'clear', 'whoami', 'now', 'history',
    'quote', 'ed', 'sliddeee',
    'ls', 'cat', 'cd',
];

// some paths we know already for doing the completion
const PATHS = {
    'ls ':        ['books/'],
    'cd ':        ['books/'],
    'cat ':       ['books/reading-now'],
    'ls books/':  ['2022', '2023', '2024', '2025'],
    'cat books/': ['reading-now', '2022/', '2023/', '2024/', '2025/'],
};

// some known flags for the commands
const FLAGS = {
    'sliddeee ':  ['--cart', '--baby', '--moto'],
    'sliddeee -': ['--cart', '--baby', '--moto'],
};

function tab_completion() {
    const val = input.value;
    if (!val) return;

    // do the flag completions
    for (const prefix of Object.keys(FLAGS)) {
        if (val.startsWith(prefix)) {
            const rest_of_them     = val.slice(prefix.length);
            const matches_to_them  = FLAGS[prefix].filter(f => f.startsWith('--' + rest_of_them.replace(/^-+/, '')));

            if (matches_to_them.length === 1) {
                input.value = prefix + matches_to_them[0];
            } else if (matches_to_them.length > 1) {
                show_prompt(val);
                print_output(matches_to_them.join('&nbsp;&nbsp;&nbsp;'));
                _go_loww();
            }
            return;
        }
    }

    // do the path completion
    for (const prefix of Object.keys(PATHS)) {
        if (val.startsWith(prefix)) {
            const rest_of_them    = val.slice(prefix.length);
            const matches_to_them = PATHS[prefix].filter(p => p.startsWith(rest_of_them));

            if (matches_to_them.length === 1) {
                input.value = prefix + matches_to_them[0];
            } else if (matches_to_them.length > 1) {
                show_prompt(val);
                print_output(matches_to_them.join('&nbsp;&nbsp;&nbsp;'));
                _go_loww();
            }
            return;
        }
    }

    // do the command completion
    const matches_to_them = COMMANDS.filter(c => c.startsWith(val));
    if (matches_to_them.length === 1) {
        input.value = matches_to_them[0] + ' ';
    } else if (matches_to_them.length > 1) {
        show_prompt(val);
        print_output(matches_to_them.join('&nbsp;&nbsp;&nbsp;'));
        _go_loww();
    }
}
