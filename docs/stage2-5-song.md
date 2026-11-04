# 2-5 해변의 기타 (제미나이 프롬프트)

2-5 바다(`docs/stage2-4-5-plan.md`)의 플레이 구간에 깔 곡 하나. 반장이 병실에서 마르코에게 준 기타를 마르코가 해 뜨는 해변에서 처음 쳐 본다. 기타줄이 벨트가 되고, **왼손 = 엄지(아래 굵은 줄, 1·3박, 반장의 정박)**, **오른손 = 손가락(위 가는 줄, 엇박, 마르코의 리듬)**.

## 무엇을 담는 곡인가
- **기타 한 대.** 반장의 블루스(1-3, 2-2)를 낡은 어쿠스틱 기타로, 손가락으로 뜯어서. 밴드가 아니라 해변에 앉은 한 사람.
- **엄지와 손가락이 곡 안에서 따로 들려야 한다.** 차트를 곡에서 뽑기 때문. 낮은 줄 = 1·3박에만, 높은 줄 = 그 사이 엇박에 주로. 처음엔 엄지만, 다음에 손가락이 얹힘(게임의 "엄지 → 손가락" 순서 그대로).
- **뒤로 갈수록 마르코의 해변이 스며든다.** 콩가와 셰이커가 작게, 스틸 드럼이 멀리서 기타 가락에 대꾸. 2-2의 해변 펑크처럼 터지지 않고, 해 뜨는 만큼만 밝아짐.
- **해돋이에서 가장 크고 따뜻하게**, 끝은 다시 기타 혼자 처음처럼. 마지막 화음이 길게 울리고 끝(그 뒤 반장 "…바다는 어떠냐.").
- 슬프지 않게. 지치고 후련한, 처음으로 숨 쉬는 느낌.
- **파도, 갈매기, 캔 두드림은 곡에 넣지 않는다.** 게임이 박에 맞춰 직접 깐다(곡에 들어 있으면 박과 어긋남). 줄 감는 소리와 녹슨 줄 소리도 게임 효과음.

## 정한 값
- **88 BPM**, 4/4. 1-1(반장과의 첫 밤)과 2-1 반장의 소울이 88. 곧은 8분이 아니라 **살짝 튀는 느긋한 그루브**면 좋음(셔플로 나와도, 곧게 나와도 차트는 곡에 맞춤). 템포가 다르게 나오면 게임이 곡에 맞춘다.
- **E**(어쿠스틱 블루스에서 개방현이 울리는 조). 블루스식 도미넌트 7화음, E7 – A7 – B7.
- 2분 30초 안팎. 노래·허밍 없음. 페이드 아웃 없이 마지막 화음을 길게 울리고 끝.
- 2-3 때 거절된 낱말(지명, "Chicago blues", "half-time shuffle", "slap bass", "Hey!")은 쓰지 않는다.

## 프롬프트
```
An instrumental acoustic blues piece for one fingerpicked steel-string guitar, joined later by soft hand percussion. No singing, no humming, no nature sounds, no sound effects. 88 BPM throughout, 4/4, in E with bluesy dominant seventh chords (E7, A7, B7). Steady tempo from start to finish, with a relaxed, slightly swung feel. About two and a half minutes. No fade-out: it ends on one long ringing chord.

The mood: dawn on an empty beach. A tired man who has just walked away from a long night of work sits on the sand and plays an old guitar he was given, for the first time. Warm, gentle, relieved, a little rough around the edges, slowly filling with light as the sun comes up. Hopeful, not sad.

Sound: one old acoustic guitar recorded close, warm and woody, with old strings, a little fret noise and finger squeaks, played by hand. Later, very soft congas, a shaker and a distant steel drum. Intimate at the start, open and bright at the end, never loud or busy.

Playing style: fingerpicking with a clearly separate bass and treble. The thumb plays low bass notes on the low strings, only on beats one and three. The fingers play short melody notes and bluesy bends on the high strings, mostly on the offbeats in between. The low part and the high part should be easy to tell apart.

Structure:

Intro: the thumb alone, low bass notes on beats one and three only, quiet and steady, for eight bars.

First verse: the fingers join on the high strings, a simple slow blues melody on the offbeats over the steady thumb, for eight bars.

Second verse: the melody grows fuller with bends and little runs. Very soft congas and a shaker come in underneath, swaying gently, for eight bars.

Interlude: the percussion drops out, the guitar alone, a few ringing harmonics and a short pause, for four bars.

Sunrise: the warmest and brightest part. The guitar plays the melody with fuller strummed chords on the big beats, the congas and shaker return, and a distant steel drum answers each guitar phrase like an echo across the water. Sixteen bars, slowly getting brighter.

Ending: everything drops away except the guitar, the thumb and the fingers alone like the beginning, for four bars, then one slow strummed E chord that rings out for a long time.
```

## 받으면 할 것
- librosa로 템포·격자·구간을 잰다(2-2, 2-3처럼).
- **엄지와 손가락을 나눈다**: 기타를 Demucs로 떼어 낸 뒤 대역으로 나눠서, 저음(약 250Hz 아래) 어택 = 엄지(왼손), 고음 어택 = 손가락(오른손). 엄지가 1·3박에서 벗어나는 자리, 손가락이 정박에 오는 자리를 표시해 두고 차트에서 고른다.
- 구간을 게임 흐름에 맞춘다: 인트로 = 엄지(화면 속 반장의 손이 난간을 같이 두드림), 첫 절 = 손가락이 들어옴(반장 "…그래. 그거."), 둘째 절 = 양손, 간주 = 숨 고르기, 해돋이 = 해가 뜨고 파도·캔 두드림이 박마다, 끝 = 마지막 화음과 파도.
- 곡 앞(혼자 엉망으로 긁기, 전화, 줄 감기)은 곡 없이 게임 소리만. 줄 감기 마지막 줄의 맑은 소리 다음 박이 곡의 첫 박이 되게 이어 붙인다.
