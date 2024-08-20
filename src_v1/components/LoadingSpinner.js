const LoadingSpinner = {
    view: vnode => {
        return vnode.attrs.loading ? m("div", { 
            style: { 
                position: "fixed", 
                top: 0, 
                left: 0, 
                width: "100%", 
                height: "100%", 
                backgroundColor: "rgba(0, 0, 0, 0.5)", 
                zIndex: 9999, 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center",
                flexDirection: "column"
            } 
        }, [
            m("div", { 
                style: {
                    width: "50px",
                    height: "50px",
                    border: "8px solid #f3f3f3", /* Light grey */
                    borderTop: "8px solid #3498db", /* Blue */
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                }
            }),
            m("div.uk-margin-small-top.uk-text-light", "ESPERE POR FAVOR")
        ]) : null;
    }
};

export default LoadingSpinner;
