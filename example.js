import { Button } from './src/components/base/Button';
import { Checkbox } from './src/components/base/Checkbox';
import { HorizontalLayout } from './src/components/base/HorizontalLayout';
import { InputNumber } from './src/components/base/InputNumber';
import { InputText } from './src/components/base/InputText';
import { Link } from './src/components/base/Link';
import { OutputText } from './src/components/base/OutputText';
import { Radio } from './src/components/base/Radio';
import { Select } from './src/components/base/Select';
import { Table } from './src/components/base/Table';
import { TextArea } from './src/components/base/TextArea';
import { VerticalLayout } from './src/components/base/VerticalLayout';

const App = {
    view: () => {
        return m(VerticalLayout, [
            m(HorizontalLayout, [
                m('div', { class: 'six columns' }, [
                    m('h4', 'Input Components'),
                    m(InputText, { placeholder: 'Enter text...' }),
                    m(InputNumber, { placeholder: 'Enter number...' }),
                    m(TextArea, { placeholder: 'Enter long text...' }),
                    m(Select, [
                        m('option', { value: '' }, 'Select an option'),
                        m('option', { value: '1' }, 'Option 1'),
                        m('option', { value: '2' }, 'Option 2')
                    ]),
                    m(Checkbox, { id: 'checkbox' }),
                    m('label', { for: 'checkbox' }, 'Checkbox'),
                    m(Radio, { name: 'radio-group', id: 'radio1' }),
                    m('label', { for: 'radio1' }, 'Radio 1'),
                    m(Radio, { name: 'radio-group', id: 'radio2' }),
                    m('label', { for: 'radio2' }, 'Radio 2')
                ]),
                m('div', { class: 'six columns' }, [
                    m('h4', 'Button and Link'),
                    m(Button, 'Click Me'),
                    m('br'),
                    m(Link, { href: '#' }, 'Click here')
                ])
            ]),
            m('h4', 'Output Components'),
            m(OutputText, 'This is some output text.'),
            m('h4', 'Table Component'),
            m(Table, [
                m('thead', 
                    m('tr', [
                        m('th', 'Header 1'),
                        m('th', 'Header 2')
                    ])
                ),
                m('tbody', 
                    m('tr', [
                        m('td', 'Data 1'),
                        m('td', 'Data 2')
                    ])
                )
            ])
        ]);
    }
};

m.mount(document.getElementById('app'), App);
