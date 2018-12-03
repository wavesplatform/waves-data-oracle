import { DEFAULT_LANG } from 'app/services/dataTransactionService';
import { Input } from 'antd';
import * as React from 'react';


const { TextArea } = Input;


export const FORM: Array<IOracleEditFormItem> = [
    {
        title: 'Provider name',
        tag: Input,
        field: 'name'
    },
    {
        title: 'Link',
        tag: Input,
        field: 'site'
    },
    {
        title: 'Email',
        tag: Input,
        field: 'mail'
    },
    {
        title: 'About',
        tag: TextArea,
        field: `description.${ DEFAULT_LANG }`
    }
];

export interface IOracleEditFormItem {
    title: string;
    tag: typeof React.Component;
    field: string;
}
