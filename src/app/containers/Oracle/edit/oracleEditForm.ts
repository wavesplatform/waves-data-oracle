import { DEFAULT_LANG } from 'app/services/dataTransactionService';
import { Input } from 'app/components';
import { Form } from 'app/components/form/Form';


export const FORM_FIELDS: Array<Form.IFormItem> = [
    {
        title: 'Provider name',
        mode: Input.INPUT_MODE.INPUT,
        field: 'name',
        validator: Form.wrap(
            Form.validators.required
        )
    },
    {
        title: 'Link',
        mode: Input.INPUT_MODE.INPUT,
        field: 'site',
        validator: Form.wrap(
            Form.validators.required
        )
    },
    {
        title: 'Email',
        mode: Input.INPUT_MODE.INPUT,
        field: 'mail'
    },
    {
        title: 'About',
        mode: Input.INPUT_MODE.TEXT_AREA,
        field: `description.${DEFAULT_LANG}`
    }
];

