// Use local storage for storing the command histories

const HISTORY_KEY = 'notstr0y_cmd_history';
const MAX_HISTORY  = 100;

let commands_in_history = _load_the_history();
let _history_index      = -1;

function _load_the_history() {
    try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch {
        return [];
    }
}

function _save_the_history() {
    try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(commands_in_history));
    } catch {
        // storage isn't available, skip silently
    }
}

// push a new command into history
function history_push(cmd) {
    if (commands_in_history[0] === cmd) return; // skip duplicate consecutive entries
    commands_in_history.unshift(cmd);
    if (commands_in_history.length > MAX_HISTORY) commands_in_history.pop();
    _save_the_history();
}

function history_up() {
    if (_history_index < commands_in_history.length - 1) {
        _history_index++;
        return commands_in_history[_history_index];
    }
    return null;
}

function history_down() {
    if (_history_index > 0) {
        _history_index--;
        return commands_in_history[_history_index];
    }
    _history_index = -1;
    return '';
}

function history_reset() {
    _history_index = -1;
}

function history_clear() {
    commands_in_history = [];
    _history_index      = -1;
    try { localStorage.removeItem(HISTORY_KEY); } catch { /* silent */ }
}
