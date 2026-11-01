# 1-5 노래: 하은의 랩 두 곡 — 제미나이(Lyria) 프롬프트

**세 라운드**: 2페이즈(1라운드)는 아래의 "You Play, I Pay"(94), 3페이즈(2라운드)는 느린 곡 "The Lazy Shift"(`prototype/audio/1-5-the-lazy-shift.mp3`, 91.98초, 실측 75.5 BPM, 28마디, 첫 다운비트 0.068초, 끝에 테이프 정지), 4페이즈(3라운드, 절정)는 새 곡(100 BPM 하프타임, 무겁고 파워풀하게, 프롬프트는 이 문서 끝). The Lazy Shift 마지막 줄 "You want it faster? … Play me another."가 절정으로 넘어가는 다리.


1-5 2페이즈(32–72마디)에 깔 곡. 다툼 끝에 하은이 지우를 밀쳐내자, 자기 벨트로 돌아온 지우가 "좋아요. 그럼 박으로 해요. 누나 박이 그렇게 잘났으면, 따라와 봐요!" 하고 자기 비트를 튼다. **지우는 비트로 도발하고(가사 없음, 으스스한 멜로디 리프 + 상자 던지기), 하은이 그 비트를 뺏어 랩으로 받아친다.** 랩은 하은 혼자. **95 BPM**, 4/4, A 단조(어두운 반음 하강 루프), **2:34**(61마디). 게임은 정적이 끝나는 128박부터 95. 1-6 노래처럼 글로벌 출시용 영어 가사(한국어는 자막).

**왜 싱글 래퍼**: 남녀 두 사람이 주고받는 버전은 제미나이가 남자 파트와 여자 파트를 계속 헷갈렸다(이름에 성별을 붙여도). 그래서 랩은 하은 혼자 하고, 지우 차례는 가사 없는 비트 구간으로 바꿨다. 지우가 하던 "Haeun, why so cold, did the night shift steal your heart?"는 하은이 2절 첫 줄에서 그대로 따라 하며 비꼰다.

**비트 레퍼런스**(사용자가 준 곡, 수치로 분석, 프롬프트에는 곡·가수 이름 안 넣음): 85 BPM, 2마디(약 5.6초) 루프 반복, 베이스가 A → G# → F# → E로 반음씩 내려가고 위에 C#·D#·G# 같은 긴장음, 길게 울리는 무거운 저음과 킥, 2·4박 스네어, 촘촘한 하이햇의 붐뱁. 가사 들어가기 전에 드럼이 잠깐 빠졌다 들어옴. 템포는 95로 올려서 더 몰아붙임.

**거절 대응**: "diss battle", "menacing" 같은 말은 제미나이가 민감한 주제로 막았다. 동료에게 랩으로 받아치는 자신감 있는 곡으로 쓰고 욕은 없다. 그래도 막히면 가사를 빼고 비트만 먼저 받는다.

**받은 곡**: `prototype/audio/1-5-you-play-i-pay.mp3`(2:35.7, 94.000 BPM, 61마디, 첫 다운비트 0.055초, 153.2초부터 정적). 실제 구조는 계획과 조금 다름: 지우 비트가 36–43마디 8마디로 길고(계획 4), 브레이크다운이 44–47, 빌드업 48–51, 마지막 훅 52–58, 마지막 한 방 59(곡 마디 기준). 게임 차트는 실제 구조에 맞춤(`docs/stage1.md` 2페이즈 표).

노래를 받으면 할 일(했음):
- 실제 박과 구간이 바뀌는 지점을 찾아 2페이즈 차트와 `battle` 표를 노래에 맞춘다.
- 지금 있는 임시 비트(`diss` 구간)를 받은 음원으로 바꾼다.
- 실제로 부른 시간대로 영어 가사 + 한국어 자막 파일을 만든다.

## 게임과 맞춤 (1마디 = 2.53초)

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

받은 곡의 실제 구조(곡 마디): 0–3 조용한 인트로(저음 없음), 4–7 지우 비트, 8–15 1절, 16–19 훅(2·3박 강세), 20–23 지우 비트, 24–27 2절, 28 정적. 템포는 75.5에서 ±0.03초 안으로 맞음.

## 3라운드(절정) 곡 프롬프트

절정. The Lazy Shift 끝("Play me another")에 지우가 가장 무겁고 센 비트를 튼다. **빠르기보다 무게**: 100 BPM에 하프타임 드럼(체감은 느리고 짓누름), 디스토션 기타 파워코드, 큰 홀 드럼, 찢어지는 808, 하은 목소리를 겹겹이 쌓은 떼창. 49마디, 1:58. 같은 A 단조, 같은 반음 하강 베이스(A–G#–F#–E)를 기타 리프로. 브리지(조용한 4마디)는 심박 킥과 시계처럼 반복되는 피아노 한 음 위에서 하은이 가장 솔직한 말을 한다 → 1-6 병실 심전도로 이어짐("Somebody's waiting"). 마지막(Final)은 단순하게 1라운드의 두 조각만: Tick-tock 훅 4줄, 그리고 "You play, I pay" 벌스(1라운드 2절) 8줄을 이 무거운 비트 위에서 다시.

훅을 "Faster"에서 "Hit it harder"로 바꾼 이유: 가사에 '빠르게'가 반복되면 곡이 속도로만 끌려간다. 이전 프롬프트(110 BPM, "fast, explosive, relentless")는 빠르기만 하고 힘이 안 실렸다.

```
A HEAVY, POWERFUL, anthemic rap-rock / trap-metal track with ONE solo female rapper: the final round of a rap battle on a night shift. It must feel huge and crushing, not fast. Think stadium-sized: every drum hit is a cannon, the guitars are a wall. English rap vocals, one female voice only, no male vocals, no singing. 1:58 long, 100 BPM, 4/4, A minor. Clean lyrics.

The sound:
- Half-time drums: a massive kick and a giant snare with a big hall reverb on beat 3, slow and heavy, like stomping. Trap hi-hats only as a light shimmer on top.
- Thick distorted electric guitars playing low power chords, chugging and palm-muted: the riff walks down by half steps, A, G#, F#, E, one chord per beat, hammered.
- A loud, overdriven 808 sub that shakes the floor, doubling the guitar riff.
- Low brass and choir swells on the downbeats, epic and dark. Big impacts and booms at section starts.
- Mixed loud, wide and aggressive. Lots of space between hits, so each one lands like a punch.

The rapper: a young woman of 23. Low, cold and controlled at first, every word hitting with the snare; she gets louder and more forceful every section, not faster. In the hooks and the final her voice is doubled and tripled, stacked into a chant like a crowd made of her own voice. She breaks only in the quiet bridge, then comes back with everything.

Two kinds of sections:
- BEAT sections (no rap): the guitar riff and the brass at full weight, menacing, like someone trying to crush her. Every BEAT section starts with a huge impact.
- RAP and HOOK sections: the brass drops out, the drums, guitars and 808 stay under her voice. Every RAP section starts with a record scratch.
- Every switch lands exactly on the bar line.

Structure with timestamps (one bar = 2.4 seconds):
0:00–0:10 Intro, BEAT (4 bars): two bars of war drums and a rising swell, then the whole band slams in on bar 3. On the last beat everything cuts to silence for a breath. No rap.
0:10–0:29 Verse 1, RAP (8 bars): record scratch, the drums and guitars crash back in. Heavy, punchy, every line lands on the beat.
0:29–0:38 Hook (4 bars): a stacked chant, shouted, on the beat.
0:38–0:48 BEAT (4 bars): the riff and brass again, heavier, a choir on top. No rap.
0:48–1:07 Verse 2, RAP (8 bars): record scratch; louder, angrier, more weight.
1:07–1:17 Hook (4 bars): the chant again, louder, more layers.
1:17–1:26 Bridge (4 bars): everything drops away except a soft kick pulsing like a heartbeat and one high piano note repeating like a clock. She raps quietly, almost spoken, honest.
1:26–1:55 Final (12 bars): everything back at once, the biggest and heaviest the song gets, a crash and a choir hit on every bar. Only two things: first the old chant "Tick-tock on the line" four times, stacked and shouted (4 bars), then her old verse "You play, I pay" (8 bars), harder than ever. The last line is screamed.
1:55–1:58 Ending: one huge hit on the downbeat of the last bar, then silence. No fade out.

Lyrics (all by the one female rapper):

[Intro – BEAT, no vocals]

[Verse 1 – female rap, heavy, on the beat]
You wanted it harder? Then here it comes
Every box hits the belt like a kick drum
You throw it, I catch it, I don't even flinch
I've been holding this line, I won't give an inch
Turn it up louder, it's still my lane
Every hit that you send just feeds the flame
You play with the rhythm, I carry the weight
You can shake the whole floor, I'm still standing straight

[Hook – stacked chant, shouted]
Hit it harder, I don't break
Hit it harder, every box I take
Hit it harder, shake the floor
Hit it harder, is that all? Give me more

[BEAT, no vocals]

[Verse 2 – female rap, louder]
Night after night and the belt never sleeps
I'm carrying boxes, you're carrying beats
You drop it, I lift it, you laugh, I don't
You tell me "let it go", I tell you "I won't"
Two shifts, one clock, and it's ticking for me
You've got your tomorrow, I've got where I need to be
So bring the whole weight, bring the worst that you've got
I was holding this line, and I'm holding it now

[Hook – stacked chant, louder]
Hit it harder, I don't break
Hit it harder, every box I take
Hit it harder, shake the floor
Hit it harder, is that all? Give me more

[Bridge – quiet, almost spoken]
Every night I count the minutes
Somebody's waiting at the end of it
You don't have to know, and that's alright
Just keep the time tonight

[Final – everything]
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

그래도 힘이 약하게 나오면 위 프롬프트 첫 단락만 아래로 바꿔서 다시 뽑는다(장르 단어를 더 세게):

```
A brutally heavy, earth-shaking trap metal / nu-metal rap anthem with ONE solo female rapper. Crushing down-tuned guitars, slow pounding half-time drums, distorted 808 sub, epic dark choir and brass. Huge, menacing, triumphant, like a boss fight in a stadium. Power over speed. English rap vocals, one female voice only, no male vocals, no singing. 1:58 long, 100 BPM, 4/4, A minor. Clean lyrics.
```
