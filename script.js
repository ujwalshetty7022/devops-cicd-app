
"use strict";

const APP_VERSION = "1.0.0";
const APP_ENVIRONMENT = "Development";

const activityList = document.getElementById("activity-list");
const lastUpdated = document.getElementById("last-updated");
const clock = document.getElementById("clock");
const checkButton = document.getElementById("check-button");
const checkResult = document.getElementById("check-result");

function getTime() {
    return new Date().toLocaleTimeString();
}

function updateClock() {
    clock.textContent = getTime();
}

function addActivity(title, description) {
    const item = document.createElement("div");
    item.className = "activity-item";

    const marker = document.createElement("span");
    marker.className = "activity-marker";

    const content = document.createElement("div");

    const heading = document.createElement("strong");
    heading.textContent = title;

    const detail = document.createElement("p");
    detail.textContent = description;

    content.append(heading, detail);

    const time = document.createElement("span");
    time.className = "activity-time";
    time.textContent = getTime();

    item.append(marker, content, time);
    activityList.prepend(item);
}

function updateLastUpdated() {
    lastUpdated.textContent = `Updated ${getTime()}`;
}

function checkFrontendStatus() {
    const isPageReady = document.readyState === "complete";

    document.getElementById("app-status").textContent =
        isPageReady ? "Online" : "Loading";

    document.getElementById("app-version").textContent = APP_VERSION;

    document.getElementById("app-environment").textContent =
        APP_ENVIRONMENT;

    checkResult.textContent = isPageReady
        ? "Frontend JavaScript is responding successfully."
        : "The page is still loading.";

    updateLastUpdated();

    addActivity(
        "Frontend status checked",
        isPageReady
            ? "The browser-side status check completed."
            : "The page has not finished loading."
    );
}

checkButton.addEventListener("click", checkFrontendStatus);

document.getElementById("clear-activity").addEventListener("click", () => {
    activityList.replaceChildren();

    const empty = document.createElement("p");
    empty.className = "empty-activity";
    empty.textContent = "No browser activity recorded.";

    activityList.appendChild(empty);
});

updateClock();
setInterval(updateClock, 1000);

addActivity(
    "Dashboard initialized",
    "The frontend JavaScript loaded successfully."
);

updateLastUpdated();
