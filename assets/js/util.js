function includeTemplate(url, containerId) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = data;
            } else {
                console.error(`Container with id '${containerId}' not found.`);
            }
        })
        .catch(error => console.error(`Error fetching template: ${error}`));
}