# 2-2 노래 두 곡 (제미나이 프롬프트)

2-2 「천천히」(`docs/stage2.md`)에 깔 곡 둘. **1페이즈 기싸움**에선 두 곡이 나란히 흐르며 주도권을 쥔 쪽 곡이 올라오고, **2페이즈**엔 블루스만.
- **반장 라디오의 셔플 블루스: "Monday Without a Clock"**(받음, 아래 분석). **54 BPM, A♭.**
- **마르코 붐박스의 해변 펑크: "The Solstice Parade"**(받음, 아래 분석). 원본 106을 **107.97 BPM**(블루스의 딱 두 배)로 늘려 씀, E 장조. 블루스 한 마디 = 펑크 두 마디라 격자가 그대로 맞고, 기싸움이 그대로 **천천히 대 빨리**.
- 라디오 느낌(좁은 대역, 잡음)은 게임이 입히니(`radio`, `lofi`) 곡은 깨끗하게 받는다.

## 받은 블루스: "Monday Without a Clock" (2026-11-02)
`prototype/audio/2-2-monday-without-a-clock.mp3`, 3:00.9, 사용자가 생성("노래 진짜 잘뽑힘").
- **템포 53.99 BPM**(프롬프트의 64가 아니라 54로 나옴), 처음부터 끝까지 일정. 마디 첫 박의 어긋남 대개 ±15ms, 가장 큰 것 ±37ms(사람이 친 느낌). 마지막 두 마디(37~38)는 느려짐(리타르단도), 마지막 화음은 172.9초쯤 격자 밖.
- **셔플 분명**: 하이햇이 박과 박의 3분의 2 자리, 스네어 2·4박, 킥은 매 박.
- **조는 A♭**(프롬프트의 A가 아님). 베이스가 A♭ – E♭(근음 – 5음)를 오가며 걷고, D♭(IV) · E♭(V)로 감. 교과서 12마디보다 자유로움.
- **격자**: 박 k = 0.052 + 1.1114·k 초. 마디 n의 첫 박 = 박 2 + 4n (0마디 = 2.27초).
- **구간(마디)**: 0 앞의 반 마디와 0마디 = 기타 혼자 턴어라운드(작게) / **1마디(6.72초) 밴드가 한 방에 들어옴** / 1~12 첫 바퀴 / 13~24 둘째 바퀴(기타가 더 바빠짐) / 25~34 셋째 바퀴, 기타 솔로 쪽(가장 밝음, 26마디가 정점) / 35~38 작아지며 끝(턴어라운드, 느려짐, 마지막 화음).
- 음원 분리 전. 차트를 짤 때 Demucs로 나눠 기타 솔로 자리와 베이스의 걸음을 다시 확인.

## 받은 펑크: "The Solstice Parade" (2026-11-02)
원본 2:40.3, 사용자가 생성(위 해변 펑크 프롬프트).
- **원본 템포 105.99 BPM**, 처음부터 끝까지 아주 고름(박마다 어긋남 표준편차 4~10ms). 블루스의 두 배(107.97)보다 1.9% 느려서, **rubberband로 음높이는 그대로 두고 템포만 1.0187배**로 늘려 저장: `prototype/audio/2-2-the-solstice-parade.mp3`(2:37.3, **107.97 BPM**, 다시 재서 확인). 블루스 한 마디 = 이 곡 두 마디가 정확히 맞음.
- **조는 E 장조**(프롬프트의 A♭이 아님). 블루스(A♭)와 겹치면 어긋나지만, 둘이 같이 크게 울리는 건 과열 두 마디(불협이 오히려 맞음)와 바뀔 때 짧은 크로스페이드뿐이라 그대로 씀.
- **격자(늘린 파일)**: 박 k = 0.072 + 0.55571·k 초. 마디 첫 박은 박 1 + 4n(크래시와 저음이 그 자리에 몰림), 0마디 = 0.628초.
- **구간(대략, 박 번호)**: 1~8 시작하자마자 브라스 한 방과 밴드 / 9~15 작아짐(타악기) / 16~47 킥이 들어온 그루브 / 48~83 킥이 빠진 그루브 / 84~95 가장 작은 구간(빌드업) / 96.5 다시 커짐 / **112부터 킥과 함께 꽉 찬 드롭**(~191) / 192 한 방, 193~195 잠깐 빠짐 / **196부터 마지막 드롭**(~270) / 271~273 끊어 치기, 275.4 마지막 한 방(격자 밖), 그 뒤 잔향. 음원 분리 전이라 대략. 차트 짤 때 다시 확인.

## 펑크가 밋밋했던 이유 (2026-11-02)
지금까지 펑크 프롬프트(2-1 포함)가 밋밋하게 나온 건 프롬프트 탓:
1. **단조**(C·E·F 단조)를 줬다. 단조 펑크는 "쿨하고 어두운" 쪽이라 신나지 않음. → **장조**.
2. **"dry, tight, no reverb"**를 줬다. 작고 얌전한 소리가 됨. → **크고 밝고 시끄럽게(무대 소리)**.
3. **킥 1·3, 스네어 2·4의 정통 펑크**는 원래 느긋하게 끄덕이는 리듬. → **포 온 더 플로어**(킥 매 박 + 박수 2·4 + 엇박 오픈 햇)로 춤추는 리듬.
4. **빌드업과 드롭이 없었다**("쉬는 구간 없이 쌓이기만"). 터지는 맛은 대비에서 나옴. → 빌드업 → 드롭을 여러 번.
5. **사람 소리가 없었다.** → 큰 한 방에 여럿이 외치는 "Hey!"만 허용(가사, 노래는 없음).

## 마르코 붐박스의 해변 펑크 (다시 뽑기)
128 장조 파티 펑크(위 다섯 가지 반영) 다음 요청: **해변, 백사장, 피서지 느낌.** 마르코의 꽃무늬 셔츠가 원래 하와이안 셔츠라 딱 맞고, 새벽 창고에서 한여름 해변 음악이 터지는 웃긴 대비. 블루스에 맞춰 **108 BPM, A♭ 장조**.
- 해변 소리는 **라틴 타악기(콩가, 팀발레스, 셰이커), 스틸 드럼, 서프 기타, 삼바 호루라기**로. 킥은 포 온 더 플로어 그대로(춤추는 리듬).
- 마르코 차례가 시작될 때마다 이 곡의 **드롭 자리로 바로 들어가게** 할 수 있어서 드롭이 여러 번 있는 곡이 좋음.

```
An instrumental beach party funk track on a four-on-the-floor beat. No singing, no humming. 108 BPM throughout, 4/4, A-flat major. Steady tempo from start to finish. Ends with one big final hit, no fade-out.

The mood: the hottest day of summer vacation at a packed beach resort. White sand, blazing sun, waves, beach umbrellas, everyone dancing barefoot at a seaside party. Sunny, carefree, euphoric and cheeky, makes you want to run into the sea.

Sound: big, bright and loud, like an open-air stage on the beach. Huge punchy drums, a fat bouncy bass, wide horns, lots of hand percussion. Energy over subtlety.

Instruments: a four-on-the-floor kick, handclaps on 2 and 4, open hi-hats on every offbeat, congas, timbales and shakers playing busy Latin rhythms, a bright steel drum, a twangy surf guitar with spring reverb, a funky slap bass, a big brass section (trumpets, saxes, trombones) playing loud unison riffs, a samba whistle on the big hits. Occasional group shouts of "Hey!" on the big hits only, no other vocals.

Structure:

Intro: congas and shakers alone with a samba whistle, a timbale roll building up, then a huge brass hit.

Groove: the full band on the four-on-the-floor beat, the bass bouncing, the surf guitar twanging short licks, the congas busy.

Build-up: everything drops out except the kick and the congas, a rising timbale roll and a brass swell, getting louder and louder.

Drop: a huge hit with a "Hey!" shout and the whistle, and the steel drum and the brass play a loud, catchy, singable hook together, the whole band at full power.

Second groove: even busier, the surf guitar trading licks with the brass, timbale fills.

Second build-up and drop: bigger than the first.

Final drop: the biggest part of the song, everything at once, the hook doubled an octave higher, a crash on every bar, the whistle blowing.

Ending: three big stop-time hits with "Hey!" shouts, then one last huge hit. No fade-out.
```

## 반장 라디오의 셔플 블루스 (뽑음: 위 "Monday Without a Clock")
- 서두르지 않는 노련함, 반장의 걸음. 2페이즈에 마르코의 곧은 8분 상자가 이 셔플 위에서 어긋나게 들려야 해서 **셔플이 분명해야 한다.**

```
An instrumental slow shuffle blues, instrumental only, no vocals, no humming. 64 BPM throughout, a strong triplet shuffle feel (long-short, 12/8 feel), A major twelve-bar blues. Steady tempo from start to finish. Ends with one clear final chord, no fade-out.

The mood: an old hand who has done this job for twenty years and is in no hurry at all. Warm, steady, patient, a little stubborn. Relaxed but never sleepy, every note placed exactly, laid back in the pocket.

Mix: warm and close, like a small band playing in a room. Every part clearly separated and audible: drums, bass, guitar, organ.

Instruments: drums played with a steady shuffle on the ride or hi-hat and a soft snare on 2 and 4, a walking upright-style electric bass, a clean electric blues guitar, a quiet Hammond organ holding the chords. No horns, no synths, no strings, no vocals.

Structure:

Intro: the guitar alone plays a short slow turnaround, then the band comes in on the downbeat.

First chorus of the blues: the shuffle groove, the bass walking, the guitar playing short, relaxed fills between long gaps.

Second chorus: the same groove, the organ a little fuller, the guitar answering itself.

Guitar solo: two choruses of a slow, tasteful guitar solo, never fast, every bend unhurried.

Last chorus: the full band, the steadiest and warmest part.

Ending: a slow blues turnaround and one last chord. No fade-out.
```

## 거절, 흔들림 대응
- 펑크에서 "Hey!"가 곡 내내 깔리면 그 문장을 빼고 "No vocals at all."로 다시 뽑는다(외침은 게임이 낸다, 2-1처럼).
- 펑크가 108에서 조금 벗어나 나오면(예: 110), 게임에서 재생 속도를 1~2% 바꿔 블루스의 두 배에 맞춘다(음높이 차이는 거의 안 들림). 크게 벗어나면 다시 뽑기.
- 템포가 흔들리면 맞는 구간만 쓴다.

## 받으면 할 일
- 펑크의 실제 템포, 첫 다운비트, 구간(드롭 자리들) 시각을 이 문서에 기록(블루스는 기록함).
- 기싸움 차례를 곡 구간에 맞춰 정하고(마르코 차례 = 펑크 드롭으로 들어감), 차트를 짬.

## 포장마차: 마르코 휴대폰의 밤 바닷가 노래 (2026-11-03, 뽑을 것)
2-2 엔딩 대화(포장마차) 밑에 깔 곡. 마르코가 휴대폰 작은 스피커로 트는 노래. 낮의 해변 펑크("The Solstice Parade")의 **밤 버전**: 느리고 쓸쓸한 바닷가, 고향 생각. 대사를 덮지 않게 연주곡. 게임이 휴대폰 스피커처럼 좁은 대역으로 깔고(고음·저음 조금 깎음), 장면이 뜨면 1.5초에 걸쳐 들어옴. 파일: `prototype/audio/2-2-pocha.mp3`(넣기만 하면 됨; 없으면 조용히 넘어감). 대화는 누르는 대로 넘어가서 곡 길이에 안 맞춰도 됨.

```
An instrumental slow bossa nova ballad, instrumental only, no vocals, no humming. Around 72 BPM, 4/4, a minor key. Steady tempo. Ends with one soft final chord, no fade-out.

The mood: 5 a.m. after a long night shift, a tired man far from his seaside hometown, drinking quietly with a young coworker at a street stall. Quiet, warm, nostalgic and a little sad, but not hopeless: a small hope underneath, like the first light of dawn over the sea.

Mix: intimate, soft and close, like a small band playing quietly in a corner. Lots of space for talking over it.

Instruments: a nylon-string classical guitar playing gentle bossa nova chords, a soft upright bass, very quiet brushed drums, a muted trumpet (or a soft flugelhorn) playing a simple, lonely melody, a little Rhodes piano. No synths, no strings, no vocals.

Structure:

Intro: the guitar alone, slow and gentle.

Verse: the bass and brushes come in softly, the trumpet plays a simple, lonely melody with long gaps between phrases.

Second verse: the same melody a little warmer, the Rhodes joining.

Bridge: a brief lift, a touch brighter and more hopeful, the melody rising.

Last verse: back to quiet, the melody once more, softer.

Ending: the guitar alone again and one soft final chord. No fade-out.
```
