# 1-5 노래: "Right On Time" — 제미나이(Lyria) 프롬프트

1-5 "첫눈에"에 깔 곡. 지우가 하은을 처음 보고 반하는 밤이라 **가볍고 신나는 밴드 팝**, 지우 마음의 노래라 **젊은 남자 솔로 보컬, 달달한 목소리**(남녀 듀엣은 제미나이가 파트를 헷갈려서 피한다). 레퍼런스처럼 **한국어 가사**(해외판 자막은 아래 영어 뜻). 처음에 쓴 영어 가사판은 git 기록에 있다.

**레퍼런스**(사용자가 준 곡, 수치로 분석, 프롬프트에는 곡·가수 이름 안 넣음): 2:48, 실측 **118 BPM**, **가 장조**(A major), 박마다 킥(포 온 더 플로어)에 2·4박 스네어·박수, 밝은 음색(스펙트럼 중심 높음). 한국어 남녀 구분이 애매한 중간 음역(중앙값 약 D4) 보컬, 곡이 후렴 훅으로 바로 열림, "자석처럼 끌리는 첫 만남" 가사, 맑은 일렉 기타가 중심인 K-밴드 팝. 그래서 템포·조·드럼 패턴·악기 결은 그대로 가져오고, 구조는 게임에 맞춘다.

**게임과 맞춤**: 프롬프트에는 곡 길이와 시간을 적지 않는다(제미나이가 길이에 맞추느라 구조를 뭉갠다). 구간 순서와 마디 수만 적고, 곡을 받으면 실제 박과 구간을 재서 차트(`docs/stage1.md` 1-5 표)를 곡에 맞춘다. 지금 게임은 엔진 임시 곡(`style: 'pop15'`, 118 BPM)으로 돈다.

| 구간 | 마디 | 게임 |
|---|---|---|
| 전주 | 2 | 없음 |
| 1절 | 7 | 지우가 떠들고 하은을 알아챔 |
| 빌드업 | 2 | 지우가 빠르게 자랑 |
| 브레이크다운(거의 정적, 종소리와 심장 소리) | 2 | 받아 내는 순간(슬로 모션 컷씬) |
| 후렴 1 | 8 | 두근 상자, 분홍, 하트 |
| **간주**(기타 리프, 보컬 없음) | 4 | 새로 넣은 구간: 차트에 맞출 때 쉬는 구간 또는 지우가 하은을 멍하니 보는 짧은 장면 |
| 2절 | 8 | 지우가 말을 걸어 봄 |
| 브리지(반으로 줄어든 비트) | 2 | "…박자는 맞네." |
| 마지막 후렴 | 8 | 가장 빽빽 |
| 끝 | 2 | 마지막 한 방 |

## 프롬프트 (그대로 붙여 넣기)

가사는 짧고 범용적인 첫사랑 노래. 일터 얘기는 후렴의 "하역장 전체가 온통 분홍빛이야" 한 줄로만 비친다. 제미나이가 발음을 못 하는 말은 피한다(핑크빛 → 분홍빛, 콧노래 → 흥얼거리며). 곡 길이와 시간은 적지 않고, 1절 후렴 뒤에 간주(4마디)를 넣었다.

```
A bright, bouncy, feel-good Korean band-pop song with ONE solo young male singer: a sweet first-sight crush, the moment a quiet girl catches something he dropped without even looking and his heart skips. Sweet, playful and a little silly. Korean vocals with clear, natural Korean pronunciation, one male voice only from start to finish: no female vocals, no second singer, no spoken dialogue, no rap. 118 BPM, 4/4, A major. Clean lyrics.

The sound:
- Bright, jangly clean electric guitars strumming open major chords, with a catchy guitar riff that comes back in every chorus and in the instrumental interlude.
- A punchy four-on-the-floor kick on every beat, a snappy snare and handclaps on 2 and 4, crisp hi-hats.
- A bouncy, melodic bass.
- Sparkling synths and a glockenspiel on top.
- Mixed bright and warm, youthful and upbeat.

The singer: a young man of 21 with a sweet, soft, honey-toned voice, gentle and warm with a little airy breathiness, like he is smiling while he sings. Tender and cute rather than powerful, never shouting. Softly doubled in the choruses, with "oh-oh" backing vocals by the same male voice only.

Structure (every change lands exactly on the bar line). Few words, lots of room: each line is sung over about two bars.
1. Intro (2 bars): the guitar riff and the drums come straight in, bright and happy. No vocals.
2. Verse 1 (7 bars): four lines, relaxed.
3. Build (2 bars): the drums build with a snare roll, everything rising. One short line.
4. Breakdown (2 bars): almost everything stops. Only a soft twinkling glockenspiel and a slow, soft heartbeat kick (two thumps, ba-dum). The male singer whispers one word.
5. Chorus (8 bars): everything bursts back in at once, big and happy, the guitar riff, handclaps. Four lines.
6. Instrumental interlude (4 bars): NO vocals. The guitar riff takes the lead over the full band, with the glockenspiel answering it, bright and bouncy.
7. Verse 2 (8 bars): four lines.
8. Bridge (2 bars): half-time and soft, just guitar, bass and glockenspiel. One line, almost a whisper.
9. Final chorus (8 bars): bigger than the first, softly doubled vocals, "oh-oh" backing vocals, handclaps all the way. Four lines.
10. Ending: one big bright hit on the downbeat, then a short ring-out of the guitar chord. No fade out.

Lyrics (all by the one male singer, in Korean):

[Intro - instrumental, no vocals]

[Verse 1]
평범한 밤이었어, 늘 그렇듯이
흥얼거리며 시간을 보냈지
그때 네가 보였어, 아무 말 없이
세상이 잠깐 느려진 것 같아

[Build]
어, 어, 잠깐만

[Breakdown - the male singer whispers]
…아.

[Chorus]
두근두근, 멈추질 않아
너 하나에 내 박자가 엉켜 버렸어
하역장 전체가 온통 분홍빛이야
이게 사랑인가 봐, 첫눈에

[Interlude - instrumental, no vocals, guitar riff]

[Verse 2]
차가운 한마디도 노래 같아
눈 한 번 마주치려 하루를 세
너는 늘 앞에, 나는 한 걸음 뒤
그래도 좋아, 그냥 좋아

[Bridge - soft, almost a whisper]
네가 웃어 준 것도 아닌데

[Final chorus]
두근두근, 멈추질 않아
너 하나에 내 박자가 엉켜 버렸어
하역장 전체가 온통 분홍빛이야
이게 사랑인가 봐, 딱 첫눈에

[Ending]
(one big hit, then the chord rings out)
```

**막히면**: 첫 문장의 "crush"를 "a little crush"로, 그래도 막히면 가사를 빼고 비트만 먼저 받는다(첫 문단의 "ONE solo young male singer"를 "instrumental, no vocals"로, 가사 블록 삭제). 목소리가 너무 세게 나오면 `The singer:` 문단 끝에 "soft and intimate, like singing close to the microphone"을 붙인다.

**가사 원칙**: 하은 목소리는 넣지 않는다(남자 목소리 하나). 범용적인 첫사랑 가사로 쓰고, 게임과는 두 줄로만 이어진다. "하역장 전체가 온통 분홍빛이야"는 후렴의 분홍 연출과, "너는 늘 앞에, 나는 한 걸음 뒤"는 1-7 지우가 하은을 뒤따라 걷는 장면("Three Steps Behind")과 맞물린다.

## 해외판 자막 (영어 뜻)

| 한국어 | 영어 |
|---|---|
| 평범한 밤이었어, 늘 그렇듯이 | It was an ordinary night, like always |
| 흥얼거리며 시간을 보냈지 | Humming the time away |
| 그때 네가 보였어, 아무 말 없이 | Then I saw you, without a word |
| 세상이 잠깐 느려진 것 같아 | Like the world slowed down for a moment |
| 어, 어, 잠깐만 | Oh, oh, wait a second |
| …아. | …oh. |
| 두근두근, 멈추질 않아 | Ba-dum, ba-dum, it won't stop |
| 너 하나에 내 박자가 엉켜 버렸어 | Just you, and my rhythm's all tangled up |
| 하역장 전체가 온통 분홍빛이야 | The whole loading dock has turned pink |
| 이게 사랑인가 봐, 첫눈에 | I guess this is love, at first sight |
| 차가운 한마디도 노래 같아 | Even your cold words sound like a song |
| 눈 한 번 마주치려 하루를 세 | I count the whole day just to catch your eye |
| 너는 늘 앞에, 나는 한 걸음 뒤 | You're always ahead, I'm a step behind |
| 그래도 좋아, 그냥 좋아 | But I like it, I just like it |
| 네가 웃어 준 것도 아닌데 | And you didn't even smile at me |
| 이게 사랑인가 봐, 딱 첫눈에 | I guess this is love, right at first sight |
