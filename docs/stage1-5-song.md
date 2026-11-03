# 1-5 노래: "Right On Time" — 제미나이(Lyria) 프롬프트

1-5 "첫눈에"에 깔 곡. 지우가 하은을 처음 보고 반하는 밤이라 **가볍고 신나는 밴드 팝**, 지우 마음의 노래라 **젊은 남자 솔로 보컬, 달달한 목소리**(남녀 듀엣은 제미나이가 파트를 헷갈려서 피한다). 레퍼런스처럼 **한국어 가사**(해외판 자막은 아래 영어 뜻). 처음에 쓴 영어 가사판은 git 기록에 있다.

**레퍼런스**(사용자가 준 곡, 수치로 분석, 프롬프트에는 곡·가수 이름 안 넣음): 2:48, 실측 **118 BPM**, **가 장조**(A major), 박마다 킥(포 온 더 플로어)에 2·4박 스네어·박수, 밝은 음색(스펙트럼 중심 높음). 한국어 남녀 구분이 애매한 중간 음역(중앙값 약 D4) 보컬, 곡이 후렴 훅으로 바로 열림, "자석처럼 끌리는 첫 만남" 가사, 맑은 일렉 기타가 중심인 K-밴드 팝. 그래서 템포·조·드럼 패턴·악기 결은 그대로 가져오고, 구조는 게임에 맞춘다.

**게임과 맞춤**: 프롬프트에는 곡 길이, 시간, 마디 수를 적지 않는다. 제미나이는 길이와 마디 수를 맞추려다 구조를 뭉개고, 가사가 비트에서 밀린다. 대신 흔한 팝 구조 태그(1절, 프리코러스, 후렴, 간주, 브리지)만 주고, 곡을 받으면 실제 박과 구간을 재서 차트(`docs/stage1.md` 1-5 표)를 곡에 맞춘다. 지금 게임은 엔진 임시 곡(`style: 'pop15'`, 118 BPM)으로 돈다.

| 구간 | 게임 |
|---|---|
| 전주 | 없음 |
| 1절 | 지우가 떠들고 하은을 알아챔 |
| 프리코러스(끝에 거의 정적, 속삭임) | 지우 자랑 → 받아 내는 순간(슬로 모션 컷씬) |
| 후렴 1 | 두근 상자, 분홍, 하트 |
| 간주(기타 리프, 보컬 없음) | 쉬는 구간 또는 지우가 하은을 멍하니 보는 짧은 장면 |
| 2절 → 프리코러스 2 | 지우가 말을 걸어 봄 |
| 후렴 2 | |
| 브리지(반으로 줄어든 비트) | "…박자는 맞네." |
| 마지막 후렴 | 가장 빽빽 |
| 끝 | 마지막 한 방 |

## 프롬프트 (그대로 붙여 넣기)

가사는 짧고 범용적인 첫사랑 노래. **비트에 잘 붙게**: 한 줄 6–8자로 짧고 고르게, 줄 끝소리를 '-아/-어'로 맞추고, 후렴에 "두근두근 두근두근"과 "첫눈에 반했나 봐"를 되풀이하는 훅을 둔다. 마디 수 대신 흔한 팝 구조 태그만. 일터 얘기는 "하역장이 온통 분홍빛이야" 한 줄과 "모자를 눌러쓴 채 시계만 보는 너" 정도. 제미나이가 발음을 못 하는 말은 피한다(핑크빛 → 분홍빛, 콧노래 → 흥얼흥얼).

```
A bright, bouncy, feel-good Korean band-pop song with ONE solo young male singer: a sweet first-sight crush, his heart skipping the moment a quiet girl catches something he dropped without even looking. Sweet, playful and a little silly. Korean vocals with clear, natural Korean pronunciation, one male voice only from start to finish: no female vocals, no second singer, no spoken dialogue, no rap. 118 BPM, 4/4, A major. Clean lyrics.

The sound: bright, jangly clean electric guitars with a catchy guitar riff, a punchy four-on-the-floor kick, a snappy snare and handclaps on 2 and 4, a bouncy melodic bass, sparkling synths and a glockenspiel. Bright, warm, youthful and upbeat.

The singer: a young man of 21 with a sweet, soft, honey-toned voice, warm and a little breathy, like he is smiling while he sings. Tender and cute, never shouting. The short lines sit right on the beat in an easy, bouncy rhythm. The hook "두근두근 두근두근" is sung like a catchy chant, doubled, with "oh-oh" backing vocals by the same male voice.

Song form: intro, verse 1, pre-chorus, chorus, instrumental interlude, verse 2, pre-chorus, chorus, bridge, final chorus, ending.
- Intro: the guitar riff and the drums, no vocals.
- Pre-chorus: the drums build, then at its end almost everything stops for a moment, only a twinkling glockenspiel and a soft heartbeat kick, and he whispers one word.
- Chorus: everything bursts back in, big and happy, handclaps.
- Instrumental interlude: no vocals, the guitar riff takes the lead with the glockenspiel answering it.
- Bridge: half-time and soft, almost a whisper.
- Final chorus: the biggest, doubled vocals and "oh-oh" backing vocals.
- Ending: one big bright hit, then the guitar chord rings out. No fade out.

[Intro]

[Verse 1]
평범한 밤이었어
흥얼흥얼 노래하며
그때 네가 보였어
아무 말도 없이
모자를 눌러쓴 채
시계만 보는 너
나도 몰래 자꾸만
너를 보고 있어

[Pre-Chorus]
손에서 미끄러진
그 순간 네가 잡았어
아무렇지 않게
(whispered) …아

[Chorus]
두근두근 두근두근
멈추질 않아
너만 보면 내 박자가
엉켜 버려
하역장이 온통
분홍빛이야
첫눈에 반했나 봐
첫눈에 반했나 봐

[Interlude - instrumental, no vocals]

[Verse 2]
차가운 한마디도
노래처럼 들려
눈 한 번 마주치려
하루를 세어 봐
너는 늘 앞에 가고
나는 한 걸음 뒤
그래도 좋아
그냥 좋아

[Pre-Chorus]
웃어 준 것도 아닌데
왜 이렇게 좋을까
아무렇지 않게
(whispered) …아

[Chorus]
두근두근 두근두근
멈추질 않아
너만 보면 내 박자가
엉켜 버려
하역장이 온통
분홍빛이야
첫눈에 반했나 봐
첫눈에 반했나 봐

[Bridge - soft]
네가 한 그 한마디
박자는 맞는대

[Final Chorus]
두근두근 두근두근
멈추질 않아
너만 보면 내 박자가
엉켜 버려
하역장이 온통
분홍빛이야
첫눈에 반했나 봐
딱 첫눈에 반했나 봐

[Ending]
```

**막히면**: 첫 문장의 "crush"를 "little crush"로. 가사가 여전히 밀리면 `The singer:` 문단의 "The short lines sit right on the beat"를 "Each short line starts on the downbeat"로 바꾼다. 목소리가 세면 "soft and intimate, close to the microphone"을 붙인다.

**가사 원칙**: 하은 목소리는 넣지 않는다(남자 목소리 하나, 하은 말은 "박자는 맞는대"처럼 전해 듣는 말투로만). 범용적인 첫사랑 가사로 쓰고, 게임과는 몇 줄로만 이어진다: "하역장이 온통 분홍빛이야"는 후렴의 분홍 연출, "모자를 눌러쓴 채 시계만 보는 너"는 하은, "손에서 미끄러진 그 순간 네가 잡았어"는 받아 내는 순간, "너는 늘 앞에 가고 나는 한 걸음 뒤"는 1-7 지우가 하은을 뒤따라 걷는 장면("Three Steps Behind").

## 해외판 자막 (영어 뜻)

| 한국어 | 영어 |
|---|---|
| 평범한 밤이었어 / 흥얼흥얼 노래하며 | It was an ordinary night / humming a little song |
| 그때 네가 보였어 / 아무 말도 없이 | Then I saw you / without a word |
| 모자를 눌러쓴 채 / 시계만 보는 너 | Cap pulled low / only watching the clock |
| 나도 몰래 자꾸만 / 너를 보고 있어 | Before I know it / I keep looking at you |
| 손에서 미끄러진 / 그 순간 네가 잡았어 / 아무렇지 않게 | It slipped from my hands / and you caught it / like it was nothing |
| …아 | …oh |
| 두근두근 두근두근 / 멈추질 않아 | Ba-dum, ba-dum / it won't stop |
| 너만 보면 내 박자가 / 엉켜 버려 | Every time I see you / my rhythm gets tangled |
| 하역장이 온통 / 분홍빛이야 | The whole loading dock / has turned pink |
| 첫눈에 반했나 봐 | I think I fell at first sight |
| 차가운 한마디도 / 노래처럼 들려 | Even your cold words / sound like a song |
| 눈 한 번 마주치려 / 하루를 세어 봐 | To catch your eye just once / I count the day away |
| 너는 늘 앞에 가고 / 나는 한 걸음 뒤 | You always walk ahead / I'm one step behind |
| 그래도 좋아 / 그냥 좋아 | But I like it / I just like it |
| 웃어 준 것도 아닌데 / 왜 이렇게 좋을까 | You didn't even smile / so why do I like it this much |
| 네가 한 그 한마디 / 박자는 맞는대 | The one thing you said / my timing's right |
| 딱 첫눈에 반했나 봐 | I really fell at first sight |
