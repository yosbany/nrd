const Column = {
    view: (vnode) => {
        const { align = 'top', gap = '10px', margin = true, ...attrs } = vnode.attrs;
        let alignClass = '';
        
        switch (align) {
            case 'middle': alignClass = 'uk-flex-middle'; break;
            case 'bottom': alignClass = 'uk-flex-bottom'; break;
            default: alignClass = 'uk-flex-top'; 
        }

        return m('div', { component: 'Column', ...attrs  }, [
            m('div', { 
                class: `uk-flex uk-flex-column ${alignClass} ${margin ? 'uk-margin' : ''}`, 
                style: { gap }
            }, vnode.children)
        ]);
    }
};

export default Column;
