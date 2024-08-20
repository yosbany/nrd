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
        if (vnode.state.currentIndex < vnode.children.length - 1) {
            vnode.state.currentIndex++;
        } else {
            vnode.state.currentIndex = 0;  // Reinicia al principio si está en la última tarjeta
        }
        m.redraw();
    },

    prevSlide: vnode => {
        if (vnode.state.currentIndex > 0) {
            vnode.state.currentIndex--;
        } else {
            vnode.state.currentIndex = vnode.children.length - 1;  // Va a la última tarjeta si está en la primera
        }
        m.redraw();
    },

    handleKeyDown: (vnode, e) => {
        e.preventDefault();  // Previene el comportamiento por defecto del navegador
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
            tabindex: "0", // Permite que el contenedor reciba eventos de teclado
            onkeydown: (e) => Carousel.handleKeyDown(vnode, e), // Maneja la navegación con teclas de flecha
            style: { outline: "none" }, // Elimina el borde de enfoque por defecto
            oncreate: ({ dom }) => {
                dom.focus(); // Asegura que el carrusel tenga el foco al renderizar
            }
        }, [
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
                                    backgroundColor: "#007bff", // Fondo primario
                                    color: "#ffffff",
                                    padding: "20px",
                                    borderRadius: "8px",
                                    minHeight: "300px",
                                    position: "relative",
                                    outline: currentIndex === index ? "3px solid #ffbf00" : "none", // Resaltar borde en foco
                                    transition: "outline 0.3s ease"
                                }
                            }, [
                                child,
                                // Ícono de expandir/contraer en la esquina superior derecha
                                m("span", {
                                    class: "uk-position-absolute",
                                    style: {
                                        top: "10px",
                                        right: "10px",
                                        cursor: "pointer"
                                    },
                                    onclick: () => {
                                        vnode.state.currentIndex = index;  // Asegura que la tarjeta centrada se muestre en el modal
                                        Carousel.toggleExpand(vnode);
                                    }
                                }, m("span", { "uk-icon": isExpanded ? "shrink" : "expand" })),

                                // Numeración en la esquina inferior derecha de la tarjeta
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
            ),

            // Modal Full Page
            m(ModalFullPage, {
                show: isExpanded,
                onClose: () => Carousel.closeModal(vnode),
                content: m("div", {
                    class: "uk-position-relative uk-visible-toggle uk-light",
                    tabindex: "0", // Permite que el contenedor reciba eventos de teclado
                    onkeydown: (e) => Carousel.handleKeyDown(vnode, e), // Maneja la navegación con teclas de flecha
                    style: { outline: "none" }, // Elimina el borde de enfoque por defecto
                    oncreate: ({ dom }) => {
                        dom.focus(); // Asegura que el carrusel tenga el foco al abrir el modal
                    }
                }, [
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
                                            borderRadius: "8px",
                                            minHeight: "100vh",
                                            position: "relative",
                                            outline: currentIndex === index ? "3px solid #ffbf00" : "none", // Resaltar borde en foco
                                            transition: "outline 0.3s ease"
                                        }
                                    }, [
                                        child,
                                        // Ícono de cerrar modal
                                        m("span", {
                                            class: "uk-position-absolute",
                                            style: {
                                                top: "10px",
                                                right: "10px",
                                                cursor: "pointer"
                                            },
                                            onclick: () => Carousel.closeModal(vnode)
                                        }, m("span", { "uk-icon": "close" })),

                                        // Numeración en la esquina inferior derecha de la tarjeta dentro del modal
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
