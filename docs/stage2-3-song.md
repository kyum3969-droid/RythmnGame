# 2-3 합주곡 (제미나이 프롬프트)

2-3 「합주」(`docs/stage2.md`) 2페이즈에 깔 곡 하나. 1페이즈(냉전)는 곡 없이 라인 소리만이라 곡이 필요 없다.

## 무엇을 담는 곡인가
- 2-2에서 서로 뺏던 두 음악(반장 라디오의 시카고 셔플 블루스, 마르코 붐박스의 해변 펑크)이 **처음으로 한 곡**이 된다. 장르는 **블루스 펑크**(1-4와 같은 장르를 일부러 한 번 더, 사용자).
- **108 BPM 하프타임 셔플 펑크**: 2-2의 블루스(54)와 펑크(108)가 같은 격자였던 걸 그대로 잇는다. 셔플의 출렁임은 반장, 108의 속도와 브라스는 마르코. 1-4의 블루스 펑크와 다르게 **해변 소리(콩가, 스틸 드럼)와 시카고 블루스(그릿 있는 기타, 하모니카)**가 같이 있다.
- 그림은 **새벽의 시카고 호숫가 해변**: 모래사장 건너 스카이라인, 첫 햇빛. 밤새 싸우다 같이 일을 끝낸 두 사람의 후련하고 신나는 기분. 슬프지 않게.
- **곡의 첫 소리 = 상자 두드리는 소리.** 게임에서는 허리를 다친 반장이 상자 위에 앉아 손바닥으로 옆 상자를 두드리고("…하나." "…둘."), 그 두드림이 그대로 곡의 인트로로 이어진다. 그래서 인트로는 두드림만 두 마디 나온 뒤 기타가 들어온다.
- 곡 구조에 **주고받기**(블루스 기타가 부르고 브라스와 스틸 드럼이 받음)가 있으면 차트도 반장 쪽 한 마디, 마르코 쪽 한 마디로 주고받게 짤 수 있다.
- 2-2의 교훈(`docs/stage2-2-song.md` 「펑크가 밋밋했던 이유」): 장조, 크고 밝은 소리, 빌드업과 드롭의 대비, 큰 한 방에만 "Hey!".

## 정한 값
- **108 BPM**, 4/4, 하프타임 셔플(8분과 16분이 셔플로 튐, 스네어는 3박). 1페이즈의 모터 덜컹도 같은 108로 맞춰서 곡이 들어올 때 손이 끊기지 않게 한다. 곡이 다른 템포로 나오면 1페이즈를 곡에 맞춘다(2-2처럼 조금 늘리거나 줄이는 것도 됨).
- **A♭ 장조**(2-2 블루스와 같은 조). 블루스식 도미넌트 7화음.
- 2분 30초~3분. 노래·허밍 없음. 끝은 페이드 아웃 없이 마지막 한 방.

## 프롬프트
```
An instrumental blues funk track on a half-time shuffle groove. No singing, no humming. 108 BPM throughout, 4/4, A-flat major with bluesy dominant seventh chords. Steady tempo from start to finish. About two and a half to three minutes. Ends with one big final hit, no fade-out.

The mood: sunrise on a city beach by a huge lake, the downtown skyline across the sand, the first light on the water. Two friends who argued all night and then finished the job together, relieved, laughing, a little tired and very happy. Warm, uplifting, groovy, joyful. Not sad.

Sound: big, warm and bright, like a band playing live on the sand at dawn. A deep swinging groove, punchy drums, a fat bass, wide horns. Energy, but never rushed.

Instruments: a flat hand thumping on a cardboard box (a dry, close, woody thump), a half-time shuffle drum groove with ghost notes on the snare and the backbeat on beat three, a funky slap bass that swings, a gritty Chicago blues electric guitar, a blues harmonica, a big brass section (trumpets, saxes, trombones), congas and a shaker, a bright steel drum. Occasional group shouts of "Hey!" on the big hits only, no other vocals.

Structure:

Intro: the hand thumping on the cardboard box alone, on every beat, for two bars. Then a lone gritty blues guitar plays a slow shuffle lick over the thumps for two bars. Then a huge brass hit and the whole band comes in.

Groove: the half-time shuffle, the slap bass swinging, the congas busy, the box thump still there on every beat.

Call and response: the blues guitar plays a phrase, the brass and the steel drum answer it, trading back and forth bar by bar. The harmonica joins the guitar's side.

Build-up: everything drops out except the box thump, the kick and the congas, a rising brass swell and a timbale roll.

Drop: a huge hit with a "Hey!" shout, and the blues guitar, the harmonica, the brass and the steel drum play one loud, warm, singable hook together, the whole band at full power.

Breakdown: everything drops out except the box thump and the bass, quiet, for four bars, then a slow build back up.

Final drop: the biggest part of the song, the hook with the brass an octave higher, the blues guitar playing a short solo that the brass answers, a crash on every bar.

Ending: one big final hit, and one last thump on the box.
```

## 받으면 할 것
- librosa로 템포·격자·구간을 재고(2-2처럼), 인트로 두드림 두 마디의 첫 박 위치를 잡아 반장의 두드림 연출과 맞춘다.
- 주고받기 구간(기타 ↔ 브라스·스틸 드럼)을 찾아 반장 쪽·마르코 쪽 차례를 나눈다.
- 드롭 자리 = 양쪽 짝 상자, 브레이크다운 = 두드림과 정박만, 마지막 드롭 = 잔량 0과 해 뜨는 자리.

## 받은 곡: "First Light on the Sand" (2026-11-03)
`prototype/audio/2-3-first-light-on-the-sand.mp3`, 2:38.4, 사용자가 생성(저작권 문제로 첫 프롬프트가 거절돼 "half-time shuffle", "Chicago blues", 지명, slap bass, "Hey!"를 뺀 두 번째 프롬프트로 뽑음).
- **템포 105.99 BPM**, 처음부터 끝까지 아주 고름(10초 창마다 위상 흔들림 ±8ms). 셔플이 아니라 **곧은 8분**으로 나왔다(박과 반 박에 몰림). 게임 템포도 105.99.
- **격자**: 박 k = 0.365 + 0.56609·k 초, 마디 = 4박(2.2644초), 0마디 = 0.365초.
- **구간(마디)**: 0~2 상자 두드림만(아주 작게, 1·3박 + 밀어 치는 한 방) / 3~6 기타 혼자(6마디는 거의 빔) / **7 밴드가 들어옴**(16.2초) / 7~23 그루브 / 24~43 주고받기(짝수 마디 기타, 홀수 마디 브라스가 더 밝음) / 44~53 드롭 / 54~57 브레이크다운(고음이 빠짐), 58~60 다시 쌓임 / **61~64 마지막 드롭** / 65~67 끊어 치기 / **68마디의 마지막 한 방**(곡 박 272.5, 154.6초), 155.5초에 끝.
- 게임에선 **게임 박 108 = 곡 박 0**(`songs.at` 108, `lead` 0.365). 곡의 두드림이 작아서 게임이 같은 자리에 두드림 소리를 더 깐다.

## 마르코 혼자 구간의 첩보물 음악 (2026-11-04)
지금은 엔진 악기로 만든 오리지널 큐가 깔려 있다(E단조, 84~116, 32박 ≈ 18초). 녹음 곡으로 바꾸려면 아래 프롬프트로. **특정 영화·곡·작곡가 이름은 넣지 않는다**(저작권 거절). 유명한 첩보 테마의 상징인 5/4 박자도 피하고 4/4로.

- 106 BPM, 4/4(게임 격자 105.99에 맞춤). 첫 브라스 한 방 = 게임 박 84.
- 1분 30초쯤으로 길게 뽑아 둔다: 지금은 앞 32박만 쓰지만, 구간이 길어지거나 다른 스테이지(마르코가 혼자 허둥대는 장면)에서 다시 쓸 수 있게 구간마다 성격을 다르게(잠입 → 추격 → 대혼란 → 뚝).
- 마지막은 테이프가 멈추듯 뚝. 게임은 엉킴(116)에서 곡을 자른다.
- 받으면: librosa로 첫 한 방 위치와 템포를 재서 `songs`에 넣고(at 84), 엔진 큐(`htEvents`의 spy cue)는 끈다.

```
An original instrumental spy-caper track. No vocals, no humming, no spoken words. 106 BPM, steady from start to finish, 4/4 time throughout, E minor. About one minute and thirty seconds. Ends by stopping dead, like a tape being yanked, no fade-out and no final chord.

The mood: a clumsy one-man heist in a huge warehouse at night. One young man in a loud shirt is dashing between four conveyor belts, trying to do four people's work at once. Tense and fast, but comic and a little ridiculous: he is brave, he is fast, and he is slowly losing control. Never dark or scary; it should make you grin.

Sound: tight, dry and punchy, like a small studio band in a cramped room. Clear, separate instruments, lots of space between the hits, a big low end. Not orchestral, not epic, not electronic.

Instruments: a driving electric bass ostinato on straight eighth notes, tight sixteenth-note closed hi-hats, a dry snare rim click on beats two and four, a punchy kick, bongos and a cabasa, short muted trumpet and trombone stabs, a twangy baritone guitar with tremolo that answers the brass, a vibraphone for sneaky moments, low pizzicato strings, and a rising string tremolo for tension.

Structure:

Intro: one sharp brass hit with a cymbal choke, then straight into the bass ostinato and the ticking hi-hats. No slow intro.

Sneaking (8 bars): the bass ostinato, the hats, the rim click. Every two bars a short muted brass stab figure, and the baritone guitar answers it with a twangy two-note reply. Pizzicato strings tiptoe underneath. Sly and light on its feet.

Chase (8 bars): the bongos come in busy, the kick doubles, the brass stabs come every bar, the vibraphone plays a nervous little run that keeps going up. Faster feeling but the same tempo.

Close calls (8 bars): sudden stops: the whole band hits one stab and goes silent for half a bar, then the bass jumps back in, three times, as if he barely caught something falling. A comic trombone slide down after each stop.

Chaos (8 bars): everything at once, getting messier and busier: the bass jumps up an octave, the brass stabs pile on top of each other, the string tremolo rises higher and higher, a snare roll builds over the last two bars.

Ending: at the very top of the build, it stops dead, like a tape being yanked. Silence.
```
