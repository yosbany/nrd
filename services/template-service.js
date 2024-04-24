export async function loadTemplate(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('No se pudo cargar el template');
        }
        return await response.text();
    } catch (error) {
        console.error('Error al cargar el template:', error);
        return '';
    }
}