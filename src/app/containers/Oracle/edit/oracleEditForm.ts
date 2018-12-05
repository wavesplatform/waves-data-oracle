import { DEFAULT_LANG } from 'app/services/dataTransactionService';
import { Input } from 'app/components';
import { Form } from 'app/components/form/Form';


export const FORM_FIELDS: Array<Form.IFormItem> = [
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
        title: 'Address',
        mode: Input.INPUT_MODE.INPUT,
        field: 'address',
    },
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
            Form.validators.required,
            Form.validators.link,
            Form.validators.protocol('https://')
        )
    },
    {
        title: 'Email',
        mode: Input.INPUT_MODE.INPUT,
        field: 'mail',
        validator: Form.wrap(
            Form.validators.email
        )
    },
    {
        title: 'About',
        mode: Input.INPUT_MODE.TEXT_AREA,
        field: `description.${DEFAULT_LANG}`
    }
];

