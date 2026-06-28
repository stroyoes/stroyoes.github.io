function cmd_help() {
    return `
<table class="help-table">
  <tbody>
    <tr><td>whoami</td><td>about me</td></tr>
    <tr><td>now</td><td>what i'm up to this week</td></tr>
    <tr><td>history</td><td>a timeline</td></tr>
    <tr><td>quote</td><td>a random quote</td></tr>
    <tr class="section-gap"><td>ls books/</td><td>books by year</td></tr>
    <tr><td>ls books/&lt;year&gt;</td><td>books i read that year</td></tr>
    <tr><td>cat books/reading-now</td><td>what i'm reading now</td></tr>
    <tr class="section-gap"><td>ed</td><td>just an editor</td></tr>
    <tr><td>sliddeee</td><td>a small game</td></tr>
    <tr class="section-gap"><td>clear</td><td>clear the terminal</td></tr>
    <tr><td>help</td><td>this screen</td></tr>
  </tbody>
</table>
`;
}
