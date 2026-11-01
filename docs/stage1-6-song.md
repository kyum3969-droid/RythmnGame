# 1-6 노래: 제미나이(Lyria) 프롬프트

1-6 컷씬(`prototype/cutscene-1-6.html`) 밑에 깔 가창 발라드. 컷씬 장면 시간에 맞춰 1:48에 끝나고(108초에 컷씬 암전, 노크 → 꽃다발 영상), 62 BPM이라 심박 줄 차트(지금 62 BPM)를 노래 박에 맞추기 쉽다. 글로벌 출시용으로 가사는 영어(각국 언어는 자막으로).

노래를 받으면 할 일: 실제 박을 찾아 심박 줄 차트를 다시 짜고, 필요하면 컷씬 장면 시간을 노래에 맞추고, 실제로 부른 시간대로 영어 가사 자막 파일을 만들어 번역 기준으로 쓴다.

## 받은 노래: "Four Steps Home" (`prototype/media/four-steps-home.mp3`)

**길이 2:37.5** (계획 1:48보다 50초 김). 가사는 프롬프트 그대로 불렀고, 단어 시간을 음성 인식(faster-whisper)으로 뽑아 줄 단위로 손본 자막을 만듦: `prototype/media/subs/four-steps-home.{en,ko}.{srt,vtt}`, 같은 내용의 `four-steps-home.json`(32줄, 영어와 한국어). 각국 번역은 영어 파일의 시간을 그대로 쓰면 됨.

| 구간 | 실제 시간 | 계획 | 판단 |
|---|---|---|---|
| 인트로 | 0:00–0:09 | 0:00–0:10 | 맞음 |
| 1절 | 0:08.9–0:24.9 | 0:10–0:24 | 맞음 |
| 프리코러스 | 0:24.9–0:35.3 | 0:24–0:35 | 맞음 |
| 코러스 1 | 0:35.3–0:52.4 | 0:35–0:52 | 맞음 |
| 2절 | 0:52.4–1:07.5 | 0:52–1:06 | 맞음 |
| 정적 → **긴 간주** | 1:08 거의 정적, 1:10–1:46 크게 부풀었다가 1:48에 잦아듦 | 정적 1:06–1:10 | 계획에 없던 36초 간주 |
| 브리지 | 1:49.4 "One light comes on", 1:53.3 "One more step", 1:58.3 "Another light", 2:01.1 "Another step" | 1:10–1:26 | 39초 늦음 |
| 마지막 코러스 | 2:06.6–2:26 ("I'll lay my hand" 2:11.8, "All the way home" 2:21.3~) | 1:26–1:43 | 40초 늦음 |
| 아웃트로 | "Four…" 2:29.2, 2:33.3, 끝 2:37.5 | 1:43–1:48 | |

**판단**: 앞 절반(1절~2절)은 컷씬과 거의 초 단위로 맞음. 간주는 감정이 가장 크게 부풀어 오르는 구간이라 자르지 않고 살리기로 함. 그래서 노래는 그대로 두고 **컷씬 뒤쪽을 노래에 맞춤**: 간주 동안 병원 로비를 가로질러 엘리베이터를 타고 5층까지 올라감(새 장면 둘), 엘리베이터 문이 열리면 암전, 복도 불은 브리지 가사에 맞춰 켜지고("One light comes on" / "Another light" / "Another step"), "One more step"에 걷기 시작함. 병실은 마지막 코러스: "I'll lay my hand"에 어머니 손을 잡고, "All the way home"에 고개를 숙이고, 첫 "Four…"에 어머니 손가락이 움직임. 노래가 끝나면 심박 줄이 사라지고 노크, 문 밖에서 "누나!", 하은이 문으로 걸어가면 문 건너편에 꽃다발을 든 지우(대사 줄과 그 뒤는 노래 없이 효과음만). 자세한 타임라인은 `docs/stage1.md` 1-6 컷씬.

**남은 것**: 심박 줄 차트(62 BPM 근처의 20구간, 약 156초)는 아직 노래의 실제 박에 맞추지 않음. 노래 템포를 재서 차트 구간을 노래 박에 다시 놓아야 함.

## 장면 맞춤 (처음 계획)

| 노래 | 컷씬 |
|---|---|
| 인트로 0:00–0:10 | 빈 벨트, 고개 듦 |
| 1절 0:10–0:24 | 공장 나와 새벽 거리 |
| 프리코러스 0:24–0:35 | 지하철역에서 기다림 |
| 코러스 1 0:35–0:52 | 붐비는 열차 안 |
| 2절 0:52–1:06 | 골목길 |
| 정적 1:06–1:10 | 병원 앞 |
| 브리지 1:10–1:26 | 어두운 복도, 피아노 음 하나 = 불 하나 |
| 마지막 코러스 1:26–1:43 | 병실, 손 잡기 |
| 아웃트로 1:43–1:48 | 노크 직전에 끝남 |

드럼은 일부러 뺌(박은 심박 줄이 맡음). "One, two, three, and four"는 넷째 박을 누르는 게임 규칙을 노래로 옮긴 것.

## 프롬프트 (그대로 붙여 넣기)

```
A very lonely, sad ballad with English vocals. 1:48 long, 62 BPM, 4/4, A minor.

Mood: a 23-year-old woman walking home alone at dawn after her last night shift, going to her sick mother's hospital bed. Quiet, numb, holding back tears. Intimate, empty, cold early-morning air.

Vocals: young female, soft and breathy, close-mic, restrained and fragile, low-to-mid register, clear natural English diction. No belting until the final chorus, and even there she almost breaks rather than shouts. Natural breaths left in.

Instruments: felt upright piano as the core, sparse and spacious. A solo cello joins later, soft string pad at the end. No drums, no beat, no synth bass. Slight room reverb, a little tape warmth. Lots of silence between phrases.

Structure with timestamps:
0:00–0:10 Intro: solo felt piano, a few slow notes in A minor, a lot of space. One high soft note repeating like a distant heart monitor.
0:10–0:24 Verse 1: vocal enters very softly, almost speaking. Piano only.
0:24–0:35 Pre-chorus: a low solo cello enters underneath, holding long notes.
0:35–0:52 Chorus 1: slightly fuller piano chords, cello moves, still restrained. Lonely in a crowd.
0:52–1:06 Verse 2: stripped back to piano and voice, sparser than verse 1.
1:06–1:10 Silence except one held piano chord fading.
1:10–1:26 Bridge: near silence. Single piano notes played one at a time, evenly spaced, like lights turning on one by one in a dark corridor. Vocal is a whisper.
1:26–1:43 Final chorus: soft strings swell in, piano and cello together, the emotional peak. Her voice trembles and nearly breaks on the last lines. Warm, like morning light through blinds, but still sad.
1:43–1:48 Outro: everything drops away at once. A last hummed note and one piano note left hanging, then complete silence.

Lyrics:

[Verse 1]
The belt has stopped, the lights are out
There's nothing left to hold
Just the watch around my wrist
Still telling me I'm late

[Pre-chorus]
Before the first train comes
Just hold on a little more

[Chorus]
I never had a dream
So I just count to four
One, two, three, and four
I'll be waiting on the four
Lost in a crowd of strangers
I'm standing all alone
But the four is mine to keep
I won't let it go

[Verse 2]
At the end of the alley
The windows go dark one by one
The morning's coming in
But I'm still in the night

[Bridge] (whispered)
One light comes on
One more step
Another light
Another step

[Final Chorus]
Mom, I'll count for you
One, two, three, and four
Don't stop, I'll lay my hand
Right on your every beat
I don't need a dream
This beat is all I need
Your four, I'll carry it
All the way home

[Outro] (hummed, then one word)
...four.
```

## 한국어 가사 (참고, 처음 버전)

불 꺼진 벨트 위에 / 아무것도 남지 않았어 / 손목 위 작은 시계만 / 아직 나를 재촉해 — 첫차가 오기 전에 / 조금만 더 버티면 돼 — 나는 꿈이 없어서 / 네 박자만 세며 살아 / 하나 둘 셋, 그리고 넷 / 그 자리에 내가 있을게 / 수많은 사람 틈에서도 / 나는 혼자 서 있어 / 그래도 넷은 내가 / 놓치지 않을게 — 골목 끝 창문마다 / 하나둘 불이 꺼지고 / 아침은 오는데 / 나는 아직 밤이야 — 불이 하나 켜지면 / 한 걸음 / 또 하나 켜지면 / 또 한 걸음 — 엄마, 내가 셀게 / 하나 둘 셋, 그리고 넷 / 멈추지 마, 그 박자에 / 내가 손을 얹을게 / 꿈이 없어도 괜찮아 / 이 박 하나면 돼 / 엄마의 넷은 내가 / 끝까지 이어 줄게 — …넷.
