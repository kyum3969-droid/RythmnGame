# builds ../finale-anim.html from the pieces in this folder
cd "$(dirname "$0")"
{ cat finale-anim-shell.html; cat chars.js; echo; echo "const W = 384, H = 216;"; cat bg.js; echo; cat finale-anim.js; echo; cat night.js; echo; cat night-sprites.js; echo; cat night-shots.js; echo
echo '</script>'; echo '</body>'; echo '</html>'; } > ../finale-anim.html
