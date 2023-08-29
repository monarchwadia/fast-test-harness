// @ts-check

import { chromium } from '@playwright/test';
import { Command } from 'commander';
import { ScenarioModel } from '../tests/scenarios.mjs';

const program = new Command();

/**
 * 
 * @param {any} options 
 */
const createScenarioModel = async (options) => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    // disable timeouts for CLI commands
    page.setDefaultTimeout(0);

    const sm = new ScenarioModel(page, {
        waitForFastToFinish: options.collectFastMetrics
    })
    return sm;
}

program.command('storefront')
    .description('This command will open a Chromium browser, localize, then stop on the storefront')
    .option('-f, --collect-fast-metrics', 'Wait for FAST to finish on each page and append the final FAST result to the CSV. This will slow down the test on all pages.')
    .action(async (options) => {
        const sm = await createScenarioModel(options);
        sm.travelToStorefront();
    })

program.command('customize')
    .description('This command will open a Chromium browser, localize, select a feature offer, then stop on the Customize page.')
    .option('-f, --collect-fast-metrics', 'Wait for FAST to finish on each page and append the final FAST result to the CSV. This will slow down the test on all pages.')
    .action(async (options) => {
        const sm = await createScenarioModel(options);
        sm.travelToCustomize();
    });

program.command('eyi')
    .description('This command will open a Chromium browser, localize, select an offer, then stop on the EYI page.')
    .option('-f, --collect-fast-metrics', 'Wait for FAST to finish on each page and append the final FAST result to the CSV. This will slow down the test on all pages.')
    .action(async (options) => {
        const sm = await createScenarioModel(options);
        sm.travelToEYI();
    });


program.parse();