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

export function showLoaderPage() {
    toggleElementVisibility("loaderPage", true);
    toggleElementVisibility("page", false);
}

export function hideLoaderPage() {
    toggleElementVisibility("loaderPage", false);
    toggleElementVisibility("page", true);
}

export function showLoaderApp() {
    toggleElementVisibility("loaderApp", true);
    toggleElementVisibility("app", false);
}

export function hideLoaderApp() {
    toggleElementVisibility("loaderApp", false);
    toggleElementVisibility("app", true);
}

export function redirectTo(path) {
    window.location.href = path;
}

export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}