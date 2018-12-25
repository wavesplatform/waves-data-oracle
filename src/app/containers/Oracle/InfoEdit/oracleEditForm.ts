import { DEFAULT_LANG } from 'app/services/dataTransactionService';
import { Form } from 'app/components/form/Form2';

const counters = {
    name: Form.counters.length(50),
    link: Form.counters.length(50),
    email: Form.counters.length(50),
    description: Form.counters.length(1000)
};


export const FORM_FIELDS: Array<Form.IFormItem<string | null>> = [
    {
        title: 'Address',
        mode: 'input',
        field: 'address',
        readOnly: true,
    },
    {
        title: 'Provider name',
        mode: 'input',
        field: 'name',
        counter: counters.name,
        validator: Form.wrap(
            Form.validators.required,
            Form.validators.limit(counters.name)
        )
    },
    {
        title: 'Link',
        mode: 'input',
        field: 'link',
        counter: counters.link,
        validator: Form.wrap(
            Form.validators.required,
            Form.validators.link,
            Form.validators.protocol('https://'),
            Form.validators.limit(counters.link)
        )
    },
    {
        title: 'Email',
        mode: 'input',
        field: 'email',
        counter: counters.email,
        validator: Form.wrap(
            Form.validators.email,
            Form.validators.limit(counters.email)
        )
    },
    {
        title: 'About',
        mode: 'textarea',
        counter: counters.description,
        field: `description.${DEFAULT_LANG}`,
        validator: Form.wrap(
            Form.validators.limit(counters.description)
        )
    }
];



