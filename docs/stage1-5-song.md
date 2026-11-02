# 1-5 노래: "Right On Time" — 제미나이(Lyria) 프롬프트

1-5 "첫눈에"에 깔 곡. 지우가 하은을 처음 보고 반하는 밤이라 **가볍고 신나는 밴드 팝**, 지우 마음의 노래라 **젊은 남자 솔로 보컬**(남녀 듀엣은 제미나이가 파트를 헷갈려서 피한다). 1-6·1-7 노래처럼 글로벌 출시용 영어 가사(한국어는 자막).

**레퍼런스**(사용자가 준 곡, 수치로 분석, 프롬프트에는 곡·가수 이름 안 넣음): 2:48, 실측 **118 BPM**, **가 장조**(A major), 박마다 킥(포 온 더 플로어)에 2·4박 스네어·박수, 밝은 음색(스펙트럼 중심 높음). 한국어 남녀 구분이 애매한 중간 음역(중앙값 약 D4) 보컬, 곡이 후렴 훅으로 바로 열림, "자석처럼 끌리는 첫 만남" 가사, 맑은 일렉 기타가 중심인 K-밴드 팝. 그래서 템포·조·드럼 패턴·악기 결은 그대로 가져오고, 구조는 게임에 맞춘다.

**게임과 맞춤 (118 BPM, 1마디 = 2.03초, 42마디)**: 게임은 지금 엔진 임시 곡(`style: 'pop15'`)으로 이 구조대로 돈다. 곡을 받으면 실제 박과 구간을 재서 차트(`docs/stage1.md` 1-5 표)를 곡에 맞춘다.

| 곡 시간 | 마디 | 곡 | 게임 |
|---|---|---|---|
| 0:00–0:04 | 0–1 | 인트로: 기타 리프와 드럼 | 없음 |
| 0:04–0:18 | 2–8 | 1절 | 지우가 떠들고 하은을 알아챔 |
| 0:18–0:22 | 9–10 | 빌드업 | 지우가 빠르게 자랑 |
| 0:22–0:26 | 11–12 | **브레이크다운**: 거의 정적, 반짝이는 종소리와 심장 소리 | 받아 내는 순간(슬로 모션 컷씬) |
| 0:26–0:43 | 13–20 | 후렴 1 | 두근 상자, 분홍, 하트 |
| 0:43–0:59 | 21–28 | 2절 | 지우가 말을 걸어 봄 |
| 0:59–1:03 | 29–30 | 브리지(반으로 줄어든 비트) | "…박자는 맞네." |
| 1:03–1:19 | 31–38 | 마지막 후렴 | 가장 빽빽 |
| 1:19–1:25 | 39–41 | 마지막 한 방, 짧은 여운 | 끝 |

## 프롬프트 (그대로 붙여 넣기)

```
A bright, bouncy, feel-good band-pop song with ONE solo young male singer: on a night shift in a warehouse, a cheerful guy falls for a cool, quiet coworker at first sight, the moment she catches a box he dropped without even looking, right on the beat. Sweet, playful and a little silly, like the first rush of a crush. English vocals, one male voice only, no female vocals, no rap. 1:25 long, 118 BPM, 4/4, A major. Clean lyrics.

The sound:
- Bright, jangly clean electric guitars strumming open major chords, with a catchy guitar riff that comes back in every chorus.
- A punchy four-on-the-floor kick on every beat, a snappy snare and handclaps on 2 and 4, crisp hi-hats.
- A bouncy, melodic bass.
- Sparkling synths and a glockenspiel on top.
- Mixed bright and warm, youthful and upbeat.

The singer: a young man of 21, light and sweet, a little breathless with excitement, doubled in the choruses with "oh-oh" backing vocals by the same voice.

Structure (one bar = 2.03 seconds; every change lands exactly on the bar line):
0:00-0:04 Intro (2 bars): the guitar riff and the drums come straight in, bright and happy. No vocals.
0:04-0:18 Verse 1 (7 bars): one line per bar, chatty and cheerful.
0:18-0:22 Build (2 bars): the drums build with a snare roll, everything rising, faster and faster.
0:22-0:26 Breakdown (2 bars): almost everything stops. Only a soft twinkling glockenspiel and a slow, soft heartbeat kick (two thumps, ba-dum). One whispered word.
0:26-0:43 Chorus (8 bars): everything bursts back in at once, big and happy, the guitar riff, handclaps. One line per bar.
0:43-0:59 Verse 2 (8 bars): one line per bar, playful.
0:59-1:03 Bridge (2 bars): half-time and soft, just guitar, bass and glockenspiel.
1:03-1:19 Final chorus (8 bars): bigger than the first, doubled vocals, "oh-oh" backing vocals, handclaps all the way.
1:19-1:25 Ending: one big bright hit on the downbeat, then a short ring-out of the guitar chord. No fade out.

Lyrics (all by the one male singer):

[Intro - no vocals]

[Verse 1]
Back on the night shift, earbuds in, I'm feeling fine
Stacking up my boxes, humming my own little line
Then I see a new face on the belt down below
Cap pulled low, she doesn't even say hello
Every box she touches lands right on the beat
Like the whole conveyor's dancing to her feet
So I go a little faster, gonna show her what I've got

[Build]
Watch me, watch me, watch me now
Whoa, whoa, not that box!

[Breakdown - whispered]
...oh.

[Chorus]
She caught it without looking, right on time
One hand, one beat, and now my heart is out of line
Ba-dum, ba-dum, I can't keep it slow
Pink lights on the loading dock, oh-oh-oh
She only said "careful", one word, that's all
But I'm falling even faster than that box could fall
Right on time, right on time
Is it love, or just the night shift on my mind?

[Verse 2]
I tell her my name, she just points at my box
I ask her what she's into, she tells me to stop
Every cold word sounds like a song to me
I keep on humming it, la-da-da-dee
Counting every second just to catch her eye
Dropping all my boxes every time she walks by
She's always on the beat and I'm always behind
But I don't even mind, no, I don't even mind

[Bridge - soft]
"Your timing's not bad", that's all she said
Now it's playing on repeat inside my head

[Final chorus]
She caught it without looking, right on time
One hand, one beat, and now my heart is out of line
Ba-dum, ba-dum, I can't keep it slow
Pink lights on the loading dock, oh-oh-oh
She only said "careful", one word, that's all
But I'm falling even faster than that box could fall
Right on time, right on time
Is it love, or just the night shift on my mind?

[Ending]
(one big hit, then the chord rings out)
```

**막히면**: 첫 문장의 "falls for a coworker"를 "has a crush on"으로, 그래도 막히면 가사를 빼고 비트만 먼저 받는다(첫 문단의 "ONE solo young male singer"를 "instrumental, no vocals"로, 가사 블록 삭제). 프롬프트가 길어서 막히면 `The sound:`와 `The singer:` 문단을 한 줄씩으로 줄인다.

**한국어로 받고 싶으면**: "English vocals"를 "Korean vocals"로 바꾸고 가사 블록을 아래 뜻으로 바꿔 넣는다(제미나이는 한국어 발음이 영어보다 덜 또렷하다).

## 가사 뜻 (자막 초안)

| 영어 | 한국어 |
|---|---|
| Back on the night shift, earbuds in, I'm feeling fine | 다시 야간조, 이어폰 끼고, 기분 최고 |
| Stacking up my boxes, humming my own little line | 상자 쌓으면서 나만의 멜로디 흥얼흥얼 |
| Then I see a new face on the belt down below | 그런데 아래 벨트에 처음 보는 얼굴 |
| Cap pulled low, she doesn't even say hello | 모자 깊게 눌러쓰고, 인사도 안 해 |
| Every box she touches lands right on the beat | 그 사람 손이 닿는 상자는 전부 박에 딱 |
| Like the whole conveyor's dancing to her feet | 벨트 전체가 그 사람 발에 맞춰 춤추는 것처럼 |
| So I go a little faster, gonna show her what I've got | 그래서 좀 더 빨리, 내 실력 보여 줘야지 |
| Watch me, watch me, watch me now / Whoa, whoa, not that box! | 봐 봐, 봐 봐, 지금 봐 / 어어, 그 상자 말고! |
| ...oh. | …아. |
| She caught it without looking, right on time | 보지도 않고 받았어, 딱 제때 |
| One hand, one beat, and now my heart is out of line | 한 손, 한 박, 그리고 내 심장은 박자를 놓쳐 |
| Ba-dum, ba-dum, I can't keep it slow | 두근, 두근, 천천히가 안 돼 |
| Pink lights on the loading dock, oh-oh-oh | 하역장에 분홍 불빛, 오오오 |
| She only said "careful", one word, that's all | "조심해", 그 한마디가 전부였는데 |
| But I'm falling even faster than that box could fall | 난 그 상자보다 더 빨리 떨어지는 중 |
| Right on time, right on time | 딱 제때, 딱 제때 |
| Is it love, or just the night shift on my mind? | 이게 사랑일까, 야간 근무에 정신이 나간 걸까? |
| I tell her my name, she just points at my box | 이름을 말하니까, 내 상자만 가리켜 |
| I ask her what she's into, she tells me to stop | 뭘 좋아하냐 물으니까, 그만하래 |
| Every cold word sounds like a song to me | 차가운 말 한마디 한마디가 노래 같아 |
| I keep on humming it, la-da-da-dee | 계속 흥얼거려, 라다다디 |
| Counting every second just to catch her eye | 눈 한 번 마주치려고 초를 세고 |
| Dropping all my boxes every time she walks by | 그 사람이 지나갈 때마다 상자를 떨궈 |
| She's always on the beat and I'm always behind | 그 사람은 늘 박 위에, 난 늘 한 박 늦게 |
| But I don't even mind, no, I don't even mind | 그래도 좋아, 정말 상관없어 |
| "Your timing's not bad", that's all she said | "박자는 맞네", 그 말이 전부였어 |
| Now it's playing on repeat inside my head | 이제 그 말이 머릿속에서 반복 재생 중 |

"She's always on the beat and I'm always behind"가 1-6 싸움("내 박자가 다 꼬여")과 1-7 지우의 뒤따라 걷기("Three Steps Behind")의 씨앗. 게임 대사와 맞춰서, 하은이 실제로 하는 말("…조심해.", "…상자.", "…시끄러.", "…박자는 맞네.")이 가사에 그대로 들어간다.
