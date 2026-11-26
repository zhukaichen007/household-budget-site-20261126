# household-budget-site-20261126

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/zhukaichen007/household-budget-site-20261126/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/zhukaichen007/household-budget-site-20261126/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

NestEgg is a household budget site for the Hart household: a monthly dashboard, a full transaction list with a working add-transaction form, per-category budgets, savings goals, and six-month reports — all as plain static files that run in any browser with no network requests.

## Run it

```sh
python3 -m http.server --directory app 8080
```

Then open http://localhost:8080 in a browser. The site is a static site under `app/`; `main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library:

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=keen-badger-89-8798&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
