// Reads the command and routes it to the right function

function dispatch(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    history_push(trimmed);
    history_reset();

    show_prompt(trimmed);

    const { cmd, args, flags } = _parse_the_input(trimmed);

    switch (cmd) {

        case 'help':
            print_output(cmd_help());
            break;

        case 'clear':
            output.innerHTML = '';
            _append_the_banner();
            break;

        case 'whoami':
            print_output(cmd_whoami());
            break;

        case 'now':
            cmd_now(); // async, handles its own print_output
            break;

        case 'history':
            print_output(cmd_history());
            break;

        case 'quote':
            cmd_quote(); // async, handles its own print_output
            break;

        case 'ls':
            cmd_ls(args); // async, handles its own print_output
            break;

        case 'cd':
            cmd_cd(args); // async, handles its own print_output
            break;

        case 'cat':
            cmd_cat(args); // async, handles its own print_output
            break;

        case 'ed':
        case 'vim':
            enter_ed(args[0] || 'untitled');
            break;

        case 'sliddeee':
            if (flags.includes('--help')) {
                print_output(_sliddeee_help());
            } else {
                _start_sliddeee(flags);
            }
            break;

        default:
            _log_print_err(`command not found: ${cmd}  (try 'help')`);
    }
}

// splits "cat books/2024 --flag" into { cmd, args, flags }
function _parse_the_input(raw) {
    const parts = raw.trim().split(/\s+/);
    const cmd   = parts[0].toLowerCase();
    const args  = [];
    const flags = [];

    for (let i = 1; i < parts.length; i++) {
        if (parts[i].startsWith('-')) {
            flags.push(parts[i].toLowerCase());
        } else {
            args.push(parts[i]);
        }
    }

    return { cmd, args, flags };
}

// stubs
function _sliddeee_help() {
    return `
<table class="help-table">
  <tbody>
    <tr><td>sliddeee</td><td>car (default)</td></tr>
    <tr><td>sliddeee --cart</td><td>shopping cart</td></tr>
    <tr><td>sliddeee --baby</td><td>baby carriage</td></tr>
    <tr><td>sliddeee --moto</td><td>motorcycle</td></tr>
  </tbody>
</table>
<p style="margin-top:0.6rem;color:var(--muted);font-size:0.85rem;">arrow keys to move · up to bounce</p>
`;
}

function _start_sliddeee(flags) {
    _log_print_info('sliddeee — coming soon.');
}
