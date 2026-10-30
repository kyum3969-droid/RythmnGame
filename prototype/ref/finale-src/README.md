# 1-5 애니매틱 · 시안 소스

`prototype/ref/finale-anim.html`(애니매틱)과 `prototype/ref/finale-sheet.html`(정지 시안)은 이 폴더의 조각을 이어 붙여 만든 한 파일이다. 고칠 때는 여기서 고치고 다시 빌드한다.

- `chars.js`: 게임 본체(`prototype/index.html`)에서 그대로 뽑아 온 캐릭터 그리기 코드(팔레트, 반장·지우·하은, 플레이어). 게임 쪽이 바뀌면 다시 뽑는다.
- `bg.js`: 창고 배경(게임 본체에서 뽑음).
- `finale-anim.js`: 애니매틱의 장면과 타임라인, 효과음. `TL`이 장면 순서와 길이.
- `finale-anim-shell.html`: 애니매틱 페이지 껍데기(재생 버튼, 장면 점프).
- `finale-scenes.js` + `sheet-shell.html`: 정지 시안 시트.

빌드(이 폴더에서):

```
bash build-anim.sh    # → finale-anim.html
bash build-sheet.sh   # → finale-sheet.html
```

확인(Playwright가 있는 환경):

```
node shot3.js '[63,90,124]'   # 애니매틱의 해당 초를 anim-<t>.png로 찍고, 전체를 6배속으로 돌려 오류를 잡는다
node shot2.js                 # 시트의 카드마다 fin-<n>.png
```
