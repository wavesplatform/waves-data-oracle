import { DEFAULT_LANG } from 'app/services/dataTransactionService';
import { Input } from 'app/components';
import { Form } from 'app/components/form/Form';


const counters = {
    ticker: Form.counters.length(4),
    site: Form.counters.length(50),
    email: Form.counters.length(50),
    description: Form.counters.length(1000)
};

export function getTokenFormFields(server?: string) {
    return [
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
            field: 'id',
            validator: Form.wrap(
                Form.validators.required,
                Form.validators.assetId(server)
            )
        },
        {
            title: 'Status',
            mode: Input.INPUT_MODE.INPUT,
            field: 'status',
            convertValue: (value: string) => Number(value),
            validator: Form.wrap(
                Form.validators.required as any,
            )
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
            field: 'link',
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
}
