# 1-5 노래: 하은의 랩 두 곡 — 제미나이(Lyria) 프롬프트

**세 라운드**: 2페이즈(1라운드)는 아래의 "You Play, I Pay"(94), 3페이즈(2라운드)는 느린 곡 "The Lazy Shift"(`prototype/audio/1-5-the-lazy-shift.mp3`, 91.98초, 실측 75.5 BPM, 28마디, 첫 다운비트 0.068초, 끝에 테이프 정지; **게임은 곡 4마디째부터** — 조용한 인트로는 무대 전환 직후가 비지 않게 건너뛴다), 4페이즈(3라운드, 절정)는 하은의 드릴(`prototype/audio/1-5-this-is-a-beat.mp3`, 아래 "드릴" 프롬프트로 받음; 실측은 이 문서 끝). 처음 받은 "Your Beat, My Belt"(랩락)는 뺐다. **게임에서는 세 곡 모두 첫 훅(Hook 1)까지만** 쓰고 스크래치로 끊는다(절정 곡은 짧아서 끝까지).


1-5 2페이즈(32–51마디, 첫 훅까지)에 깔 곡. 다툼 끝에 하은이 "…됐어." 하고 내려가 버리자, 혼자 남은 지우가 "좋아요. 그럼 비트로 해요. 누나 비트가 그렇게 잘났으면, 따라와 봐요!" 하고 자기 비트를 튼다. **지우는 비트로 도발하고(가사 없음, 으스스한 멜로디 리프 + 상자 던지기), 하은이 그 비트를 뺏어 랩으로 받아친다.** 랩은 하은 혼자. **95 BPM**, 4/4, A 단조(어두운 반음 하강 루프), **2:34**(61마디). 게임은 정적이 끝나는 128박부터 95. 1-6 노래처럼 글로벌 출시용 영어 가사(한국어는 자막).

**왜 싱글 래퍼**: 남녀 두 사람이 주고받는 버전은 제미나이가 남자 파트와 여자 파트를 계속 헷갈렸다(이름에 성별을 붙여도). 그래서 랩은 하은 혼자 하고, 지우 차례는 가사 없는 비트 구간으로 바꿨다. 지우가 하던 "Haeun, why so cold, did the night shift steal your heart?"는 하은이 2절 첫 줄에서 그대로 따라 하며 비꼰다.

**비트 레퍼런스**(사용자가 준 곡, 수치로 분석, 프롬프트에는 곡·가수 이름 안 넣음): 85 BPM, 2마디(약 5.6초) 루프 반복, 베이스가 A → G# → F# → E로 반음씩 내려가고 위에 C#·D#·G# 같은 긴장음, 길게 울리는 무거운 저음과 킥, 2·4박 스네어, 촘촘한 하이햇의 붐뱁. 가사 들어가기 전에 드럼이 잠깐 빠졌다 들어옴. 템포는 95로 올려서 더 몰아붙임.

**거절 대응**: "diss battle", "menacing" 같은 말은 제미나이가 민감한 주제로 막았다. 동료에게 랩으로 받아치는 자신감 있는 곡으로 쓰고 욕은 없다. 그래도 막히면 가사를 빼고 비트만 먼저 받는다.

**받은 곡**: `prototype/audio/1-5-you-play-i-pay.mp3`(2:35.7, 94.000 BPM, 61마디, 첫 다운비트 0.055초, 153.2초부터 정적). 실제 구조는 계획과 조금 다름: 지우 비트가 36–43마디 8마디로 길고(계획 4), 브레이크다운이 44–47, 빌드업 48–51, 마지막 훅 52–58, 마지막 한 방 59(곡 마디 기준). 게임 차트는 실제 구조에 맞춤(`docs/stage1.md` 2페이즈 표).

노래를 받으면 할 일(했음):
- 실제 박과 구간이 바뀌는 지점을 찾아 2페이즈 차트와 `battle` 표를 노래에 맞춘다.
- 지금 있는 임시 비트(`diss` 구간)를 받은 음원으로 바꾼다.
- 실제로 부른 시간대로 영어 가사 + 한국어 자막 파일을 만든다.

## 게임과 맞춤 (1마디 = 2.53초) — 곡 전체를 쓰던 첫 계획

(아래 표는 이 곡 하나로 2페이즈 전체를 채우던 때의 것. 지금 게임은 **훅 1(48–51마디)까지만** 쓰고 52마디에서 스크래치로 끊어 2라운드로 넘어간다. 실제 차트는 `docs/stage1.md`.)

| 노래 | 마디(게임) | 차례 | 게임에서 |
|---|---|---|---|
| 0:00–0:10 인트로 | 32–35 | 지우 비트 | 지우가 비트를 틀고 도발. 34마디부터 지우 상자 |
| 0:10–0:20 지우 비트 | 36–39 | 지우 | **일부러** 하은 벨트로 던져 떨어뜨림. 끝 마디에 드럼이 빠짐 |
| 0:20–0:40 1절 | 40–47 | 하은 랩 | 스크래치, 하은 벨트에 정박(긴 화물 포함), 지우 벨트는 빔 |
| 0:40–0:51 훅 1 (×4, 낮게) | 48–51 | 하은 | "Tick-tock on the line…" 하은 벨트 째깍째깍 |
| 0:51–1:01 지우 비트 | 52–55 | 지우 | 또 던져 떨어뜨림 |
| 1:01–1:21 2절 | 56–63 | 하은 랩 | 더 세게, 더 빽빽하게 |
| 1:21–1:31 훅 2 (×4, 더 세게) | 64–67 | 하은 | 째깍째깍 |
| 1:31–1:41 지우 비트 | 68–71 | 지우 | 또 던짐. 끝 마디에 드럼이 빠짐 |
| 1:41–1:51 브레이크다운 | 72–75 | 1마디씩 지우·하은·지우·하은 | 한 마디짜리 긴 화물이 위·아래 번갈아. 하은은 짧은 두 줄 |
| 1:51–2:11 3절 | 76–83 | 둘 동시에, 하은 랩 | "You throw it, I catch it": 던지면 받고, 떨어뜨림과 하은 상자가 번갈아 |
| 2:11–2:32 마지막 훅 (×8, 고조) | 84–91 | 둘 동시에 | tick은 위, tock은 아래로 번갈아 → 끝 두 마디는 박마다 둘이 같이 |
| 2:32–2:34 마지막 한 방 | 92 | 둘 | 두 벨트 같은 박 하나, 그리고 정적 |

곡 전체에 같은 어두운 루프가 깔린다. 지우 비트 구간엔 높고 으스스한 멜로디 리프와 보컬 찹(펑키한 층은 뺐다), 하은 구간엔 날것의 루프 위에 하은 랩. 하은 구간으로 넘어갈 때 레코드 스크래치, 지우 구간으로 넘어갈 때 보컬 찹 → 게임의 조명(하은 빨강, 지우 하늘)과 박마다 바닥 진동이 같은 자리에서 바뀐다.

**훅 "Tick-tock on the line, and nobody's gonna stop"**: 1절 뒤 4번(낮게, 반쯤 속삭이듯), 2절 뒤 4번(제 목소리, 겹쳐 녹음), 마지막에 8번(2마디마다 쌓임: 킥만 → 스네어·하이햇 → 겹친 목소리와 라이저 → 전부, 박마다 크래시, 마지막 줄은 소리쳐서 마지막 한 방으로).

가사 원칙: 반장·허리 얘기 없음. **꿈은 직접 말하지 않는다**(하은은 "Somebody's waiting." 정도로만, 사정은 1-6에서. 돈·월세 얘기 아님). 욕 없음.

## 프롬프트 (그대로 붙여 넣기)

```
A dark, swaggering boom bap track with ONE solo female rapper. A young woman on the night shift answers a show-off coworker: he keeps playing his beat and throwing things around, and she takes over the beat and raps back, cool and precise. English rap vocals, one female voice only, no male vocals, no singing. 2:34 long, 95 BPM, 4/4, A minor. Clean lyrics.

The beat (the same loop under the whole song):
- A heavy, dark two-bar loop with a cinematic feel: the bass line walks down by half steps (A, G#, F#, E), with tense dissonant notes ringing on top.
- Hard-hitting dusty drums: a heavy kick with a long, deep low end, a loud cracking snare on 2 and 4, busy crisp sixteenth-note hi-hats.
- Driving and hard-hitting, pushing forward, but still heavy with lots of room for the vocal. Not funky, no disco, no slap bass.

The rapper: a young woman of 23. Low, calm, cool, precise, lands every word right on the beat, confident and steady, getting harder with every section and shouting only at the very end.

Two kinds of sections:
- BEAT sections (no rap): the full dark beat plays out loud with a catchy, high, eerie melodic riff on top (a cold bell-like synth) and chopped vocal stabs ("yah!", "uh!"), cocky and showing off. Every BEAT section starts with a chopped vocal stab.
- RAP and HOOK sections: the riff drops out and only the raw dark loop is left under her voice. Every RAP section starts with a record scratch.
- Every switch lands exactly on the bar line.

The hook is one line, "Tick-tock on the line, and nobody's gonna stop", one line per bar, and it builds every time it comes back.

Structure with timestamps (one bar = 2.5 seconds):
0:00–0:10 Intro, BEAT (4 bars): the dark loop and the riff come in loud and cocky. No rap.
0:10–0:20 BEAT (4 bars): the riff keeps showing off with vocal stabs; on the last bar the drums cut out. No rap.
0:20–0:40 Verse 1, RAP (8 bars): record scratch, the drums slam back in, raw loop only. She is calm and precise.
0:40–0:51 Hook 1 (4 bars): the hook four times, low and half-whispered, eerily calm.
0:51–1:01 BEAT (4 bars): the riff comes back, cocky, vocal stabs. No rap.
1:01–1:21 Verse 2, RAP (8 bars): record scratch, raw loop; she is sharper and harder now.
1:21–1:31 Hook 2 (4 bars): the hook four times, full voice, doubled, the drums hitting harder.
1:31–1:41 BEAT (4 bars): the riff again, the longest and loudest show-off; on the last bar the drums cut out. No rap.
1:41–1:51 Breakdown (4 bars): just the bass line and claps, half-time feel. Bar 1: a stab hit, no rap. Bar 2: her first short line. Bar 3: a stab hit, no rap. Bar 4: her second short line.
1:51–2:11 Verse 3, RAP (8 bars): everything back in at once, the riff and the dark loop together, louder. Quick, punchy lines.
2:11–2:32 Final hook (8 bars): the hook eight times, building in four steps of two bars: (1) her voice over just the kick, (2) the snare and double-time hi-hats come in, (3) her voice stacked and layered with a rising riser, (4) everything at full power, a crash on every beat, the last line shouted.
2:32–2:34 Ending: one huge hit on the downbeat of the last bar, then silence. No fade out.

Lyrics (all by the one female rapper):

[Intro – BEAT, no vocals]

[BEAT, no vocals]

[Verse 1 – female rap]
You throw it, it falls, and it lands next to me
Every box you drop is a box I carry
You call it a flow, I call it a mess
You nap through the shift and I handle the rest
You talk about tomorrow like it's already yours
I'm counting the minutes to the next set of doors
Keep your rhythm, kid, keep it loud in your ears
Some of us can't stop long enough to hear

[Hook 1 – low, half-whispered]
Tick-tock on the line, and nobody's gonna stop
Tick-tock on the line, and nobody's gonna stop
Tick-tock on the line, and nobody's gonna stop
Tick-tock on the line, and nobody's gonna stop

[BEAT, no vocals]

[Verse 2 – female rap]
"Haeun, why so cold, did the night shift steal your heart?"
That's what you said, so let me take it from the start
Every time you start, I'm the one who has to finish
You play, I pay. That's the difference.
You don't know what I need, you don't know what I've seen
Stay up on your stage, I'll stay down at the machine
Call me stiff, call me slow, say I live by the clock
But the clock keeps the line moving while you watch it drop

[Hook 2 – full voice, doubled]
Tick-tock on the line, and nobody's gonna stop
Tick-tock on the line, and nobody's gonna stop
Tick-tock on the line, and nobody's gonna stop
Tick-tock on the line, and nobody's gonna stop

[BEAT, no vocals]

[Breakdown – female rap, one short line every other bar]
What's it for? Somebody's waiting.
That's the beat. Keep time.

[Verse 3 – female rap]
You throw it, I catch it
You're careless, I'm counting
Your beat, my belt
Your way? Every day
Can't keep up? Watch me
One more box, one more drop
Go on, throw another, I'll catch every one
Count it with me now, we're not done

[Final hook – building to the end]
Tick-tock on the line, and nobody's gonna stop
Tick-tock on the line, and nobody's gonna stop
Tick-tock on the line, and nobody's gonna stop
Tick-tock on the line, and nobody's gonna stop
Tick-tock on the line, and nobody's gonna stop
Tick-tock on the line, and nobody's gonna stop
Tick-tock on the line, and nobody's gonna stop
TICK-TOCK ON THE LINE, AND NOBODY'S GONNA STOP

[Ending]
(one huge hit, then silence)
```

## 가사 뜻 (자막 초안)

| 영어 | 한국어 |
|---|---|
| You throw it, it falls, and it lands next to me | 네가 던지면, 떨어지고, 내 옆에 와 |
| Every box you drop is a box I carry | 네가 떨군 상자는 전부 내가 들어 |
| You call it a flow, I call it a mess | 넌 그걸 흐름이라 하고, 난 엉망이라 해 |
| You nap through the shift and I handle the rest | 넌 근무 중에 졸고, 나머진 내가 해 |
| You talk about tomorrow like it's already yours | 넌 내일이 벌써 네 것처럼 말하지 |
| I'm counting the minutes to the next set of doors | 난 다음 문까지 남은 분을 세 |
| Keep your rhythm, kid, keep it loud in your ears | 네 리듬 지켜, 꼬마야, 귀에 크게 틀어 놔 |
| Some of us can't stop long enough to hear | 누군 들을 만큼 멈출 수도 없거든 |
| "Haeun, why so cold, did the night shift steal your heart?" | "하은 누나, 왜 그렇게 차가워요, 야간이 마음까지 가져갔어요?" |
| That's what you said, so let me take it from the start | 네가 그랬지, 그럼 처음부터 말해 줄게 |
| Every time you start, I'm the one who has to finish | 네가 시작하면, 끝내는 건 늘 나야 |
| You play, I pay. That's the difference. | 넌 놀고, 난 갚아. 그게 차이야. |
| You don't know what I need, you don't know what I've seen | 넌 내가 뭘 필요한지 몰라, 내가 뭘 봤는지도 |
| Stay up on your stage, I'll stay down at the machine | 넌 네 무대 위에 있어, 난 기계 앞에 있을게 |
| Call me stiff, call me slow, say I live by the clock | 딱딱하다, 느리다, 시계대로 산다 해 |
| But the clock keeps the line moving while you watch it drop | 근데 라인을 돌리는 건 그 시계야, 넌 떨어지는 거 구경이나 하고 |
| What's it for? Somebody's waiting. | 뭐 때문이냐고? …기다리는 사람이 있어. |
| That's the beat. Keep time. | 그게 박이야. 박이나 맞춰. |
| You throw it, I catch it | 넌 던지고, 난 받아 |
| You're careless, I'm counting | 넌 대충, 난 세고 있어 |
| Your beat, my belt | 네 비트, 내 벨트 |
| Your way? Every day | 네 방식? 매일이 그래 |
| Can't keep up? Watch me | 못 따라온다고? 봐 |
| One more box, one more drop | 상자 하나 더, 하나 더 떨궈 |
| Go on, throw another, I'll catch every one | 더 던져 봐, 하나도 안 놓쳐 |
| Count it with me now, we're not done | 같이 세, 아직 안 끝났어 |
| Tick-tock on the line, and nobody's gonna stop | 라인 위에 째깍째깍, 아무도 안 멈춰 |

"Stay up on your stage / down at the machine"은 지우가 위 벨트(무대), 하은이 아래 벨트(기계)라는 자리를 그대로 쓴 것. "Somebody's waiting."(기다리는 사람이 있어)이 1-6 병원 사정(어머니)의 유일한 실마리. 돈 얘기는 하지 않는다. "What's it for?"는 원래 지우가 묻던 말을 하은이 스스로 묻고 답하는 식.

## 2라운드 곡 "The Lazy Shift" 프롬프트 (받아서 씀)

```
A slow, lazy, swaggering hip-hop track with ONE solo female rapper. A young woman on the night shift answers a careless coworker who keeps playing his sleepy beat at her: she takes it over and raps on it, cool and unimpressed. English rap vocals, one female voice only, no male vocals, no singing. 1:29 long, 78 BPM, 4/4, A minor. Clean lyrics.
(beat: dark, dusty, laid-back boom bap; sub bass walking A, G#, F#, E; hazy Rhodes, tape wobble, vinyl. BEAT sections with a lazy whistle-like riff and vocal stabs, RAP sections with the raw loop. Structure: intro BEAT 4, BEAT 4, verse 1 8, hook 4, BEAT 4, verse 2 4, ending 1 bar slowing down like a tape stopping.)

[Verse 1] This your beat? It's half asleep / Just like you on the shift, counting sheep / You throw it so lazy, it lands on my side / I pick up the pieces, you call it a vibe / Earbuds in and the whole world out / Nodding along like you know what it's about / You're waiting on the drop, you're waiting on the cheer / I've been on the beat since before you got here
[Hook] Is that it? Is that all you got? (x2) / Is that it? You call that hot? / Is that it? Is that all you got?
[Verse 2] Turn it up, turn it down, I don't really mind / I'll ride any beat that you leave behind / You want it faster? Go on, raise the bar / Play me another. I'll catch every bar.
```

받은 곡의 실제 구조(곡 마디): 0–3 조용한 인트로(저음 없음), 4–7 지우 비트, 8–15 1절, 16–19 훅(2·3박 강세), 20–23 지우 비트, 24–27 2절, 28 정적. 템포는 75.5에서 ±0.03초 안으로 맞음. 게임은 곡 4마디(216박)부터 훅 끝(곡 20마디 = 게임 70마디)까지.

## 3라운드(절정) 곡 프롬프트

절정. The Lazy Shift 끝("Play me another")에 지우가 가장 무겁고 센 비트를 튼다. **빠르기보다 무게**: 100 BPM 하프타임 드럼, 디스토션 기타 파워코드(A–G#–F#–E 반음 하강), 찢어지는 808, 브라스·합창. 인트로·훅·브리지 없이 **Final 하나만**: 첫 박부터 전부 터지고, 1라운드 Tick-tock 훅 4줄 → "You play, I pay" 벌스(1라운드 2절) 8줄 → 마지막 한 방. 13마디, 0:31.

```
A HEAVY, POWERFUL, anthemic rap-rock / trap-metal track with ONE solo female rapper: the final blow of a rap battle on a night shift. It must feel huge and crushing, not fast. Stadium-sized: every drum hit is a cannon, the guitars are a wall. English rap vocals, one female voice only, no male vocals, no singing. 0:31 long, 100 BPM, 4/4, A minor. Clean lyrics.

The sound:
- Half-time drums: a massive kick and a giant snare with a big hall reverb on beat 3, slow and heavy, like stomping. A crash on every bar.
- Thick distorted electric guitars playing low power chords, chugging: the riff walks down by half steps, A, G#, F#, E, one chord per beat, hammered.
- A loud, overdriven 808 sub that shakes the floor, doubling the guitar riff.
- Low brass and choir hits on the downbeats, epic and dark.
- Mixed loud, wide and aggressive, at full power from the first beat to the last.

The rapper: a young woman of 23, cold and forceful, every word hitting with the snare. Her voice is doubled and stacked, like a crowd made of her own voice. The last line is screamed.

Structure (one bar = 2.4 seconds). NO intro, NO hook, NO bridge: the song is only this one final verse.
0:00–0:10 (4 bars): everything slams in on the very first downbeat with her voice. The chant "Tick-tock on the line", one line per bar.
0:10–0:29 (8 bars): her verse "You play, I pay", one line per bar, heavier and louder to the end.
0:29–0:31 Ending: one huge hit on the downbeat of the last bar, then silence. No fade out.

Lyrics (all by the one female rapper):

[Final]
Tick-tock on the line, and nobody's gonna stop
Tick-tock on the line, and nobody's gonna stop
Tick-tock on the line, and nobody's gonna stop
Tick-tock on the line, and nobody's gonna stop
"Haeun, why so cold, did the night shift steal your heart?"
That's what you said, so let me take it from the start
Every time you start, I'm the one who has to finish
You play, I pay. That's the difference.
You don't know what I need, you don't know what I've seen
Stay up on your stage, I'll stay down at the machine
Call me stiff, call me slow, say I live by the clock
BUT THE CLOCK KEEPS THE LINE MOVING WHILE YOU WATCH IT DROP

[Ending]
(one huge hit, then silence)
```

**받은 곡**: `prototype/audio/1-5-your-beat-my-belt.mp3`(62.85초, 실측 105.0 BPM, 첫 다운비트 0.236초, 26마디 + 마지막 한 방, 60.1초부터 정적). 받아쓰기(whisper)로 찾은 실제 구조(곡 마디): 0–3 Tick-tock ×4, 4–11 "You play, I pay" 벌스(줄마다 반 박쯤 앞서 들어감), 12–21 브레이크다운(드럼이 빠지고 짝수 마디에 붐 한 번; Tick-tock, "What's it for? Somebody's waiting.", "That's the beat. Keep time.", "You throw it, I catch it…", "Your beat, my belt…", "Can't keep up? Watch me" — 1라운드 브레이크다운·3절 가사를 제미나이가 넣음), 22–25 전부("One more box, one more drop", Tick-tock ×2, "But the clock… watch it drop"), 26 마지막 한 방. 게임 76–102마디(`docs/stage1.md` 4페이즈 표).

### 절정 곡 다시 뽑기: 도입부 포함

받은 곡은 첫 박부터 전부 터져서 확 들어온다(게임은 지금 도입 두 마디를 직접 붙여 메움). 도입 4마디(약 9초)를 넣은 버전. 받은 곡과 같은 105 BPM.

```
A HEAVY, POWERFUL, anthemic rap-rock / trap-metal track with ONE solo female rapper: the final blow of a rap battle on a night shift. It must feel huge and crushing, not fast. Stadium-sized: every drum hit is a cannon, the guitars are a wall. English rap vocals, one female voice only, no male vocals, no singing. 0:41 long, 105 BPM, 4/4, A minor. Clean lyrics.

The sound:
- Half-time drums: a massive kick and a giant snare with a big hall reverb on beat 3, slow and heavy, like stomping. A crash on every bar.
- Thick distorted electric guitars playing low power chords, chugging: the riff walks down by half steps, A, G#, F#, E, one chord per beat, hammered.
- A loud, overdriven 808 sub that shakes the floor, doubling the guitar riff.
- Low brass and choir hits on the downbeats, epic and dark.
- Mixed loud, wide and aggressive.

The rapper: a young woman of 23, cold and forceful, every word hitting with the snare. Her voice is doubled and stacked, like a crowd made of her own voice. The last line is screamed.

Structure (one bar = 2.29 seconds):
0:00–0:09 Intro (4 bars), NO vocals, building up from almost nothing:
  bar 1: only a slow heartbeat kick and a ticking clock, dark and tense.
  bar 2: low war drums and a deep choir hum come in under it; the clock ticks twice as fast.
  bar 3: the distorted guitars fade in on the riff, a rising riser, the drums getting louder.
  bar 4: a snare roll building to the top, the riser at its peak; on the last half beat everything cuts to silence for a breath.
0:09–0:18 (4 bars): everything slams in at once on the downbeat with her voice. The chant "Tick-tock on the line", one line per bar.
0:18–0:37 (8 bars): her verse "You play, I pay", one line per bar, heavier and louder to the end.
0:37–0:41 Ending: one huge hit on the downbeat of the last bar, then silence. No fade out.

Lyrics (all by the one female rapper):

[Intro – no vocals, building]

[Final]
Tick-tock on the line, and nobody's gonna stop
Tick-tock on the line, and nobody's gonna stop
Tick-tock on the line, and nobody's gonna stop
Tick-tock on the line, and nobody's gonna stop
"Haeun, why so cold, did the night shift steal your heart?"
That's what you said, so let me take it from the start
Every time you start, I'm the one who has to finish
You play, I pay. That's the difference.
You don't know what I need, you don't know what I've seen
Stay up on your stage, I'll stay down at the machine
Call me stiff, call me slow, say I live by the clock
BUT THE CLOCK KEEPS THE LINE MOVING WHILE YOU WATCH IT DROP

[Ending]
(one huge hit, then silence)
```

### 절정 곡 장르 변경: 시네마틱 오케스트라 트랩 (추천)

랩락(디스토션 기타)은 앞의 두 곡(붐뱁)과 결이 어긋나서 뺀다. 힙합은 그대로 두고, 힘은 기타 대신 **오케스트라(현악 오스티나토, 브라스, 합창, 타이코) + 찢어지는 808**에서 낸다. 시계 모티프는 피치카토 현과 시계 째깍으로, 브리지 없이도 1-6 심장 박동으로 이어지는 킥.

```
An epic, cinematic orchestral trap / hip-hop track with ONE solo female rapper: the final round of a rap battle on a night shift, like the last boss fight in a film. Powerful and huge, not fast. English rap vocals, one female voice only, no male vocals, no singing. No electric guitars, no rock. 0:41 long, 105 BPM, 4/4, A minor. Clean lyrics.

The sound:
- Hip-hop drums, half-time and heavy: a deep booming kick, a huge snare and clap with a big reverb on beat 3, crisp trap hi-hats with short rolls.
- A massive distorted 808 sub that slides and shakes the floor.
- An orchestra on top: fast, driving staccato strings repeating the riff, the bass line walking down by half steps (A, G#, F#, E); big low brass stabs on the downbeats; a dark choir; taiko drums hitting with the kick.
- A ticking clock sound and plucked pizzicato strings keeping time, like a clock running out.
- Mixed loud, wide and dramatic.

The rapper: a young woman of 23, cold, controlled and forceful, every word landing on the beat. Her voice is doubled and stacked, like a crowd made of her own voice. The last line is shouted.

Structure (one bar = 2.29 seconds):
0:00–0:09 Intro (4 bars), NO vocals, building up from almost nothing:
  bar 1: only a slow heartbeat kick and a ticking clock, dark and tense.
  bar 2: pizzicato strings and a low choir hum come in; the clock ticks twice as fast.
  bar 3: the staccato strings start the riff, taiko drums, a rising swell.
  bar 4: a snare roll and the whole orchestra rising to the top; on the last half beat everything cuts to silence for a breath.
0:09–0:18 (4 bars): everything slams in at once on the downbeat with her voice: drums, 808, strings, brass, choir. The chant "Tick-tock on the line", one line per bar.
0:18–0:37 (8 bars): her verse "You play, I pay", one line per bar, bigger and louder to the end.
0:37–0:41 Ending: one huge orchestral hit with the 808 on the downbeat of the last bar, then silence. No fade out.

Lyrics (all by the one female rapper):

[Intro – no vocals, building]

[Final]
Tick-tock on the line, and nobody's gonna stop
Tick-tock on the line, and nobody's gonna stop
Tick-tock on the line, and nobody's gonna stop
Tick-tock on the line, and nobody's gonna stop
"Haeun, why so cold, did the night shift steal your heart?"
That's what you said, so let me take it from the start
Every time you start, I'm the one who has to finish
You play, I pay. That's the difference.
You don't know what I need, you don't know what I've seen
Stay up on your stage, I'll stay down at the machine
Call me stiff, call me slow, say I live by the clock
BUT THE CLOCK KEEPS THE LINE MOVING WHILE YOU WATCH IT DROP

[Ending]
(one huge hit, then silence)
```

### 절정 곡 장르 후보: 드릴

드릴은 원래 140대 BPM에 하프타임(스네어가 3박)이라 105로 두면 드릴 같지 않다. 142 BPM(1마디 1.69초), 0:29. 미끄러지는 808이 A–G#–F#–E 하강선을 타고, 어두운 피아노·현, 통통 튀는 하이햇과 셋잇단 롤.

```
A dark, menacing, hard-hitting drill track with ONE solo female rapper: the final round of a rap battle on a night shift. Cold, heavy and powerful. English rap vocals, one female voice only, no male vocals, no singing. No guitars. 0:29 long, 142 BPM, 4/4 with a half-time feel, A minor. Clean lyrics.

The sound:
- Drill drums: a heavy kick, a hard snare and clap on beat 3 of every bar (half-time), skippy sliding hi-hats with triplet rolls, sparse off-beat percussion.
- A huge, distorted sliding 808 that glides between notes, walking down by half steps: A, G#, F#, E.
- A dark, eerie melody on top: a cold piano and haunting strings, with a low choir pad underneath.
- A ticking clock sound running through the whole song, like time running out.
- Mixed loud, wide and aggressive.

The rapper: a young woman of 23, cold, sharp and controlled, every word landing on the beat, menacing rather than loud. Her voice is doubled on the ends of lines. The last line is shouted.

Structure (one bar = 1.69 seconds):
0:00–0:07 Intro (4 bars), NO vocals, building up:
  bar 1: only the ticking clock and the cold piano melody, dark and tense.
  bar 2: the strings and a low choir come in; the clock ticks twice as fast.
  bar 3: the hi-hats start, a rising swell.
  bar 4: a hi-hat roll building up; on the last half beat everything cuts to silence for a breath.
0:07–0:14 (4 bars): the drums and the sliding 808 slam in on the downbeat with her voice. The chant "Tick-tock on the line", one line per bar.
0:14–0:27 (8 bars): her verse "You play, I pay", one line per bar, harder to the end.
0:27–0:29 Ending: one huge 808 hit on the downbeat of the last bar, then silence. No fade out.

Lyrics (all by the one female rapper):

[Intro – no vocals, building]

[Final]
Tick-tock on the line, and nobody's gonna stop
Tick-tock on the line, and nobody's gonna stop
Tick-tock on the line, and nobody's gonna stop
Tick-tock on the line, and nobody's gonna stop
"Haeun, why so cold, did the night shift steal your heart?"
That's what you said, so let me take it from the start
Every time you start, I'm the one who has to finish
You play, I pay. That's the difference.
You don't know what I need, you don't know what I've seen
Stay up on your stage, I'll stay down at the machine
Call me stiff, call me slow, say I live by the clock
BUT THE CLOCK KEEPS THE LINE MOVING WHILE YOU WATCH IT DROP

[Ending]
(one huge 808 hit, then silence)
```

**받은 드릴 곡**: `prototype/audio/1-5-this-is-a-beat.mp3`(받은 이름 you_play_i_pay_1, 67.13초, 실측 146.0 BPM 하프타임 — 스네어가 3박, 첫 다운비트 0.483초, 39마디, 64.6초에 뚝 끊김). 실제 구조(곡 마디, 받아쓰기는 드릴이라 일부만 잡힘): 0–3 도입, 4–9 Tick-tock ×3(두 마디에 한 줄), 10–19 벌스("Haeun, why so cold…"부터 "…watch it drop"까지, 줄 간격이 고르지 않음), 20–21 끊김, 22–27 풀 비트(스네어·하이햇 빽빽), 28–30 드럼 빠지고 Tick-tock ×2, 31–38 벌스 다시 더블타임, 39 끊김. 게임 72–111마디(`docs/stage1.md` 4페이즈 표).

### 결승 곡 다시 뽑기 (v2): 지금 차트 구조 그대로

받은 드릴 곡(`1-5-this-is-a-beat.mp3`)의 마디 구조를 그대로 지켜서, 새로 받아도 차트(게임 72–111마디)는 손대지 않고 `lead`(첫 다운비트)만 다시 재면 되게 한다. 고친 점:
- **줄 간격을 고르게**: 받은 곡은 벌스 줄 간격이 들쭉날쭉하고 발음이 뭉개져 받아쓰기가 일부만 잡혔다. 한 마디에 한 줄, 첫 박에 들어가게, 또렷하게.
- **가사를 정확히**: 받은 곡은 1라운드 브레이크다운·3절 가사를 제미나이가 섞어 넣었다. 가사 밖의 말은 넣지 말라고 적는다.
- **끝은 뚝 끊김**: 게임에서 지우가 끊는 자리. 마지막 한 방 없이 줄 중간에서 케이블을 뽑은 듯이.
- **마지막 벌스에서 하은도 지친다**: 끝에 하은이 숨을 고르는 컷과 이어지게, 빠른 벌스로 갈수록 목소리가 거칠어지고 숨이 찬다.
- "diss", "battle", "menacing"은 빼고 "final round", "cold, dark"로.

```
A dark, cold, hard-hitting UK drill track with ONE solo female rapper: the last round on a night shift, where a young woman finally answers a careless coworker with her own beat. English rap vocals, one female voice only, no male vocals, no singing, no backing choir singing words. 146 BPM with a half-time feel (the snare on beat 3 of every bar), 4/4, A minor. About 1:05 long. Clean lyrics. Sing ONLY the lyrics below, exactly as written, nothing added.

The sound:
- Drill drums: a heavy kick, a hard snare and clap on beat 3 of every bar, skippy sliding hi-hats with triplet rolls.
- A huge, distorted sliding 808 walking down by half steps: A, G#, F#, E.
- A cold, eerie piano melody and dark strings on top, a low choir pad underneath (no words).
- A ticking clock running through the whole track, like time running out.
- Mixed loud, wide and aggressive.

The rapper: a young woman of 23. Cold, sharp, controlled. Every line starts exactly on the first beat of its bar and every word is clear and easy to understand. Her voice is doubled on the ends of lines. In the last verse she gets faster and rawer, out of breath by the end.

Structure (one bar = 1.64 seconds; every change lands exactly on the bar line):
0:00-0:06.6 Intro (4 bars), NO vocals: bar 1 only the clock and the cold piano; bar 2 the strings and choir pad come in, the clock ticks twice as fast; bar 3 the hi-hats start, a rising swell; bar 4 a hi-hat roll, and on the last half beat everything cuts to silence for a breath.
0:06.6-0:16.4 Chant (6 bars): the drums and the 808 slam in on the downbeat. The chant line three times, ONE LINE EVERY TWO BARS, slow and heavy.
0:16.4-0:32.9 Verse 1 (10 bars): ten lines, ONE LINE PER BAR, harder and harder.
0:32.9-0:36.2 Break (2 bars): one huge 808 and snare hit on the downbeat, then a full bar of silence with only the clock ticking.
0:36.2-0:46.0 Full beat (6 bars): everything back at full power, the busiest drums of the song. Her doubled voice shouts "Tick!" and "Tock!" in turn, one word on every beat.
0:46.0-0:51.0 Drop-out (3 bars): the drums cut out, only the 808, the clock and the piano. She half-whispers the chant line twice.
0:51.0-1:04.1 Verse 2, double time (8 bars): the drums slam back in, she raps twice as fast, ONE LINE PER BAR, breathless and raw by the end.
1:04.1 The track stops dead on the downbeat, in the middle of her last word, as if someone pulled the cable. No final hit, no fade out, just silence.

Lyrics:

[Intro - no vocals]

[Chant - one line every two bars]
Tick-tock on the line, and nobody's gonna stop
Tick-tock on the line, and nobody's gonna stop
Tick-tock on the line, and nobody's gonna stop

[Verse 1 - one line per bar]
"Haeun, why so cold, did the night shift steal your heart?"
That's what you said, so let me take it from the start
Every time you start, I'm the one who has to finish
You play, I pay. That's the difference.
You don't know what I need, you don't know what I've seen
Stay up on your stage, I'll stay down at the machine
You wanted a beat? Then listen to mine
Every box on my line lands right on time
Call me stiff, call me slow, say I live by the clock
But the clock keeps the line moving while you watch it drop

[Break - one hit, then only the clock]

[Full beat - shouted, one word per beat]
Tick! Tock! Tick! Tock! Tick! Tock! Tick! Tock!
Tick! Tock! Tick! Tock! Tick! Tock! Tick! Tock!
Tick! Tock! Tick! Tock! Tick! Tock! Tick! Tock!

[Drop-out - half-whispered]
Tick-tock on the line, and nobody's gonna stop
Tick-tock on the line, and nobody's gonna stop

[Verse 2 - double time, one line per bar, out of breath by the end]
You throw it, I catch it, you're careless, I'm counting
Your beat on my belt and I'm still not drowning
Can't keep up? Watch me, one more box, one more drop
Every second you waste is a second I got
Go on, throw another, I'll catch every one
I was here before the night, I'll be here when it's done
Count it with me now, one, two, three, four
Tick-tock on the line and I'm not done, I'm not

[Cut - stops dead mid-word, silence]
```

**막히면**: 가사를 빼고 비트만 먼저 받은 뒤, 같은 프롬프트에 "Use the same beat as before"로 다시. 풀 비트의 "Tick! Tock!"이 이상하게 나오면 그 6마디를 "NO vocals, the beat at full power"로 바꿔도 차트는 그대로 맞는다.

**새 가사 뜻**: You wanted a beat? Then listen to mine — 비트 원했지? 그럼 내 거 들어 봐 / Every box on my line lands right on time — 내 라인 상자는 전부 제때 떨어져 / Your beat on my belt and I'm still not drowning — 네 비트가 내 벨트에 쏟아져도 난 안 잠겨 / Every second you waste is a second I got — 네가 버린 1초는 내가 버틴 1초야 / I was here before the night, I'll be here when it's done — 밤이 오기 전부터 여기 있었고, 끝나도 여기 있을 거야 / Tick-tock on the line and I'm not done, I'm not — 라인 위에 째깍째깍, 난 안 끝났어, 난 안— (지우가 끊음)

**받으면 할 일**: 첫 다운비트(`lead`)와 BPM(146인지)을 재고, 마디 경계가 위 타임스탬프에 맞는지 확인. 맞으면 `songs`의 파일과 `lead`만 바꾼다. 줄이 들어가는 마디가 다르면 위 벨트(던져 올림) 자리만 고친다. 펀치라인 LED(`stage.cheers`)도 확인.
