import { DEFAULT_LANG } from 'app/services/dataTransactionService';
import { Input } from 'app/components';
import { Form } from 'app/components/form/Form';

const counters = {
    name: Form.counters.length(50),
    link: Form.counters.length(50),
    email: Form.counters.length(50),
    description: Form.counters.length(1000)
};


export const FORM_FIELDS: Array<Form.IFormItem<string | null>> = [
    {
        title: 'Address',
        mode: Input.INPUT_MODE.INPUT,
        field: 'address'
    },
    {
        title: 'Provider name',
        mode: Input.INPUT_MODE.INPUT,
        field: 'name',
        counter: counters.name,
        validator: Form.wrap(
            Form.validators.required,
            Form.validators.limit(counters.name)
        )
    },
    {
        title: 'Link',
        mode: Input.INPUT_MODE.INPUT,
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
        mode: Input.INPUT_MODE.INPUT,
        field: 'email',
        counter: counters.email,
        validator: Form.wrap(
            Form.validators.email,
            Form.validators.limit(counters.email)
        )
    },
    {
        title: 'About',
        mode: Input.INPUT_MODE.TEXT_AREA,
        counter: counters.description,
        field: `description.${DEFAULT_LANG}`,
        validator: Form.wrap(
            Form.validators.limit(counters.description)
        )
    }
];



