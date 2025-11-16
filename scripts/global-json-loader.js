async function loadJSON(filePath) {
    try {
        const fullPath = filePath + "?v=" + Date.now();
        const response = await fetch(fullPath);

        if (!response.ok) {
            console.error("Error loading:", filePath, response.status);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error("Fetch failed:", filePath, error);
        return null;
    }
}
