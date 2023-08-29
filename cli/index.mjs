// @ts-check

import { chromium } from '@playwright/test';
import { Command } from 'commander';
import { ScenarioModel } from '../tests/scenarios.mjs';

const program = new Command();

const createScenarioModel = async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    // disable timeouts for CLI commands
    page.setDefaultTimeout(0);

    const sm = new ScenarioModel(page)
    return sm;
}

program.command('storefront')
    .description('This command will open a Chromium browser, localize, then stop on the storefront')
    .action(async (options) => {
        const sm = await createScenarioModel();
        sm.travelToStorefront();
    })

program.command('customize')
    .description('This command will open a Chromium browser, localize, select a feature offer, then stop on the Customize page.')
    .action(async (options) => {
        const sm = await createScenarioModel();
        sm.travelToCustomize();
    });

program.command('eyi')
    .description('This command will open a Chromium browser, localize, select an offer, then stop on the EYI page.')
    .action(async (options) => {
        const sm = await createScenarioModel();
        sm.travelToEYI();
    });


program.parse();