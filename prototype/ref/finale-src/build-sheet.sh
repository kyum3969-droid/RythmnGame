# builds ../finale-sheet.html from the pieces in this folder
cd "$(dirname "$0")"
{ sed -n '1,26p' sheet-shell.html; echo '<script>'; cat chars.js; echo; cat finale-scenes.js; echo; cat bg.js; echo 'render();'; echo '</script>'; echo '</body>'; echo '</html>'; } > ../finale-sheet.html
