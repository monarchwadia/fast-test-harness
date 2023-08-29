// @ts-check

import { chromium } from '@playwright/test';
import { Command } from 'commander';
import { ScenarioModel } from '../tests/scenarios.mjs';

const program = new Command();

const createScenarioModel = async () => {
    const browser = await chromium.launch({
        headless: false
    });
    const page = await browser.newPage();

    const sm = new ScenarioModel({ page })

    return sm;
}

program.command('storefront')
    .description('This command will open a Chromium browser, localize, and then navigate to the storefront')
    .action(async () => {
        const sm = await createScenarioModel();
        sm.travelToStorefront();
    })

program.command('customize')
    .description('This command will open a Chromium browser, localize, navigate to the storefront, then select the first feature offer')
    .action(async () => {
        const sm = await createScenarioModel();
        sm.travelToCustomize();
    });


program.parse();