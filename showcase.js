import Row from './src/core/ui/v1.1/Row.js';
import Column from './src/core/ui/v1.1/Column.js'; 
import Button from './src/core/ui/v1.1/Button.js'; 
import Text from './src/core/ui/v1.1/Text.js'; 
import ResponsiveRow from './src/core/ui/v1.1/ResponsiveRow.js';

const Showcase = {
    state: {
        rowAlign: 'left',
        rowGap: 10,  // El valor del gap que se aplicará entre los hijos
        rowTight: false,  // Si `true`, no habrá margen externo
        rowMargin: true
    },
    view: vnode => {
        return m('div', [
            m('h2', 'Row Showcase'),
            m('div', { class: 'uk-grid uk-margin' }, [
                m('div', { class: 'uk-width-1-2' }, [
                    m('label', 'Row Alignment:'),
                    m('select', {
                        onchange: e => {
                            Showcase.state.rowAlign = e.target.value;
                            m.redraw();  // Forzar la actualización de la vista
                        }
                    }, [
                        m('option', { value: 'left', selected: Showcase.state.rowAlign === 'left' }, 'Left'),
                        m('option', { value: 'center', selected: Showcase.state.rowAlign === 'center' }, 'Center'),
                        m('option', { value: 'right', selected: Showcase.state.rowAlign === 'right' }, 'Right'),
                        m('option', { value: 'justify', selected: Showcase.state.rowAlign === 'justify' }, 'Justify')
                    ])
                ]),
                m('div', { class: 'uk-width-1-2' }, [
                    m('label', 'Row Gap (in px):'),
                    m('input', {
                        type: 'number',
                        value: Showcase.state.rowGap,
                        oninput: e => {
                            Showcase.state.rowGap = parseInt(e.target.value) || 0;
                            m.redraw();  // Forzar la actualización de la vista
                        }
                    })
                ]),
                m('div', { class: 'uk-width-1-2' }, [
                    m('label', 'Tight Row (no external margin):'),
                    m('input', {
                        type: 'checkbox',
                        checked: Showcase.state.rowTight,
                        onchange: e => {
                            Showcase.state.rowTight = e.target.checked;
                            m.redraw();  // Forzar la actualización de la vista
                        }
                    })
                ])
            ]),

            // Row con ancho especificado por los hijos y alineación
            m(Row, {
                align: Showcase.state.rowAlign,
                gap: Showcase.state.rowGap,  // Aplicamos el gap entre los hijos
                tight: Showcase.state.rowTight,  // Si `tight` es true, no habrá margen externo
                margin: Showcase.state.rowMargin,
            
            }, [
                m(Text, {
                    value: 'Text 1',
                    placeholder: 'Enter Text...',
                    showLabel: false,
                    width: '50%'
                }),
                m(Button, { label: 'Button 1', documentation: 'Botón 1' , class: 'uk-button-default' }),  // Ocupa el 50% del Row (si no es justify)
                m(Button, { label: 'Button 2', documentation: 'Botón 2', class: 'uk-button-primary' })  // Ocupa el 25% del Row (si no es justify)
            ]),
            m('div', [
                m('h2', 'Responsive Row Showcase'),
                m(ResponsiveRow, {
                    gap: 'small'  // Ajuste del gap
                }, [
                    m(Text, {
                        value: 'Text 1',
                        placeholder: 'Enter Text...',
                        showLabel: false,
                        width: '50%',
                        ukWidth: 'uk-width-1-2 uk-width@s-1-1' 
                    }),
                    m(Button, { label: 'Button 1', documentation: 'Botón 1' , class: 'uk-button-default',ukWidth: 'uk-width-1-2 uk-width@s-1-1'  }),  // Ocupa el 50% del Row (si no es justify)
                    m(Button, { label: 'Button 2', documentation: 'Botón 2', class: 'uk-button-primary',ukWidth: 'uk-width-1-2 uk-width@s-1-1'  })
                ])
            ])
        ]);
    }
};

// Montar el componente en la página
m.mount(document.body, Showcase);
