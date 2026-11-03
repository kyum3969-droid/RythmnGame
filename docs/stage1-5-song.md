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

**가사는 지정하지 않는다.** 가사를 정해 주면 제미나이가 비트에 억지로 끼워 넣느라 곡이 어색해진다. 주제와 분위기만 알려 주고 가사는 제미나이가 비트에 맞춰 쓰게 한다. 하은 목소리는 넣지 않는다(남자 목소리 하나). 받은 곡의 가사는 받아쓰기로 확인해서 자막을 만든다.

```
A bright, bouncy, feel-good Korean band-pop song with ONE solo young male singer, about a sweet first-sight crush. Korean lyrics, written to sit naturally on the beat: short, simple, everyday Korean words, a catchy chorus hook that repeats. One male voice only from start to finish: no female vocals, no second singer, no spoken dialogue, no rap. 118 BPM, 4/4, A major. Clean lyrics.

What the song is about: a cheerful guy on an ordinary night sees a quiet, cool girl for the first time. She doesn't even look at him, but when he drops something she catches it without looking, perfectly on time, and his heart skips. Now his heart goes ba-dum, ba-dum and won't slow down, the whole world looks pink, everything she says (even the cold, short words) sounds like a song to him, and he keeps walking one step behind her. Sweet, playful and a little silly, like the first rush of a crush.

The sound: bright, jangly clean electric guitars with a catchy guitar riff, a punchy four-on-the-floor kick, a snappy snare and handclaps on 2 and 4, a bouncy melodic bass, sparkling synths and a glockenspiel. Bright, warm, youthful and upbeat.

The singer: a young man of 21 with a sweet, soft, honey-toned voice, warm and a little breathy, like he is smiling while he sings. Tender and cute, never shouting. Doubled in the choruses, with "oh-oh" backing vocals by the same male voice.

Song form: intro, verse 1, pre-chorus, chorus, instrumental interlude, verse 2, pre-chorus, chorus, bridge, final chorus, ending.
- Intro: the guitar riff and the drums, no vocals.
- Pre-chorus: the drums build, then at its end almost everything stops for a moment, only a twinkling glockenspiel and a soft heartbeat kick, and he whispers one word.
- Chorus: everything bursts back in, big and happy, handclaps.
- Instrumental interlude: no vocals, the guitar riff takes the lead with the glockenspiel answering it.
- Bridge: half-time and soft, almost a whisper.
- Final chorus: the biggest, doubled vocals and "oh-oh" backing vocals.
- Ending: one big bright hit, then the guitar chord rings out. No fade out.
```

**막히면**: "crush"를 "little crush"로. 가사가 너무 길게 나와 비트에서 밀리면 첫 문단에 "few words per line, lots of space between lines"를 붙인다. 목소리가 세면 `The singer:` 끝에 "soft and intimate, close to the microphone"을 붙인다. 발음이 뭉개지는 말이 있으면(예: 핑크빛, 콧노래) "use 분홍빛 instead of 핑크빛"처럼 그 말만 짚어 준다.

**곡을 받으면**: 템포·첫 박·구간을 재서 차트를 맞추고, 받아쓰기로 가사를 확인해 해외판 영어 자막을 만든다. 처음에 쓴 가사판들은 git 기록에 있다.
