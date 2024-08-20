import ModalFullPage from './base/ModalFullPage.js';

const Carousel = {
    oninit: vnode => {
        vnode.state.isExpanded = false;
        vnode.state.currentIndex = 0;
    },

    toggleExpand: vnode => {
        vnode.state.isExpanded = !vnode.state.isExpanded;
        m.redraw();
    },

    closeModal: vnode => {
        vnode.state.isExpanded = false;
        m.redraw();
    },

    handleKeyDown: (vnode, e) => {
        if (e.key === 'ArrowRight') {
            vnode.state.currentIndex = (vnode.state.currentIndex + 1) % vnode.children.length;
            UIkit.slider(vnode.dom).show('next');
        } else if (e.key === 'ArrowLeft') {
            vnode.state.currentIndex = (vnode.state.currentIndex - 1 + vnode.children.length) % vnode.children.length;
            UIkit.slider(vnode.dom).show('previous');
        }
        m.redraw();
    },

    view: vnode => {
        const { isExpanded, currentIndex } = vnode.state;
        const totalSlides = vnode.children.length;

        return m("div", {
            class: "uk-position-relative uk-visible-toggle uk-light",
            "uk-slider": "center: true", 
            tabindex: "0", 
            onkeydown: (e) => Carousel.handleKeyDown(vnode, e), 
            oncreate: ({ dom }) => {
                dom.focus();
            },
            onupdate: ({ dom }) => {
                dom.focus();
            },
            style: { outline: "none" } 
        }, [
            m("div.uk-slider-container", {
                style: { touchAction: 'pan-y' } 
            }, [
                m("ul.uk-slider-items.uk-grid", 
                    vnode.children.map((child, index) => 
                        m("li", { 
                            key: index, 
                            class: 'uk-width-1-1' 
                        }, [
                            m("div.uk-panel", [
                                m("div", {
                                    style: {
                                        backgroundColor: "#007bff",
                                        color: "#ffffff",
                                        padding: "20px",
                                        borderRadius: "0px",
                                        minHeight: "300px",
                                        position: "relative"
                                    }
                                }, [
                                    child,
                                    m("span", {
                                        class: "uk-position-absolute",
                                        style: {
                                            top: "10px",
                                            right: "10px",
                                            cursor: "pointer"
                                        },
                                        onclick: (e) => {
                                            e.stopPropagation();
                                            vnode.state.currentIndex = index;
                                            Carousel.toggleExpand(vnode);
                                        }
                                    }, m("span", { "uk-icon": isExpanded ? "shrink" : "expand" })),
                                    m("div", {
                                        class: "uk-position-absolute",
                                        style: {
                                            bottom: "10px",
                                            right: "10px",
                                            color: "#ffffff",
                                            fontSize: "16px",
                                        }
                                    }, `${index + 1}/${totalSlides}`)
                                ])
                            ])
                        ])
                    )
                )
            ]),

            m(ModalFullPage, {
                show: isExpanded,
                onClose: () => Carousel.closeModal(vnode),
                content: m("div", {
                    class: "uk-position-relative uk-visible-toggle uk-light",
                    "uk-slider": "center: true",
                    tabindex: "0", 
                    onkeydown: (e) => Carousel.handleKeyDown(vnode, e), 
                    oncreate: ({ dom }) => {
                        dom.focus();
                        UIkit.slider(dom).show(currentIndex); // Muestra la tarjeta actual al abrir el modal
                    },
                    style: { outline: "none", touchAction: 'pan-y' } 
                }, [
                    m("ul.uk-slider-items.uk-grid", 
                        vnode.children.map((child, index) =>
                            m("li", { 
                                key: index, 
                                class: 'uk-width-1-1', 
                            }, [
                                m("div.uk-panel", [
                                    m("div", {
                                        style: {
                                            backgroundColor: "#007bff",
                                            color: "#ffffff",
                                            padding: "20px",
                                            borderRadius: "0px",
                                            minHeight: "100vh",
                                            position: "relative"
                                        }
                                    }, [
                                        child,
                                        m("span", {
                                            class: "uk-position-absolute",
                                            style: {
                                                top: "10px",
                                                right: "10px",
                                                cursor: "pointer"
                                            },
                                            onclick: (e) => {
                                                e.stopPropagation();
                                                Carousel.closeModal(vnode);
                                            }
                                        }, m("span", { "uk-icon": "close" })),
                                        m("div", {
                                            class: "uk-position-absolute",
                                            style: {
                                                bottom: "10px",
                                                right: "10px",
                                                color: "#ffffff",
                                                fontSize: "16px",
                                            }
                                        }, `${index + 1}/${totalSlides}`)
                                    ])
                                ])
                            ])
                        )
                    )
                ]),
                showCloseButton: false
            })
        ]);
    }
};

export default Carousel;
