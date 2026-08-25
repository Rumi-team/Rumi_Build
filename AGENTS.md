# AGENTS.md — Frontend_Rumi_Build

Workspace convention (parent: /home/ali-rumi/dev): this project sits inside a workspace that runs a fixed generator/verifier split.

- At the start of any substantive task: read
  /home/ali-rumi/dev/.context/llm-as-a-verifier/SESSION.md and follow it.
- Verify substantive deliverables with gpt-5.6-sol at model_reasoning_effort=xhigh
  via /home/ali-rumi/dev/.context/llm-as-a-verifier/verify.sh (never trust the generator
  's self-assessment; verdicts are logged to that directory's log.jsonl).
- Before the first verification in a session: run the health check
  /home/ali-rumi/dev/.context/llm-as-a-verifier/check.sh detached
  (setsid nohup check.sh > check.out 2>&1 &) and expect the final line "CHECK: PASS".
- Full details, token economics, and failure interpretation:
  /home/ali-rumi/dev/AGENTS.md and the SESSION.md above.

Note: a project-local .codex-home/ or codex model pin in this repo overrides the
/codex model for THIS repo only; it does not change the workspace verifier above.
