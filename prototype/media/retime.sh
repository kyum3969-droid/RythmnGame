#!/bin/sh
# Slows the ward visit clip by section (the pacing notes in docs/stage1.md), with motion-interpolated frames and pitch-kept sound.
# usage: retime.sh in.mp4 out.mp4
IN="$1"; OUT="$2"
# section: start end speed   (speed < 1 is slower)
SEGS="0 1.4 0.72
1.4 2.1 0.85
2.1 2.3 0.35
2.3 4.6 0.7
4.6 10.0 0.72"
FC=""; N=0; CV=""; CA=""
while read a b sp; do
  at=$(python3 -c "s=$sp
f=[]
while s<0.5: f.append('atempo=0.5'); s/=0.5
f.append('atempo=%.4f'%s); print(','.join(f))")
  FC="$FC[0:v]trim=$a:$b,setpts=(PTS-STARTPTS)/$sp,minterpolate=fps=24:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1[v$N];"
  FC="$FC[0:a]atrim=$a:$b,asetpts=PTS-STARTPTS,$at[a$N];"
  CV="$CV[v$N][a$N]"; N=$((N+1))
done <<SEGEOF
$SEGS
SEGEOF
FC="$FC${CV}concat=n=$N:v=1:a=1[vc][ac];"
FC="$FC[vc]tpad=start_duration=0.6:start_mode=clone:stop_duration=1.4:stop_mode=clone[vp];"
FC="$FC[ac]adelay=600|600,apad=pad_dur=1.4[ap]"
ffmpeg -v error -y -i "$IN" -filter_complex "$FC" -map "[vp]" -map "[ap]" -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -c:a aac -b:a 160k -shortest "$OUT.tmp.mp4"
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT.tmp.mp4")
ffmpeg -v error -y -i "$OUT.tmp.mp4" -vf "fade=in:st=0:d=0.8,fade=out:st=$(python3 -c "print($D-1.2)"):d=1.2" -af "afade=in:st=0:d=0.5,afade=out:st=$(python3 -c "print($D-1.2)"):d=1.2" -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -c:a aac -b:a 160k "$OUT"
rm -f "$OUT.tmp.mp4"
