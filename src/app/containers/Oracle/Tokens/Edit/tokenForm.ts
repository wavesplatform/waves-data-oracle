import { DEFAULT_LANG } from 'app/services/dataTransactionService';
import { Form } from 'app/components/form/Form2';
import { RootState } from 'app/reducers';


const counters = {
    ticker: Form.counters.length(4),
    site: Form.counters.length(50),
    email: Form.counters.length(50),
    description: Form.counters.length(1000)
};

interface IFormConfig {
    server: string;
    status: any;
    tokens: RootState.TokensState,
    isNew: boolean
}

export function getTokenFormFields({ server, status, tokens, isNew }: IFormConfig) {
    const isRequired = status && status >= 0 ? Form.validators.required : () => null;
    
    return [
        {
            title: 'Logo',
            mode: 'image',
            field: 'logo',
            validator: Form.wrap(
                isRequired,
                Form.validators.imageSizeKb(20)
            )
        },
        {
            title: 'Token ID',
            mode: 'input',
            field: 'id',
            readOnly: !isNew,
            validator: Form.wrap(
                isRequired,
                Form.validators.assetId(server),
                (id) => {
                    return (isNew && tokens.content.find(item => item.content.id === id)) ? 'Token is exist' : null
                }
            )
        },
        {
            title: 'Status',
            mode: 'select',
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
            mode: 'input',
            field: 'name',
            readOnly: true,
        },
        {
            title: 'Token ticker',
            mode: 'input',
            counter: counters.ticker,
            field: 'ticker',
            validator: Form.wrap(
                Form.validators.limit(counters.ticker)
            )
        },
        {
            title: 'Link',
            mode: 'input',
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
}
