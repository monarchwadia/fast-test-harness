# FAST test harness

This module uses Playwright and FAST to test localization timings on production Spectrum.com

Output is appended to the gitignored file `results.csv`

## Commands

```bash
# Headless
pnpm run test

# With UI
pnpm run test --ui

# With debugger
pnpm run test --debug

# With debugger and UI
pnpm run test --debug --ui
```

## Cases

With third party enabled
```bash
pnpm run test --repeat-each=3 --workers=3
```

With third party disabled

```bash
AB_TEST_THIRD_PARTY=true pnpm run test --repeat-each=3 --workers=3
```