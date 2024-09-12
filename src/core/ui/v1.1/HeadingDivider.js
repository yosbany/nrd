const HeadingDivider = {
    view: (vnode) => {
        const { title, centered } = vnode.attrs;
        if (!title && !centered) {
            return m('h3.uk-heading-divider');
        }
        if (!title && centered) {
            return m('h3.uk-heading-line uk-text-center', m('span'));
        }
        if (title && centered) {
            return m('h3.uk-heading-line uk-text-center', m('span', title));
        }
        return m('h3.uk-heading-divider', title);
    }
};

export default HeadingDivider;
