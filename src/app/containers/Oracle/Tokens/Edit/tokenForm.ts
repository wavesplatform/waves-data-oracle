import { DEFAULT_LANG } from 'app/services/dataTransactionService';
import {Input } from 'app/components';
import { Form } from 'app/components/form/Form';
import { RootState } from 'app/reducers';


const counters = {
    ticker: Form.counters.length(4),
    site: Form.counters.length(50),
    email: Form.counters.length(50),
    description: Form.counters.length(1000)
};

export function getTokenFormFields(server: string, status: any, tokens: RootState.TokensState) {
    const isRequired = status && status >= 0 ? Form.validators.required : () => null;
    
    return [
        {
            title: 'Logo',
            mode: Form.ELEMENT.IMAGE,
            field: 'logo',
            validator: Form.wrap(
                isRequired,
                Form.validators.imageSizeKb(20)
            )
        },
        {
            title: 'Token ID',
            mode: Input.INPUT_MODE.INPUT,
            field: 'id',
            validator: Form.wrap(
                isRequired,
                Form.validators.assetId(server),
                (id) => tokens.content.find(item => item.content.id === id) ? 'Token is exist' : null
            )
        },
        {
            title: 'Status',
            mode: Form.ELEMENT.SELECT,
            field: 'status',
            defaultValue: 1,
            values: [
                { value: -2, text: 'Scam'},
                { value: -1, text: 'Suspicions'},
                { value: 0, text: 'Unknown'},
                { value: 1, text: 'Detailed'},
                { value: 2, text: 'Verified'},
            ],
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
                isRequired,
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
