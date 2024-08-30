export const encodeId = id => {
    if(id)
        return encodeURIComponent(id); 
    return null;
};


export const decodeId = encodedId => {
    if(encodedId)
        return decodeURIComponent(encodedId);
    return null;
};

export const  validateId = id => {
    const parts = id ? id.split('/') : [];
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
        throw new Error('El ID proporcionado no es válido. Debe estar en el formato "collection/id".');
    }
};
