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