// @ts-check

import { test } from '@playwright/test';
import { ensureFastIsFinishedOnPage, getFastStateFromPage, logEvent, thirdPartyABTester } from './utils';
import { ScenarioModel } from './scenarios';

test('localizationToStorefront', async ({ page, browserName }) => {

    // Get the response from the HAR file
    // await page.routeFromHAR('./harfile/session.har', {
    //     url: '*/**/proxy.api/*/**',
    //     update: true, // flip to true to update the HAR file, false to not update
    // });

    const scenarioModel = new ScenarioModel({ page });
    const { areThirdPartyScriptsDisabled } = await scenarioModel.enableThirdPartyScriptABTesting();

    const { fast } = await scenarioModel.localizationToStorefrontScenario();
    const duration = fast.duration;

    logEvent({ browserName, duration, areThirdPartyScriptsDisabled });
})
