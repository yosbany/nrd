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

    nextSlide: vnode => {
        vnode.state.currentIndex = (vnode.state.currentIndex + 1) % vnode.children.length;
        m.redraw();
    },

    prevSlide: vnode => {
        vnode.state.currentIndex = (vnode.state.currentIndex - 1 + vnode.children.length) % vnode.children.length;
        m.redraw();
    },

    handleKeyDown: (vnode, e) => {
        if (e.key === 'ArrowRight') {
            Carousel.nextSlide(vnode);
        } else if (e.key === 'ArrowLeft') {
            Carousel.prevSlide(vnode);
        }
    },

    view: vnode => {
        const { isExpanded, currentIndex } = vnode.state;
        const totalSlides = vnode.children.length;

        return m("div", {
            class: "uk-position-relative uk-visible-toggle uk-light",
            "uk-slider": "center: true",
            tabindex: "0", // Permite que el contenedor reciba eventos de teclado
            onkeydown: (e) => Carousel.handleKeyDown(vnode, e),
            oncreate: ({ dom }) => {
                dom.focus(); // Asegura que el contenedor del carrusel tenga el foco al renderizar
            },
            onupdate: ({ dom }) => {
                dom.focus(); // Mantiene el foco en el contenedor durante las actualizaciones
            },
            style: { outline: "none" } // Elimina cualquier borde de enfoque por defecto
        }, [
            m("div.uk-slider-container", [
                m("div.uk-slider-items.uk-grid", 
                    vnode.children.map((child, index) => 
                        m("div", { 
                            key: index, 
                            class: `uk-width-3-4 ${currentIndex === index ? 'uk-width-expand' : 'uk-hidden'}`, 
                            style: { transition: 'none' } // Elimina la transición para navegación rápida
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
                                        onclick: () => {
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
                    },
                    style: { outline: "none" }
                }, [
                    m("div.uk-slider-container", [
                        m("div.uk-slider-items.uk-grid", 
                            vnode.children.map((child, index) =>
                                m("div", { 
                                    key: index, 
                                    class: `uk-width-3-4 ${currentIndex === index ? 'uk-width-expand' : 'uk-hidden'}`, 
                                    style: { transition: 'none' }
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
                                                onclick: () => Carousel.closeModal(vnode)
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
                    ])
                ]),
                showCloseButton: false
            })
        ]);
    }
};

export default Carousel;
