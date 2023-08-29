// @ts-check

import { test } from '@playwright/test';
import { ensureFastIsFinishedOnPage, getFastStateFromPage, logEvent, thirdPartyABTester } from './utils.mjs';
import { ScenarioModel } from './scenarios.mjs';

test('localizationToStorefront', async ({ page, browserName }) => {

    // Get the response from the HAR file
    // await page.routeFromHAR('./harfile/session.har', {
    //     url: '*/**/proxy.api/*/**',
    //     update: true, // flip to true to update the HAR file, false to not update
    // });

    const scenarioModel = new ScenarioModel(page);
    const { areThirdPartyScriptsDisabled } = await scenarioModel.enableThirdPartyScriptABTestingIfAllowed();

    const { fast } = await scenarioModel.travelToStorefront();
    const duration = fast.duration;

    logEvent("localizationToStorefront", { browserName, duration, areThirdPartyScriptsDisabled });
})

test('storefrontToCustomize', async ({ page, browserName }) => {

    // Get the response from the HAR file
    // await page.routeFromHAR('./harfile/session.har', {
    //     url: '*/**/proxy.api/*/**',
    //     update: true, // flip to true to update the HAR file, false to not update
    // });

    const scenarioModel = new ScenarioModel(page);
    const { areThirdPartyScriptsDisabled } = await scenarioModel.enableThirdPartyScriptABTestingIfAllowed();

    const { fast } = await scenarioModel.travelToCustomize();
    const duration = fast.duration;

    logEvent("storefrontToCustomize", { browserName, duration, areThirdPartyScriptsDisabled });
})

test('storefrontToEYI', async ({ page, browserName }) => {

    // Get the response from the HAR file
    // await page.routeFromHAR('./harfile/session.har', {
    //     url: '*/**/proxy.api/*/**',
    //     update: true, // flip to true to update the HAR file, false to not update
    // });

    const scenarioModel = new ScenarioModel(page);
    const { areThirdPartyScriptsDisabled } = await scenarioModel.enableThirdPartyScriptABTestingIfAllowed();

    const { fast } = await scenarioModel.travelToEYI();
    const duration = fast.duration;

    logEvent("storefrontToCustomize", { browserName, duration, areThirdPartyScriptsDisabled });
})
