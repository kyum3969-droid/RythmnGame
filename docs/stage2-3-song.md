# 2-3 합주곡 (제미나이 프롬프트)

2-3 「합주」(`docs/stage2.md`) 2페이즈에 깔 곡 하나. 1페이즈(냉전)는 곡 없이 라인 소리만이라 곡이 필요 없다.

## 무엇을 담는 곡인가
- 2-2에서 서로 뺏던 두 음악(반장 라디오의 시카고 셔플 블루스, 마르코 붐박스의 해변 펑크)이 **처음으로 한 곡**이 된다.
- 다만 1-4가 이미 "블루스 + 펑크 → 블루스 펑크"였어서, 이번엔 **느린 해변 레게 블루스**로 간다. 마르코의 해변 소리(스틸 드럼, 콩가, 셰이커)가 **반장의 느린 셔플로 내려와** 맞춰 주는 곡이다. 마르코가 반장의 속도로 와 주는 것이 곡 자체다.
- 그림은 **새벽의 시카고 호숫가 해변**: 모래사장 건너 스카이라인, 첫 햇빛. 지쳤지만 안도하는, 싸움을 그친 두 사람의 느긋한 웃음. 슬프지 않게.
- **곡의 첫 소리 = 상자 두드리는 소리.** 게임에서는 반장이 성한 왼손으로 상자를 두드리고("…하나." "…둘."), 그 두드림이 그대로 곡의 인트로로 이어진다. 그래서 인트로는 두드림만 두 마디 나온 뒤 기타가 들어온다.
- 곡 구조에 **주고받기**(기타가 부르고 스틸 드럼이 받음)가 있으면 차트도 반장 쪽 한 마디, 마르코 쪽 한 마디로 주고받게 짤 수 있다.

## 정한 값
- **74 BPM**, 4/4, 8분이 셔플로 튀는 느낌(12/8처럼). 1페이즈의 모터 덜컹도 같은 74로 맞춰서 곡이 들어올 때 손이 끊기지 않게 한다. 곡이 다른 템포로 나오면 1페이즈를 곡에 맞춘다.
- **A♭ 장조**(2-2 블루스와 같은 조). 블루스식 도미넌트 7화음.
- 2분 30초~3분. 노래·허밍 없음. 끝은 페이드 아웃 없이 마지막 한 방.

## 프롬프트
```
An instrumental slow beach reggae blues. No singing, no humming. 74 BPM throughout, 4/4 with a lazy swung shuffle feel, A-flat major with bluesy dominant seventh chords. Steady tempo from start to finish. About two and a half to three minutes. Ends with one last hit, no fade-out.

The mood: dawn on a city beach by a huge lake, the downtown skyline across the sand, the first sunlight on the water. Two tired friends who just stopped arguing, sitting together, relieved and smiling. Warm, unhurried, gentle and quietly joyful. Not sad.

Sound: warm and close, like a small band playing on the sand at sunrise. Deep round bass, soft but clear drums, lots of space between the notes.

Instruments: a flat hand thumping on a cardboard box (a dry, close, woody thump), one-drop reggae drums with a swung shuffle feel (rimshot and kick together on beat three), a deep round bass, an offbeat guitar skank and a bubbling organ, a clean electric blues guitar with a little slide, a bright steel drum, congas and a shaker, a soft horn section (trumpet, trombone, saxophone).

Structure:

Intro: the hand thumping on the cardboard box alone, on every beat, for two bars. Then a lone clean blues guitar plays a slow, lazy shuffle lick over the thumps for two bars.

Groove: the band comes in gently on the one-drop, the bass walking slowly, the organ bubbling, the box thump still there on every beat.

Call and response: the blues guitar plays a phrase, the steel drum answers it, trading back and forth bar by bar.

Lift: the soft horns come in underneath with long warm chords, the congas get a little busier.

Chorus: the blues guitar, the steel drum and the horns play one warm, simple, singable hook together, like the sun coming up.

Breakdown: everything drops out except the box thump, the rimshot and the bass, quiet, for four bars, then a slow timbale roll building back up.

Final chorus: the fullest part of the song, the hook with the horns an octave higher, the blues guitar playing a short solo that the steel drum answers.

Ending: the band stops on a warm held chord, and one last thump on the box.
```

## 받으면 할 것
- librosa로 템포·격자·구간을 재고(2-2처럼), 인트로 두드림 두 마디의 첫 박 위치를 잡아 반장의 두드림 연출과 맞춘다.
- 주고받기 구간(기타 ↔ 스틸 드럼)을 찾아 반장 쪽·마르코 쪽 차례를 나눈다.
- 후렴 자리 = 양쪽 짝 상자, 브레이크다운 = 두드림과 정박만, 마지막 후렴 = 잔량 0과 해 뜨는 자리.
