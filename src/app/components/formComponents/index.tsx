import * as React from 'react';
import { Select } from './Select';
import { Input } from './Input';
import { ImageUpload } from './ImageUpload';

export const Element = (props: any) => {
    switch (props.mode) {
        case 'image':
            return <ImageUpload {...props}/>;
        case 'select':
            return <Select {...props}/>;
        case 'input':
        case 'textarea':
        default:
            return <Input {...props}/>;
    }
};
