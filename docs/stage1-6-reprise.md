# 1-6 리프라이즈: "Three Steps Behind" (제미나이 프롬프트)

1-6 컷씬의 마지막, 문 너머 장면 뒤에 붙는 **지우의 되감기 파트**에 깔 노래. "Four Steps Home"(하은)에 답하는 짝곡이라 같은 피아노, 같은 템포(62 BPM, 실제 곡은 61.6), 같은 조(A단조)에서 시작하고, 하은이 "I never had a dream"이라고 했던 데 지우가 답한다. 1-5에서 "누나는 꿈 없어요?"로 하은을 찔렀던 지우가, 하은이 매일 새벽 걷던 길을 뒤따라 걸으며 그 이유를 알게 되고, 대결 때 들었던 하은의 비트(재능)를 떠올린다. 꽃다발은 1-5 끝에 반장이 시킨 "내일 사과해라"의 답.

## 받은 노래 (`prototype/media/three-steps-behind.mp3`)

1:04.8. 가사는 그대로 부름(받아쓰기가 "I'm counting two", "If you count into four"로 잘못 들었지만 실제로는 원래 가사). 1절 7.4초, 프리코러스 23.9초(로파이 비트 들어옴), 코러스 31.7초, "One, two, three, and four" 46.0초, "Let me count with you" 54.6~58.6초, 허밍 아웃트로 ~62초. 템포 62.3 BPM으로 일정(킥 1박, 브러시 스네어 2·4박), 'four'가 4박에 떨어짐. 첫 노래보다 약 4dB 커서 볼륨을 0.55로(첫 노래 0.9). 컷씬 반영은 `docs/stage1.md` 13~15.

노래를 받으면 할 일: 박을 뽑아 지우 파트 심박 줄(지우의 심장: 처음엔 설레서 조금 빠르고 들쭉날쭉하다가 문 앞에서 하은 박에 맞춰짐)을 짜고, 장면 시간을 노래에 맞추고, 가사를 받아 적어 자막을 만든다(하은 노래와 같은 타이포그래피).

## 장면 맞춤

| 노래 | 컷씬(지우) |
|---|---|
| 인트로 0:00–0:05 | 되감기: 문 앞에서 멈춘 화면이 복도 → 로비 → 골목 → 지하철 → 공장 앞으로 빠르게 거꾸로 감김 |
| 1절 0:05–0:20 | 공장 앞, 멀리 작은 하은 뒷모습을 따라감 → 붐비는 열차 한 칸 뒤, 연결 통로 창 너머로 하은을 봄 |
| 프리코러스 0:20–0:30 | 내리는 역 꽃집에서 지갑을 세어 보고 꽃다발을 삼 → 골목, 고양이가 이번엔 지우를 봄. 이어폰으로 하은의 붐뱁 비트(1-5 대결 때 녹음)를 듣고 꽃다발 종이를 넷째 박에 톡 침. 노래에 아주 작은 비트가 들어오는 자리 |
| 코러스 0:30–0:50 | 병원 로비 → **하은이 켜 둔 불이 그대로 켜진 복도**를 걸음 → 502호 앞 |
| 아웃트로 0:50–1:00 | 문 앞. 노크, "누나!"(관객이 ???가 지우였음을 앎) → 문을 가운데 둔 단면, 이번엔 지우 쪽에서 문이 열리는 순간 암전 |

드럼은 하은 노래처럼 없는 게 기본이고, 프리코러스부터 **하은의 붐뱁이 아주 작게** 들어온다(지우 이어폰 속 하은 비트 = 지우가 알아본 하은의 재능). 지우 자신의 색(1-2 EDM)은 부드러운 일렉트릭 피아노로만 살짝.

## 프롬프트 (그대로 붙여 넣기)

```
A tender, quietly hopeful ballad with English vocals, the companion piece to a sad piano ballad. 1:00 long, 62 BPM, 4/4. Starts in A minor and turns to C major in the chorus.

Mood: a 21-year-old young man walking at dawn along the same streets a woman he works with walked an hour before him, to her mother's hospital room, carrying flowers to apologise. He once asked her what her dream was and hurt her; now he understands why she never had time to dream, and he admires the rhythm she has in her hands. Shy, warm, a little nervous, full of feeling he doesn't say out loud. Early morning light, not night anymore.

Vocals: young male, soft and warm, close-mic, slightly husky, gentle and a little shy, mid register, clear natural English diction. Intimate, like singing to himself under his breath. No belting, no falsetto pop runs, no autotune. Natural breaths left in.

Instruments: felt upright piano as the core (the same intimate sound as a sad ballad before it). A warm, muted electric piano (Rhodes-like) answering the piano softly. From the pre-chorus, a very soft lo-fi hip-hop beat: a muffled kick and a brushed, quiet snare on 2 and 4, low in the mix, like a beat heard through someone else's earbuds. Low warm strings in the chorus. No synth bass, no EDM drop, no rap. Slight room reverb, a little tape warmth.

Structure with timestamps:
0:00–0:05 Intro: a reversed piano chord swelling up like a tape rewinding, then one soft piano note.
0:05–0:20 Verse: his voice enters softly, piano only, sparse, A minor.
0:20–0:30 Pre-chorus: the muffled lo-fi kick and brushed snare come in very quietly, with the muted electric piano. Still gentle.
0:30–0:50 Chorus: warmer and fuller, turning to C major. Piano, electric piano, the soft beat, low strings. Hopeful but shy, not loud.
0:50–1:00 Outro: the beat and strings drop out. Piano and a soft hummed line, ending on one held, unresolved piano chord that fades, then silence.

Lyrics:

[Verse]
I asked you what you dream of
You didn't say a word
Now I walk the way you walked
And hear what you have heard

[Pre-chorus]
There's a beat inside your hands
You never let me hear

[Chorus]
Every light you left on
Is leading me to you
Three steps behind you
I'm counting too
One, two, three, and four
Now I know what it's for
If you're counting to four
Let me count with you

[Outro] (hummed)
```

## 길게 다시 뽑기 (프롬프트 v2, 약 2:10)

지우 파트를 늘리고 사람들 속을 걷게 하려고 2절과 브리지를 붙인 버전. 하은 파트(사람 없이 혼자, 어둡게)와 반대로 지우 파트는 **사람들 사이**를 걷는다. 장면 맞춤:

| 노래 | 지우 파트 |
|---|---|
| 인트로 0:00–0:08 | 반장에게 "다녀오겠습니다!" 하고 공장을 나섬 |
| 1절 0:08–0:24 | 아침 거리, 출근하는 사람들 사이 |
| 프리코러스 1 0:24–0:32 (비트 들어옴) | 사람들이 기다리는 승강장, 열차가 들어옴 |
| 코러스 1 0:32–0:48 | 꽉 찬 출근 열차 |
| 2절 0:48–1:04 | 내리는 역, 출구로 가는 사람들 |
| 프리코러스 2 1:04–1:12 (비트 잠깐 빠짐) | 꽃집에서 꽃다발 |
| 코러스 2 1:12–1:28 | 골목, 병원 로비(깬 경비, 기다리는 환자들) |
| 브리지 1:28–1:44 (비트 얇아지고 멀리 모니터 같은 삑) | 병원 복도: 간호사, 링거대 끄는 환자, 노트북 앞에서 박자에 맞춰 키를 누르는 의사(리듬닥터 오마주) |
| 마지막 코러스 1:44–2:00 | 502호 앞, 하나·둘·셋 노크와 넷, 문을 가운데 둔 단면, 하은이 문으로 걸어옴 |
| 아웃트로 2:00–2:10 | 문이 열림, 암전 |

```
A tender, quietly hopeful ballad with English vocals, the companion piece to a dark, sad piano ballad. 2:10 long, 62 BPM, 4/4. Starts in A minor and turns to C major in the choruses.

Mood: a 21-year-old young man walking at dawn along the same streets a woman he works with walked an hour before him, through a city waking up and full of people, to her mother's hospital room, carrying flowers to apologise. He once asked her what her dream was and hurt her; now he understands why she never had time to dream, and he admires the rhythm she has in her hands. Shy, warm, a little nervous, full of feeling he doesn't say out loud. Early morning light, the day beginning around him.

Vocals: young male, soft and warm, close-mic, slightly husky, gentle and a little shy, mid register, clear natural English diction. Intimate, like singing to himself under his breath. No belting, no falsetto pop runs, no autotune. Natural breaths left in.

Instruments: felt upright piano as the core. A warm, muted electric piano (Rhodes-like) answering the piano softly. From the first pre-chorus, a soft lo-fi hip-hop beat: a muffled kick on 1 and a brushed, quiet snare on 2 and 4, low in the mix, like a beat heard through someone else's earbuds. Low warm strings in the choruses. In the bridge, very faint soft electronic beeps on the beat, like distant heart monitors down a hospital hall. No synth bass, no EDM drop, no rap. Slight room reverb, a little tape warmth.

Structure with timestamps:
0:00–0:08 Intro: soft piano and muted electric piano, a few gentle chords in A minor.
0:08–0:24 Verse 1: his voice enters softly, piano only, sparse.
0:24–0:32 Pre-chorus 1: the muffled kick and brushed snare come in very quietly, with the electric piano.
0:32–0:48 Chorus 1: warmer, turning to C major. Piano, electric piano, the soft beat, low strings.
0:48–1:04 Verse 2: the beat stays, a little busier, like a city morning.
1:04–1:12 Pre-chorus 2: the beat drops out; just piano and voice, tender and shy.
1:12–1:28 Chorus 2: the beat returns, fuller and warmer than chorus 1, still gentle.
1:28–1:44 Bridge: the beat thins to just the kick; the faint monitor-like beeps on the beat; piano and voice close and quiet.
1:44–2:00 Final chorus: the warmest part, strings, piano, electric piano and the soft beat together, hopeful but shy, not loud.
2:00–2:10 Outro: everything drops out; piano and a soft hummed line, ending on one held, unresolved piano chord that fades, then silence.

Lyrics:

[Verse 1]
I asked you what you dream of
You didn't say a word
Now I walk the way you walked
And hear what you have heard

[Pre-chorus 1]
There's a beat inside your hands
You never let me hear

[Chorus 1]
Three steps behind you
I'm counting too
Every step you took
Is leading me to you

[Verse 2]
The city's waking up now
A thousand hurried feet
But in the noise I only hear
The count you never speak

[Pre-chorus 2]
I don't have the words to say
So I'm bringing flowers instead

[Chorus 2]
Three steps behind you
I'm counting too
Every light you left on
Is leading me to you

[Bridge]
Down the hall the monitors
Are keeping someone's time
Every heart in here is counting
Yours, and hers, and mine

[Final Chorus]
One, two, three, and four
Now I know what it's for
If you're counting to four
Let me count with you

[Outro] (hummed)
```

한국어 가사(참고): 네 꿈이 뭐냐고 물었지 / 너는 아무 말 없었어 / 이제 네가 걷던 길을 걸어 / 네가 듣던 걸 들어 — 네 손 안에 박자가 있어 / 한 번도 들려주지 않던 — 세 걸음 뒤에서 / 나도 같이 세 / 네가 걸은 걸음마다 / 나를 너에게 데려가 — 도시가 깨어나 / 수많은 바쁜 발소리 / 그 소음 속에서 내게 들리는 건 / 네가 말하지 않던 셈 — 할 말을 못 찾아서 / 대신 꽃을 들고 가 — 세 걸음 뒤에서 / 나도 같이 세 / 네가 켜 두고 간 불들이 / 나를 너에게 데려가 — 복도 끝 모니터들이 / 누군가의 박을 세고 있어 / 여기 모든 심장이 세고 있어 / 너의 것도, 그분의 것도, 나의 것도 — 하나, 둘, 셋, 그리고 넷 / 이제야 그게 뭔지 알아 / 네가 넷까지 센다면 / 나도 같이 셀게

## 한국어 가사 (참고)

네 꿈이 뭐냐고 물었지 / 너는 아무 말 없었어 / 이제 네가 걷던 길을 걸어 / 네가 듣던 걸 들어 — 네 손 안에 박자가 있어 / 한 번도 들려주지 않던 — 네가 켜 두고 간 불들이 / 나를 너에게 데려가 / 세 걸음 뒤에서 / 나도 같이 세 / 하나, 둘, 셋, 그리고 넷 / 이제야 그게 뭔지 알아 / 네가 넷까지 센다면 / 나도 같이 셀게

## 정할 것

- 1-6 마지막 근무의 반장 대사 "신입, 너 그쪽 방면이지. 하은이 따라가."는 따라가는 사람이 지우로 바뀌었으니 고쳐야 함(예: "지우야, 너 그쪽이지. 하은이 따라가.").
- 노래가 1:00보다 길게 나오면 장면 길이를 노래에 맞춤(하은 노래 때처럼).
