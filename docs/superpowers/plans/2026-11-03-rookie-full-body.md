# Rookie Full Body Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Apply the approved character artwork faithfully, including legs and safety boots.

**Architecture:** Load the transparent three-pose atlas through a shared renderer. Mask body, arms and scanner from the source pixels and compose them in existing game layers. Preserve logical game coordinates with a 4× main drawing surface.

**Tech Stack:** HTML, Canvas 2D, local PNG and JavaScript; Playwright/system Chromium verification.

**Spec:** `docs/superpowers/specs/2026-11-03-rookie-full-body-design.md`

The checks below record the original implementation on the task branch. Current `main` has retired the finale reference builders/pages; their removal is preserved. The shared artwork now runs in current gameplay and `prototype/ref/rookie-rig.html`.

## Global Constraints

- Preserve the approved original silhouette and proportions; do not replace it with a rectangle recreation.
- Keep logical 384×216 coordinates, current gameplay timing and left-facing scanner behavior.
- Use the existing isolated checkout without an additional worktree.
- Keep the unrelated animatic audio-clock defect outside this task.

## Review Focus

- Artwork loading resolves or rejects predictably; relative paths also work in reference pages.
- Frame changes keep feet planted and body sizes consistent.
- Body/arm/tool masks leave no floating fragments or duplicate scanners.
- Heavy input reaches the current scanner grip; dual-lane input uses only two arms.
- Higher-density drawing preserves input coordinates and puddle reflections.

## Task 1: Source-art integration

**Files:** `prototype/rookie-art.js`, `prototype/assets/rookie-sprites.png`, `prototype/index.html`, reference shells/character helpers/builders and generated pages.

- [x] Retain the approved concept and create a transparent source-art atlas.
- [x] Implement shared source-art rendering, pose anchors and independently composited arms/tools.
- [x] Use 4× main backing resolution and update the self-copy reflection crop.
- [x] Load the module in main and reference pages, including image readiness/error handling.
- [x] Verify real first-level completion and two-lane keyboard input.
- [x] Inspect ten pose/scene captures, including DAW and alley reflection.
- [x] Independently review visual fidelity and integration.
- [x] Correct mask fragments and align the heavy supporting hand with the source pose.

## Validation evidence

- Approved art vs corrected idle/scan/miss: independent visual review confirmed restored identity.
- First-level calibration, audio initialization, judgment, results and return to board passed.
- Real dual-lane F/J input passed; ten rendering scenarios completed without page errors.
- All ten reference sheet cards and eight paused animatic positions loaded the source artwork.
- Known optional Google Fonts policy failure and animatic audio-clock recursion remain unchanged.
