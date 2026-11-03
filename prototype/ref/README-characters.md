# 캐릭터 새 그림 (게임에서는 뺌, 영상 컷씬용으로 보관)

2026-11-03: 게임 안의 신입·지우는 초기 단순 도트로 되돌렸다(사용자: "초기 버전이 낫다"). Codex가 만든 새 그림은 영상 컷씬에 쓰려고 저장소에 남겨 둔다. **게임(`prototype/index.html`)은 이 파일들을 읽지 않는다.**

- **신입**: 원본 그림 `docs/art/rookie-approved.png`, 스캔 동작 영상 `docs/art/rookie-scan-continuous.mp4` · `rookie-scan-rig.gif`, 게임용으로 자른 시트 `prototype/assets/rookie-sprites.png`(`prototype/assets/README.md`), 그리는 코드 `prototype/rookie-art.js`, 팔 관절 계산 `prototype/rookie-rig.js`(테스트 `rookie-rig.test.cjs`), 따로 돌려 보는 페이지 `prototype/ref/rookie-rig.html`. 설계 메모는 `docs/superpowers/`.
- **지우**: 게임 코드 안에 있던 그림이라 `prototype/ref/jiwoo-a-art.js`로 떼어 둠(혼자서는 안 돌아감, 게임의 도우미 함수들이 필요). 상자 나르는 관절 계산 `prototype/shared/character-rig.js`(테스트 `character-rig.test.cjs`, 설명 `docs/character-rig.md`).
- 게임에 들어가 있던 상태 그대로 보려면: 신입 `git checkout 15187a2`, 신입 + 지우 `git checkout ac981e3`.
