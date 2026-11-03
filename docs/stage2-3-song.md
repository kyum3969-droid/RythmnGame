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
