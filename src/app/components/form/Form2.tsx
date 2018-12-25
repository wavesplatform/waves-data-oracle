import * as React from 'react';
import { Element } from '../formComponents';
import { assocPath, path, mergeAll } from 'ramda';
import classnames from 'classnames';
import { getAssetInfo } from 'app/services/dataTransactionService';
import './form.less';

export class Form<T extends Record<string, unknown>> extends React.Component<Form.IProps<T>, Form.IState<T>> {
    
    state: Form.IState<T>;
    
    focusHandler = (field: string) => {
        this.setState({ focusField: field });
    };
    
    blurHandler = () => {
        this.setState({ focusField: null });
    };
    
    onChangeValue = ({ value, isValid, field }: { value: T, isValid: boolean, field: string }) => {
        const values = assocPath(field.split('.'), value, this.state.values);
        this.setState({ validationPending: true, values });
        this.props.onChange && this.props.onChange({ values, isValid });
    };
    
    
    constructor(props: Form.IProps<T>) {
        super(props);
        
        this.state = {
            values: Form.getValuesFromProps(props) as any,
            errors: Object.create(null)
        } as any;
        
        Form.getErrorsFromProps(props).then(errors => {
            this.setState({ errors });
        });
    }
    
    public render() {
        return (
            <form>
                {this.props.fields.map((item) => {
                    const props = this._getFieldProps(item);
                    const limit = this._getLimit(item, props.value);
                    return <ElementWrap limit={limit} {...props} key={props.field}/>;
                })}
            </form>
        );
    }
    
    private _getLimit(field: Form.IFormItem<unknown>, value: string | null) {
        if (!field.counter || this.state.focusField !== field.field) {
            return null;
        }
        
        const targetCount = field.counter.count;
        const activeCount = field.counter.processor(value);
        
        return (
            <Counter targetCount={targetCount} activeCount={activeCount}/>
        );
    }
    
    private _getFieldProps(field: Form.IFormItem<any>) {
        const value = path(field.field.split('.'), this.state.values) as string;
        const className = classnames('basic400', 'margin2', 'block', 'flex', 'flex-col', 'row', `row__${field.field.replace('.', '_')}`, `row__${field.mode}`);
        const validator = field.validator || (() => Promise.resolve([]));
        
        return {
            field: field.field,
            title: field.title,
            mode: field.mode,
            readOnly: field.readOnly,
            value,
            className,
            validator,
            values: field.values,
            defaultValue: field.defaultValue,
            convertValue: field.convertValue,
            onChange: this.onChangeValue,
            onFocus: this.focusHandler,
            onBlur: this.blurHandler
        };
    }
    
    public static counters: Form.ILimits = {
        length: count => ({
            count,
            processor: value => !value ? 0 : value.length,
            messageError: `Max length of this field is ${count} chars!`
        }),
        bytes: count => ({
            count,
            processor: value => !value ? 0 : new Blob([value]).size,
            messageError: `Max length of this field is ${count} bytes!`
        })
    };
    
    public static validators: Form.IValidators = {
        required: value => (value == null || value === '') ? 'Field is required!' : null,
        imageSizeKb: size => value => (value && value.length / 1.33 / 1024 > size) ? `Picture exceeds maximum size ${size} kb!` : null,
        link: value => {
            if (!value) {
                return null;
            }
            const pattern = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
            
            if (!pattern.test(value)) {
                return 'Link is not valid!';
            }
            return null;
        },
        protocol: availableProtocol => url => {
            if (!url) {
                return null;
            }
            
            const protocols = Array.isArray(availableProtocol) ? availableProtocol : [availableProtocol];
            
            try {
                const data = new URL(url);
                if (!availableProtocol.includes(data.protocol)) {
                    return `Url protocol must be one of ${protocols.join(', ')}`;
                }
                return null;
            } catch (e) {
                return null;
            }
        },
        email: value => {
            if (!value) {
                return null;
            }
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(value).toLowerCase()) ? null : 'Email is not valid!';
        },
        limit: info => value => {
            if (!value) {
                return null;
            }
            const apply = (count: number): string => {
                return typeof info.messageError === 'string' ? info.messageError : info.messageError(count);
            };
            const count = info.processor(value);
            return count > info.count ? apply(count) : null;
        },
        assetId: server => id => id && getAssetInfo(id, server)
            .then(() => null)
            .catch(() => 'Invalid asset Id!') || null
    };
    
    public static wrap<T>(...list: Array<ICallback<T | null, Form.TValidatorError>>): ICallback<T | null, Promise<Array<string>>> {
        const isString = (x: unknown): x is string => Boolean(x);
        return input => Promise.all(list.map(validate => validate(input)))
            .then(list => list.filter(isString))
            .catch(e => [e.message]);
    }
    
    private static getErrorsFromProps(props: Form.IProps<any>): Promise<Record<string, Array<string>>> {
        const promiseList = props.fields.map(async field => {
            if (field.validator) {
                const errors = await field.validator(props.values[field.field]);
                return { [field.field]: errors };
            } else {
                return { [field.field]: [] };
            }
        });
        return Promise.all(promiseList).then(mergeAll) as Promise<Record<string, Array<string>>>;
    }
    
    private static getValuesFromProps(props: Form.IProps<any>): Record<string, Array<string>> {
        return props.fields.reduce((acc, field) => {
            const _path = field.field.split('.');
            return assocPath(_path, path(_path, props.values), acc);
        }, Object.create(null));
    }
}

const Counter: React.StatelessComponent<{ targetCount: number; activeCount: number }> = params => {
    const count = params.targetCount - params.activeCount;
    const className = classnames('counter', { isError: count < 0 });
    return <div className={className}>{count}</div>;
};

const ElementWrap = ({ className, index, title, limit, ...props }: any) => (
    <div key={`form-item-${index}`} className={className}>
        <label>{title}</label>
        {limit}
        <Element key={props.field} {...props}/>
    </div>
);

export namespace Form {
    
    export type TValidatorSyncError = string | null;
    export type TValidatorError = TValidatorSyncError | Promise<TValidatorSyncError>;
    
    export interface IProps<T extends Record<string, unknown>> {
        fields: Array<IFormItem<any>>;
        values: T;
        onChange: ICallback<IChange<T>, void>;
        readonly: Record<string, boolean>;
    }
    
    export interface IChange<T extends Record<string, unknown>> {
        isValid: boolean;
        values: T;
    }
    
    export interface IState<T extends Record<string, unknown>> {
        errors: Record<string, Array<string>>;
        values: T;
        focusField: string | null;
        validationPending: boolean;
    }
    
    export interface IFormItem<T> {
        title: string;
        mode: 'input' | 'select' | 'textarea' | 'image';
        field: string;
        readOnly?: boolean;
        validator?: ICallback<T, Promise<Array<string>>>;
        counter?: IFormItemLimit;
        convertValue?: ICallback<string | null, T>;
        values?: Array<{ value: T, text: string }>;
        defaultValue?: T;
    }
    
    export interface IFormItemLimit {
        count: number;
        processor: ICallback<string | null, number>;
        messageError: ICallback<number, string> | string;
    }
    
    export interface ILimits {
        length(count: number): IFormItemLimit;
        
        bytes(count: number): IFormItemLimit;
    }
    
    export interface IValidators {
        required(value: unknown | null): string | null;
        
        imageSizeKb(maxSize: number): ICallback<string | null, string | null>;
        
        link(url: string | null): string | null;
        
        protocol(available: string | Array<string>): ICallback<string | null, string | null>;
        
        email(email: string | null): string | null;
        
        limit(info: IFormItemLimit): ICallback<string | null, string | null>;
        
        assetId(server?: string): ICallback<string | null, string | null | Promise<string | null>>;
    }
}
