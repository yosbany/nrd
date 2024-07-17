import { Button } from './src/components/base/Button.js';
import { Checkbox } from './src/components/base/Checkbox.js';
import { HorizontalLayout } from './src/components/base/HorizontalLayout.js';
import { InputNumber } from './src/components/base/InputNumber.js';
import { InputText } from './src/components/base/InputText.js';
import { Link } from './src/components/base/Link.js';
import { OutputText } from './src/components/base/OutputText.js';
import { Radio } from './src/components/base/Radio.js';
import { Select } from './src/components/base/Select.js';
import { Table } from './src/components/base/Table.js';
import { TextArea } from './src/components/base/TextArea.js';
import { VerticalLayout } from './src/components/base/VerticalLayout.js';
import { Menu } from './src/components/Menu.js';

const App = {
    view: () => {
        const headers = ['Header 1', 'Header 2', 'Header 3'];
        const body = [
            [
                m(OutputText, { style: { color: 'blue' }, showLabel: false }, 'Data 1.1'),
                m(Link, { href: '#', onclick: () => alert('Link 1.2 clicked'), showLabel: false }, 'Link 1.2'),
                m(InputText, { placeholder: 'Input 1.3', oninput: (e) => console.log(e.target.value), showLabel: false })
            ],
            [
                m(OutputText, { style: { color: 'green' }, showLabel: false }, 'Data 2.1'),
                m(Link, { href: '#', onclick: () => alert('Link 2.2 clicked'), showLabel: false }, 'Link 2.2'),
                m(InputText, { placeholder: 'Input 2.3', oninput: (e) => console.log(e.target.value), showLabel: false })
            ],
            [
                m(OutputText, { style: { color: 'red' }, showLabel: false }, 'Data 3.1'),
                m(Link, { href: '#', onclick: () => alert('Link 3.2 clicked'), showLabel: false }, 'Link 3.2'),
                m(InputText, { placeholder: 'Input 3.3', oninput: (e) => console.log(e.target.value), showLabel: false })
            ]
        ];

        return m(VerticalLayout, [
            m(Menu),
            m('div', { class: 'container' }, [
                m(HorizontalLayout, { columns: ['six', 'six'] }, [
                    m('div', [
                        m('h4', 'Input Components'),
                        m(InputText, { label: 'Input Text', labelWidth: 50, labelPosition: 'top', placeholder: 'Enter text...', oninput: (e) => console.log(e.target.value) }),
                        m(InputNumber, { label: 'Input Number', labelWidth: 50, labelPosition: 'top', placeholder: 'Enter number...', oninput: (e) => console.log(e.target.value) }),
                        m(TextArea, { label: 'Text Area', labelWidth: 50, labelPosition: 'top', placeholder: 'Enter long text...', oninput: (e) => console.log(e.target.value) }),
                        m(Select, { label: 'Select', labelWidth: 50, labelPosition: 'top', onchange: (e) => console.log(e.target.value) }, [
                            m('option', { value: '' }, 'Select an option'),
                            m('option', { value: '1' }, 'Option 1'),
                            m('option', { value: '2' }, 'Option 2')
                        ]),
                        m(Checkbox, { label: 'Checkbox', labelWidth: 50, id: 'checkbox', onchange: (e) => console.log(e.target.checked) }),
                        m(Radio, { label: 'Radio 1', labelWidth: 50, name: 'radio-group', id: 'radio1', onchange: (e) => console.log(e.target.value) }),
                        m(Radio, { label: 'Radio 2', labelWidth: 50, name: 'radio-group', id: 'radio2', onchange: (e) => console.log(e.target.value) })
                    ]),
                    m('div', [
                        m('h4', 'Button and Link'),
                        m(Button, { onclick: () => alert('Button clicked') }, 'Click Me'),
                        m('br'),
                        m(Link, { href: '#', onclick: () => alert('Link clicked') }, 'Click here')
                    ])
                ]),
                m('h4', 'Output Components'),
                m(OutputText, { label: 'Output Text', labelWidth: 50, labelPosition: 'top', style: { fontWeight: 'bold' } }, 'This is some output text.'),
                m('h4', 'Table Component'),
                m(Table, { headers, body, label: 'Example Table' })
            ])
        ]);
    }
};

m.mount(document.getElementById('app'), App);
