# 1-5 노래: "Right On Time" — 제미나이(Lyria) 프롬프트

1-5 "첫눈에"에 깔 곡. 지우가 하은을 처음 보고 반하는 밤이라 **가볍고 신나는 밴드 팝**, 지우 마음의 노래라 **젊은 남자 솔로 보컬, 달달한 목소리**(남녀 듀엣은 제미나이가 파트를 헷갈려서 피한다). 레퍼런스처럼 **한국어 가사**(해외판 자막은 아래 영어 뜻). 처음에 쓴 영어 가사판은 git 기록에 있다.

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
A bright, bouncy, feel-good Korean band-pop song with ONE solo young male singer: on a night shift in a warehouse, a cheerful guy falls for a cool, quiet coworker at first sight, the moment she catches a box he dropped without even looking, right on the beat. Sweet, playful and a little silly, like the first rush of a crush. Korean vocals with clear, natural Korean pronunciation, one male voice only, no female vocals, no rap. 1:25 long, 118 BPM, 4/4, A major. Clean lyrics.

The sound:
- Bright, jangly clean electric guitars strumming open major chords, with a catchy guitar riff that comes back in every chorus.
- A punchy four-on-the-floor kick on every beat, a snappy snare and handclaps on 2 and 4, crisp hi-hats.
- A bouncy, melodic bass.
- Sparkling synths and a glockenspiel on top.
- Mixed bright and warm, youthful and upbeat.

The singer: a young man of 21 with a sweet, soft, honey-toned voice, gentle and warm with a little airy breathiness, like he is smiling while he sings. Tender and cute rather than powerful, never shouting. Softly doubled in the choruses, with "oh-oh" backing vocals by the same voice.

Structure (one bar = 2.03 seconds; every change lands exactly on the bar line):
0:00-0:04 Intro (2 bars): the guitar riff and the drums come straight in, bright and happy. No vocals.
0:04-0:18 Verse 1 (7 bars): one line per bar, chatty and cheerful.
0:18-0:22 Build (2 bars): the drums build with a snare roll, everything rising, faster and faster.
0:22-0:26 Breakdown (2 bars): almost everything stops. Only a soft twinkling glockenspiel and a slow, soft heartbeat kick (two thumps, ba-dum). One whispered word.
0:26-0:43 Chorus (8 bars): everything bursts back in at once, big and happy, the guitar riff, handclaps. One line per bar.
0:43-0:59 Verse 2 (8 bars): one line per bar, playful.
0:59-1:03 Bridge (2 bars): half-time and soft, just guitar, bass and glockenspiel, his voice almost a whisper.
1:03-1:19 Final chorus (8 bars): bigger than the first, softly doubled vocals, "oh-oh" backing vocals, handclaps all the way.
1:19-1:25 Ending: one big bright hit on the downbeat, then a short ring-out of the guitar chord. No fade out.

Lyrics (all by the one male singer, in Korean):

[Intro - no vocals]

[Verse 1]
다시 야간조, 이어폰 끼고 기분 좋아
상자 쌓으면서 콧노래를 흥얼거려
그런데 아래 벨트에 처음 보는 얼굴
모자를 꾹 눌러쓰고 인사도 없이
그 손이 닿는 상자는 전부 박에 딱
벨트 전체가 너를 따라 춤추는 것 같아
그래서 좀 더 빨리, 내 실력 보여 줄게

[Build]
봐 봐, 봐 봐, 지금 봐 봐
어어, 그 상자 말고!

[Breakdown - whispered]
…아.

[Chorus]
보지도 않고 받았어, 딱 그 박자에
한 손, 한 박, 내 심장은 박자를 놓쳤어
두근, 두근, 천천히가 안 돼
하역장 불빛이 분홍빛이야, 오오오
"조심해" 그 한마디가 전부였는데
그 상자보다 내가 더 빨리 떨어져
딱 제때, 딱 제때
이게 사랑일까, 밤샘이 날 홀린 걸까

[Verse 2]
내 이름을 말했더니 "상자" 한마디
좋아하는 노래 물었더니 "시끄러"
차가운 말마저 노래처럼 들려
밤새도록 흥얼거려, 라라라라
눈 한 번 마주치려고 초를 세고
네가 지나갈 때마다 상자를 떨궈
너는 늘 박 위에, 나는 늘 한 박 늦게
그래도 좋아, 정말 괜찮아

[Bridge - soft, almost a whisper]
"박자는 맞네" 그 한마디가
머릿속에서 계속 반복 재생 중

[Final chorus]
보지도 않고 받았어, 딱 그 박자에
한 손, 한 박, 내 심장은 박자를 놓쳤어
두근, 두근, 천천히가 안 돼
하역장 불빛이 분홍빛이야, 오오오
"조심해" 그 한마디가 전부였는데
그 상자보다 내가 더 빨리 떨어져
딱 제때, 딱 제때
이게 사랑일까, 밤샘이 날 홀린 걸까

[Ending]
(one big hit, then the chord rings out)
```

**막히면**: 첫 문장의 "falls for a coworker"를 "has a crush on a coworker"로. 그래도 막히면 가사를 빼고 비트만 먼저 받는다(첫 문단의 "ONE solo young male singer"를 "instrumental, no vocals"로, 가사 블록 삭제). 목소리가 너무 세게 나오면 `The singer:` 문단 끝에 "soft and intimate, like singing close to the microphone"을 붙인다.

**가사 원칙**: 하은이 게임에서 실제로 하는 말("…조심해.", "…상자.", "…시끄러.", "…박자는 맞네.")이 가사에 그대로 들어간다. "너는 늘 박 위에, 나는 늘 한 박 늦게"가 1-6 싸움과 1-7 지우의 뒤따라 걷기("Three Steps Behind")의 씨앗.

## 해외판 자막 (영어 뜻)

| 한국어 | 영어 |
|---|---|
| 다시 야간조, 이어폰 끼고 기분 좋아 | Back on the night shift, earbuds in, feeling fine |
| 상자 쌓으면서 콧노래를 흥얼거려 | Humming to myself as I stack the boxes |
| 그런데 아래 벨트에 처음 보는 얼굴 | Then a face I've never seen on the belt below |
| 모자를 꾹 눌러쓰고 인사도 없이 | Cap pulled low, not even a hello |
| 그 손이 닿는 상자는 전부 박에 딱 | Every box her hands touch lands right on the beat |
| 벨트 전체가 너를 따라 춤추는 것 같아 | Like the whole belt is dancing after you |
| 그래서 좀 더 빨리, 내 실력 보여 줄게 | So a little faster, let me show you what I've got |
| 봐 봐, 봐 봐, 지금 봐 봐 / 어어, 그 상자 말고! | Look, look, look at me now / Whoa, not that box! |
| …아. | …oh. |
| 보지도 않고 받았어, 딱 그 박자에 | You caught it without looking, right on the beat |
| 한 손, 한 박, 내 심장은 박자를 놓쳤어 | One hand, one beat, and my heart lost the beat |
| 두근, 두근, 천천히가 안 돼 | Ba-dum, ba-dum, I can't slow it down |
| 하역장 불빛이 분홍빛이야, 오오오 | The loading dock lights are pink, oh-oh-oh |
| "조심해" 그 한마디가 전부였는데 | "Careful", that one word was all |
| 그 상자보다 내가 더 빨리 떨어져 | And I'm falling faster than that box |
| 딱 제때, 딱 제때 | Right on time, right on time |
| 이게 사랑일까, 밤샘이 날 홀린 걸까 | Is this love, or has the night shift got me? |
| 내 이름을 말했더니 "상자" 한마디 | I told you my name, you said one word: "box" |
| 좋아하는 노래 물었더니 "시끄러" | I asked what songs you like, you said "quiet" |
| 차가운 말마저 노래처럼 들려 | Even your cold words sound like a song |
| 밤새도록 흥얼거려, 라라라라 | I hum them all night long, la-la-la-la |
| 눈 한 번 마주치려고 초를 세고 | Counting seconds just to catch your eye |
| 네가 지나갈 때마다 상자를 떨궈 | Dropping boxes every time you pass |
| 너는 늘 박 위에, 나는 늘 한 박 늦게 | You're always on the beat, I'm always a beat behind |
| 그래도 좋아, 정말 괜찮아 | But I like it, really, it's fine |
| "박자는 맞네" 그 한마디가 | "Your timing's right", those few words |
| 머릿속에서 계속 반복 재생 중 | Keep playing on repeat in my head |
