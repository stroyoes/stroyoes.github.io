// ed state, enter/exit, save, prompt switching

let _ed_lines    = [];
let _ed_filename = 'untitled';
let _ed_mode     = 'normal'; // 'normal' | 'ed' | 'ed:replace'
let _ed_replace  = null;     // pending replace op { line_idx, word_idx }

// in-memory virtual files/ store
const _virtual_files = {};

function get_mode()  { return _ed_mode; }
function set_mode(m) { _ed_mode = m; }

// enter / exit
function enter_ed(filename = 'untitled') {
    _ed_lines    = [];
    _ed_filename = filename;
    _ed_mode     = 'ed';
    _set_prompt_ed();
    _log_print_info('ed — type freely. @ed:s to save, @ed:q to quit, @ed:p to print, @ed:d to delete last line, @ed:r:line:word to replace.');
}

function exit_ed() {
    _ed_lines    = [];
    _ed_filename = 'untitled';
    _ed_mode     = 'normal';
    _ed_replace  = null;
    _set_prompt_normal();
}

// prompt switching
function _set_prompt_normal() {
    const p = document.querySelector('.prompt');
    if (p) p.innerHTML = `Σ :: <span class="prompt-path">~</span> #&nbsp;`;
}

function _set_prompt_ed() {
    const p = document.querySelector('.prompt');
    if (p) p.innerHTML = `ed ›&nbsp;`;
}

function _set_prompt_replace(hint) {
    const p = document.querySelector('.prompt');
    if (p) p.innerHTML = `ed:r ${hint} ›&nbsp;`;
}

// save to virtual files/
function _ed_save() {
    const fname = _ed_filename.endsWith('.txt') ? _ed_filename : _ed_filename + '.txt';
    _virtual_files[fname] = _ed_lines.join('\n');
    _log_print_info(`ed: saved to files/${fname}`);
}
