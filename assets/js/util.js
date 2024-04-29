function toggleElementVisibility(elementId, isVisible) {
    const element = document.getElementById(elementId);
    if (isVisible) {
        element.classList.remove("d-none");
        element.classList.add("d-block");
    } else {
        element.classList.remove("d-block");
        element.classList.add("d-none");
    }
}

export function showLoaderPageUtils() {
    toggleElementVisibility("loaderPage", true);
    toggleElementVisibility("page", false);
}

export function hideLoaderPageUtils() {
    toggleElementVisibility("loaderPage", false);
    toggleElementVisibility("page", true);
}

export function showLoaderAppUtils() {
    toggleElementVisibility("loaderApp", true);
    toggleElementVisibility("app", false);
}

export function hideLoaderAppUtils() {
    toggleElementVisibility("loaderApp", false);
    toggleElementVisibility("app", true);
}

export function redirectToUtils(path) {
    window.location.href = path;
}

export function delayUtils(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}