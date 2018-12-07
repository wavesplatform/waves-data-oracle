import { DEFAULT_LANG } from 'app/services/dataTransactionService';
import { Input } from 'app/components';
import { Form } from 'app/components/form/Form';


const counters = {
    ticker: Form.counters.length(4),
    site: Form.counters.length(50),
    email: Form.counters.length(50),
    description: Form.counters.length(1000)
};


export const TOKEN_FORM_FIELDS: Array<Form.IFormItem> = [
    {
        title: 'Logo',
        mode: Form.ELEMENT.IMAGE,
        field: 'logo',
        validator: Form.wrap(
            Form.validators.required,
            Form.validators.imageSizeKb(20)
        )
    },
    {
        title: 'Token ID',
        mode: Input.INPUT_MODE.INPUT,
        field: 'id'
    },
    {
        title: 'Token Name',
        mode: Input.INPUT_MODE.INPUT,
        field: 'name'
    },
    {
        title: 'Token ticker',
        mode: Input.INPUT_MODE.INPUT,
        counter: counters.ticker,
        field: 'ticker',
        validator: Form.wrap(
            Form.validators.limit(counters.ticker)
        )
    },
    {
        title: 'Link',
        mode: Input.INPUT_MODE.INPUT,
        field: 'site',
        counter: counters.site,
        validator: Form.wrap(
            Form.validators.required,
            Form.validators.link,
            Form.validators.protocol('https://'),
            Form.validators.limit(counters.site)
        )
    },
    {
        title: 'Email',
        mode: Input.INPUT_MODE.INPUT,
        field: 'mail',
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



