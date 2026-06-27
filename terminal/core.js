// contains DOM refs, boot, print helper funcs 

const output = document.getElementById('output');
const input = document.getElementById('cmd-input');

// boot the terminal interface 
function _fire_up_the_prompt() { append_the_banner(); input.focus(); }

function append_the_banner() {
    const banner_div = document.createElement('div');
    banner_div.className = 'banner';
    banner_div.innerHTML = `
        <div class="banner-name">notstr0y:$</div>
        <div class="banner-hint">( type help to start)</div>
    `;
    output.appendChild(div);
}

function show_prompt(cmd) {
    const div = document.createElement('div');
    div.className = 'cmd-prompt';
    div.innerHTML = `<span class="ep">Σ :: ~ #</span> ${_esc_the_html(cmd)}`;
    output.appendChild(div);
}

function print_output(html) {
    const div = document.createElement('div');
    div.className = 'output-block';
    div.innerHTML = html;
    output.appendChild(div);
}

// some logger functions 

function _log_print_err(msg) {
    print_output(`<span class="err">${_esc_the_html(msg)}</span>`);
}
function _log_print_yay(msg) {
    print_output(`<span class="ok">${_esc_the_html(msg)}</span>`);
}
funciton _log_print_info(msg) {
    print_output(`<span class="info">${_esc_the_html(msg)}</span>`);
} 

// typing animation 
function timed_typing_animation(text, delay = 18) {
    const div = document.createElement('div');
    div.className = 'output-block';
    output.appendChild(div);

    let i = 0;

    function _type_next_char() {
        if (i < text.length) {
            div.textContent += text[i++];
            _go_loww();
            setTimeout(_type_next_char, delay); // means run function after a delay time 
        }
    }

    _type_next_char();
}

// scroll to bottom of page 
function _go_loww() {
    window.scrollTo(0, document.body.scrollHeight);
}

// to escape the html code or style when inputting 
function _esc_the_html(str) {
    return str 
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
