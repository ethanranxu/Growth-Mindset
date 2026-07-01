<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Module 3 Video Integration Guidelines (Added 2026-07-01)
Module 3 is fully integrated with video players instead of text reflections for both A (GMI) and B (Control) branches:
- **A Branch (GMI)**: 3 separate videos (`/Video/A1.mp4`, `/Video/A2.mp4`, `/Video/A3.mp4`) with corresponding quiz questions.
- **B Branch (Control)**: 1 unified video (`/Video/B1.mp4`) containing all 3 examples, with 3 quizzes displayed underneath.
- **VideoPlayer Component (`src/components/module/VideoPlayer.js`)**:
  - Implements custom play/pause overlay and display-only progress bar. Do NOT add `controls` attribute.
  - Prevents forward seeking/skipping by listening to `onSeeking` and reverting the playhead to `maxTime`.
- **Navigation Controls**:
  - The `Continue` button is locked (`canProceed` is false) until the video finishes playing (`videoCompleted` is true) and all quizzes are correctly completed.
  - Users are allowed to answer questions during video playback, but cannot proceed to the next module.
