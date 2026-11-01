# 1-5 노래: 랩 배틀 — 제미나이(Lyria) 프롬프트

1-5 2페이즈(32–72마디)에 깔 랩 배틀. 다툼 끝에 하은이 지우를 밀쳐내자, 자기 벨트로 돌아온 지우가 "좋아요. 그럼 박으로 해요." 하고 비트를 튼다. 둘이 마디를 주고받으며 서로를 깐다. **95 BPM**, 4/4, A 단조(어두운 반음 하강 루프), **1:44**(41마디). 게임은 정적이 끝나는 128박부터 95로 바뀐다(레퍼런스 85보다 올려 더 몰아붙임). 1-6 노래처럼 글로벌 출시용 영어 가사(한국어는 자막).

**비트 레퍼런스**(사용자가 준 곡, 수치로 분석): 85 BPM, 2마디(약 5.6초) 루프 반복, 베이스가 A → G# → F# → E로 반음씩 내려가고 위에 C#·D#·G# 같은 긴장음, 길게 울리는 무거운 저음과 킥, 2·4박 스네어, 촘촘한 하이햇의 붐뱁. 가사 들어가기 전에 드럼이 잠깐 빠졌다 들어옴. 프롬프트에는 곡·가수 이름을 넣지 않는다(거절 사유가 될 수 있음).

**거절 대응**: 처음 버전("tense hip-hop diss battle", "menacing", 실명 같은 이름)은 제미나이가 민감한 주제로 막았다. 그래서 **동료끼리 경쟁하는 콜앤리스폰스 랩 듀엣**으로 쓰고 공격적인 표현은 줄였다. 이름은 실명(JIWOO, HAEUN)으로 써도 됨. "Haeun, why so cold, did the night shift steal your heart?"는 살림. 그래도 막히면: 가사를 빼고 비트만 먼저 받거나, 그 줄의 이름을 "Hey"로.

노래를 받으면 할 일:
- 실제 박과 차례가 바뀌는 지점을 찾아 2페이즈 차트와 `battle` 표를 노래에 맞춘다.
- 지금 있는 임시 비트(`diss` 구간)를 받은 음원으로 바꾼다.
- 실제로 부른 시간대로 영어 가사 + 한국어 자막 파일을 만든다.

## 게임과 맞춤 (1마디 = 2.53초)

| 노래 | 마디(게임) | 차례 | 게임에서 |
|---|---|---|---|
| 0:00–0:10 인트로 | 32–35 | 지우 비트 | 지우가 비트를 틀고 도발. 34마디부터 지우 상자 |
| 0:10–0:30 1절 | 36–43 | 지우 | 지우가 **일부러** 하은 벨트로 상자를 던져 떨어뜨림 |
| 0:30–0:51 2절 | 44–51 | 하은 | 하은 벨트에 정박으로 꽂힘, 지우 벨트는 빔 |
| 0:51–1:11 주고받기 | 52–59 | 2마디씩 지우·하은·지우·하은 | 차례마다 벨트가 바뀜 |
| 1:11–1:21 브레이크다운 | 60–63 | 1마디씩 지우·하은·지우·하은 | 한 마디짜리 긴 화물이 위·아래 번갈아 |
| 1:21–1:41 끝판 | 64–71 | 둘 동시에 | 떨어뜨림과 하은 상자가 번갈아, 끝 두 마디는 박마다 둘이 같이 |
| 1:41–1:44 마지막 한 방 | 72 | 둘 | 두 벨트 같은 박 하나, 그리고 정적 |

곡 전체에 같은 어두운 루프가 깔리고, 지우 차례엔 펑키한 층(슬랩 베이스, 오프비트 코드 스탭)이 얹히고, 하은 차례엔 날것의 루프만 남는다. 하은 차례로 넘어갈 때 레코드 스크래치, 지우 차례로 넘어갈 때 보컬 찹 → 게임의 조명(하은 빨강, 지우 하늘)과 박마다 바닥 진동이 같은 자리에서 바뀐다.

가사 원칙: 반장·허리 얘기 없음. **꿈은 직접 말하지 않는다**(하은은 "Rent. And more." 정도로만, 사정은 1-6에서). 욕 없음.

## 프롬프트 (그대로 붙여 넣기)

```
A dark, swaggering boom bap rap duet: two night-shift coworkers trading competitive call-and-response verses over one beat, each showing off their own style. English rap vocals, no singing. 1:44 long, 95 BPM, 4/4, A minor. Clean lyrics.

The beat (the same loop under the whole song):
- A heavy, dark two-bar loop with a menacing, cinematic feel: the bass line walks down by half steps (A, G#, F#, E), with tense dissonant notes ringing on top.
- Hard-hitting dusty drums: a heavy kick with a long, deep low end, a loud cracking snare on 2 and 4, busy crisp sixteenth-note hi-hats.
- Driving and hard-hitting, pushing forward, but still heavy with lots of room for the vocals.

Voices:
- JIWOO (young man, 20): cocky, playful, bouncy, quick flow with fun ad-libs ("yah!", "uh-huh"). Free-spirited, loves improvising.
- HAEUN (young woman, 23): low, calm, cool, precise, lands every word right on the beat, confident and steady, gets more fired up toward the end.

The turns:
- On JIWOO's turns, a funky layer joins the loop: slap bass and short chord stabs on the off-beats. Every switch to JIWOO starts with a chopped vocal stab.
- On HAEUN's turns, the funky layer drops out and only the raw dark loop is left. Every switch to HAEUN starts with a record scratch.
- The switches land exactly on the bar line.

Structure with timestamps (one bar = 2.5 seconds):
0:00–0:10 Intro (4 bars): the dark loop comes in with the drums; on the last bar the drums cut out and JIWOO says: "Keep up if you can."
0:10–0:30 Verse 1, JIWOO (8 bars): the drums slam back in, his funky layer on top.
0:30–0:51 Verse 2, HAEUN (8 bars): record scratch, the raw loop only. Calm and precise.
0:51–1:11 Back and forth (8 bars): two bars each, JIWOO, HAEUN, JIWOO, HAEUN; the layer switches every two bars.
1:11–1:21 Breakdown (4 bars): the drums drop to just the bass line and claps, half-time feel; one bar each, JIWOO, HAEUN, JIWOO, HAEUN, short lines with space.
1:21–1:41 Final round (8 bars): everything back in, louder, double-time hi-hats, a crash on every bar, quick back-and-forth line by line; the last two bars they rap together in unison.
1:41–1:44 Ending: one big hit on the downbeat of the last bar, then silence. No fade out.

Lyrics:

[Intro – JIWOO, spoken]
Keep up if you can.

[Verse 1 – JIWOO]
Tick-tock, tick-tock, is that all you got?
Eyes on your watch like the world's gonna stop
I throw it with style, let it fly, let it drop
You catch it, you sigh, then you're back to the clock
Straight lines, no swing, every move by the book
Never cracked a smile, never stole a look
I got my own rhythm, I got my own lane
You're stuck on the beat while I'm out here making rain

[Verse 2 – HAEUN]
You throw it, it falls, and it lands next to me
Every box you drop is a box I carry
You call it a flow, I call it a mess
You nap through the shift and I handle the rest
You talk about tomorrow like it's already yours
I'm counting the minutes to the next set of doors
Keep your rhythm, kid, keep it loud in your ears
Some of us can't stop long enough to hear

[Back and forth]
JIWOO: Haeun, why so cold, did the night shift steal your heart?
JIWOO: Every time I start, you're a step behind
HAEUN: Every time you start, I'm the one who has to finish
HAEUN: You play, I pay. That's the difference.
JIWOO: Then drop the watch for once, let the beat take the lead
JIWOO: You don't know what you want, I know what I need
HAEUN: You don't know what I need, you don't know what I've seen
HAEUN: Stay up on your stage. I'll stay down at the machine.

[Breakdown]
JIWOO: Then say it. What's it for?
HAEUN: Rent. And more.
JIWOO: That's it? That's your life?
HAEUN: That's the beat. Keep time.

[Final round]
JIWOO: I throw it! / HAEUN: I catch it!
JIWOO: You're stiff! / HAEUN: You're careless!
JIWOO: My beat! / HAEUN: My belt!
JIWOO: My way! / HAEUN: Every day!
JIWOO: Can't keep up? / HAEUN: Watch me.
JIWOO: One more box! / HAEUN: One more drop!
BOTH: Tick-tock on the line, and nobody's gonna stop
BOTH: Tick-tock on the line, and nobody's gonna stop

[Ending]
(one big hit, then silence)
```

## 가사 뜻 (자막 초안)

| 영어 | 한국어 |
|---|---|
| Keep up if you can. | 따라올 수 있으면 따라와 봐요. |
| Tick-tock, tick-tock, is that all you got? | 째깍째깍, 그게 다예요? |
| Eyes on your watch like the world's gonna stop | 세상 멈출 것처럼 시계만 보고 |
| I throw it with style, let it fly, let it drop | 난 멋있게 던져, 날아가든 떨어지든 |
| You catch it, you sigh, then you're back to the clock | 누난 받고, 한숨 쉬고, 다시 시계 |
| Straight lines, no swing, every move by the book | 곧은 줄, 흔들림 없이, 전부 교과서대로 |
| Never cracked a smile, never stole a look | 웃지도 않고, 한눈도 안 팔고 |
| I got my own rhythm, I got my own lane | 나한텐 내 리듬, 내 길이 있어 |
| You're stuck on the beat while I'm out here making rain | 누난 박에 갇혀 있고, 난 여기서 쏟아붓지 |
| You throw it, it falls, and it lands next to me | 네가 던지면, 떨어지고, 내 옆에 와 |
| Every box you drop is a box I carry | 네가 떨군 상자는 전부 내가 들어 |
| You call it a flow, I call it a mess | 넌 그걸 흐름이라 하고, 난 엉망이라 해 |
| You nap through the shift and I handle the rest | 넌 근무 중에 졸고, 나머진 내가 해 |
| You talk about tomorrow like it's already yours | 넌 내일이 벌써 네 것처럼 말하지 |
| I'm counting the minutes to the next set of doors | 난 다음 문까지 남은 분을 세 |
| Keep your rhythm, kid, keep it loud in your ears | 네 리듬 지켜, 꼬마야, 귀에 크게 틀어 놔 |
| Some of us can't stop long enough to hear | 누군 들을 만큼 멈출 수도 없거든 |
| Haeun, why so cold, did the night shift steal your heart? | 하은 누나, 왜 그렇게 차가워요, 야간이 마음까지 가져갔어요? |
| Every time I start, you're a step behind | 내가 시작하면 누난 한 박 늦어요 |
| Every time you start, I'm the one who has to finish | 네가 시작하면, 끝내는 건 늘 나야 |
| You play, I pay. That's the difference. | 넌 놀고, 난 갚아. 그게 차이야. |
| Then drop the watch for once, let the beat take the lead | 그럼 한 번만 시계 내려놔요, 박이 끌고 가게 |
| You don't know what you want, I know what I need | 누난 뭘 원하는지 모르잖아요, 난 알아요 |
| You don't know what I need, you don't know what I've seen | 넌 내가 뭘 필요한지 몰라, 내가 뭘 봤는지도 |
| Stay up on your stage. I'll stay down at the machine. | 넌 네 무대 위에 있어. 난 기계 앞에 있을게. |
| Then say it. What's it for? | 그럼 말해 봐요. 뭐 때문인데요? |
| Rent. And more. | 월세. 그리고 더. |
| That's it? That's your life? | 그게 다예요? 그게 누나 인생이에요? |
| That's the beat. Keep time. | 그게 박이야. 박이나 맞춰. |
| I throw it! / I catch it! | 내가 던져! / 내가 받아! |
| You're stiff! / You're careless! | 누나 딱딱해! / 넌 대충이야! |
| My beat! / My belt! | 내 비트! / 내 벨트! |
| My way! / Every day! | 내 방식! / 매일매일! |
| Can't keep up? / Watch me. | 못 따라와요? / 봐. |
| One more box! / One more drop! | 하나 더! / 또 떨궈! |
| Tick-tock on the line, and nobody's gonna stop | 라인 위에 째깍째깍, 아무도 안 멈춰 |

"Stay up on your stage / down at the machine"은 지우가 위 벨트(무대), 하은이 아래 벨트(기계)라는 자리를 그대로 쓴 것. "Rent. And more."가 1-6 병원 사정의 유일한 실마리.
