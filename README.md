# FAST test harness

This module uses Playwright and FAST to test localization timings on production Spectrum.com. It also provides a convenient CLI tool that lets buyflow developers quickly travel to a number of different scenarios in the buyflow, to help with manual testing.

It is under construction. It currently only works on spectrum.com, and always localizes with 6 Fiedler. 

## Automated testing

Output for each of these is appended to the gitignored file `results.csv`

```bash
# Headless testing
pnpm test

# Headless testing, 3 times for each test
pnpm test --repeat-each=3

# Headless testing, 3 times for each test, distributed across 3 workers
pnpm test --repeat-each=3 --workers=3

# Same as above, but with 3rd party scripts (Tealium, google ads, etc) disabled about 50% of the time
AB_TEST_THIRD_PARTY=true pnpm test --repeat-each=3 --workers=3

# Headful testing with a UI that you can click through and debug on
pnpm test --debug --ui
```

## Manual testing

```bash
# CLI help output
pnpm cli

# Localize and go to storefront
pnpm cli storefront

# Localize and go to storefront, then navigate to customize
pnpm cli customize

# And the same for EYI
pnpm cli eyi
```

# FAQ

### Can I use npm?

Yes. Let me know if you're using it heavily and I can gitignore a few things to make it more convenient for you.

### I'm on a corporate laptop. Can I use this without local admin access?

Yes, but you will have an extra step. Playwright requires lower level things to be installed. You can open up a ticket to request these things to be installed.

### Why is this on Github?

It's here temporarily. We can move to Bitbucket if there is demand. Otherwise, I will just use this codebase for my own testing purposes.

### Can I use this on my local machine?

I can modify the script to accommodate this, if there is demand.