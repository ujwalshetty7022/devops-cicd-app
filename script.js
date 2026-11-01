
"use strict";

const APP_VERSION = '1.0.0';
const APP_ENVIRONMENT = 'Development';

const activityList = document.getElementById('activity-list');
const lastUpdated = document.getElementById('last-updated');
const clock = document.getElementById('clock');
const checkButton = document.getElementById('check-button');
const checkResult = document.getElementById('check-result');

function getTime() {
    return new Date().toLocaleTimeString();
}

function updateClock() {
    if (clock) {
        clock.textContent = getTime();
    }
}

function addActivity(title, description) {
    if (!activityList) {
        return;
    }

    const item = document.createElement('div');
    item.className = 'activity-item';

    const marker = document.createElement('span');
    marker.className = 'activity-marker';

    const content = document.createElement('div');

    const heading = document.createElement('strong');
    heading.textContent = title;

    const detail = document.createElement('p');
    detail.textContent = description;

    content.append(heading, detail);

    const time = document.createElement('span');
    time.className = 'activity-time';
    time.textContent = getTime();

    item.append(marker, content, time);
    activityList.prepend(item);
}

function updateLastUpdated() {
    if (lastUpdated) {
        lastUpdated.textContent = `Updated ${getTime()}`;
    }
}

function checkFrontendStatus() {
    const isPageReady = document.readyState === 'complete';

    const appStatus = document.getElementById('app-status');
    const appVersion = document.getElementById('app-version');
    const appEnvironment = document.getElementById('app-environment');

    if (appStatus) {
        appStatus.textContent = isPageReady ? 'Online' : 'Loading';
    }

    if (appVersion) {
        appVersion.textContent = APP_VERSION;
    }

    if (appEnvironment) {
        appEnvironment.textContent = APP_ENVIRONMENT;
    }

    if (checkResult) {
        checkResult.textContent = isPageReady
            ? 'Frontend JavaScript is responding successfully.'
            : 'The page is still loading.';
    }

    updateLastUpdated();

    addActivity(
        'Frontend status checked',
        isPageReady
            ? 'The browser-side status check completed.'
            : 'The page has not finished loading.'
    );
}

if (checkButton) {
    checkButton.addEventListener('click', checkFrontendStatus);
}

const clearButton = document.getElementById('clear-activity');

if (clearButton && activityList) {
    clearButton.addEventListener('click', () => {
        activityList.replaceChildren();

        const empty = document.createElement('p');
        empty.className = 'empty-activity';
        empty.textContent = 'No browser activity recorded.';

        activityList.appendChild(empty);
    });
}

updateClock();
setInterval(updateClock, 1000);

addActivity(
    'Dashboard initialized',
    'The frontend JavaScript loaded successfully.'
);

updateLastUpdated();
