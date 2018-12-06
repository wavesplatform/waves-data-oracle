import * as React from 'react';
import { If, ImageUpload, Input } from 'app/components';
import { assocPath, path } from 'ramda';
import { ChangeEvent } from 'react';
import classnames from 'classnames';


export class Form<T extends Record<string, unknown>> extends React.PureComponent<Form.IProps<T>, Form.IState<T>> {

    state: Form.IState<T>;

    constructor(props: Form.IProps<T>) {
        super(props);

        this.state = {
            focusField: null,
            values: Form.getValuesFromProps(props) as T,
            errors: Form.getErrorsFromProps(props)
        };
    }

    public render() {
        return (
            <form>
                {
                    this.props.fields.map(this._prepareField, this)
                }
            </form>
        );
    }

    private _getLimit(field: Form.IFormItem, value: string | null) {
        if (!field.counter) {
            return null;
        }

        const targetCount = field.counter.count;
        const activeCount = field.counter.processor(value);

        return (
            <If condition={this.state.focusField === field.field}>
                <Counter targetCount={targetCount} activeCount={activeCount}/>
            </If>
        );
    }

    private _prepareField(field: Form.IFormItem, index: number) {

        const errors = this.state.errors[field.field] || [];
        const value = path(field.field.split('.'), this.state.values) as string;
        const isValid = !errors.length;
        const inputClassName = classnames({ isValid });
        const limit = this._getLimit(field, value);

        const onChangeValue = (value: string | null) => {
            const values = assocPath(field.field.split('.'), value, this.state.values);

            let error: Array<string>;
            if (field.validator) {
                error = field.validator(value);
            } else {
                error = [];
            }

            this.setState({
                values,
                errors: { ...this.state.errors, [field.field]: error }
            });

            const isValid = !Object.values(this.state.errors).some(list => !!list.length);

            this.props.onChange({
                isValid,
                values,
                errors: this.state.errors
            });
        };

        let element: JSX.Element;
        if (field.mode === Form.ELEMENT.IMAGE) {
            element = <ImageUpload onChange={onChangeValue}
                                   errors={errors}
                                   value={value}/>;
        } else {

            const onChange = (event: ChangeEvent<HTMLInputElement>) => {
                const { value } = event.target;
                onChangeValue(value);
            };

            const onFocus = () => {
                this.setState({ focusField: field.field });
            };

            const onBlur = () => {
                if (this.state.focusField === field.field) {
                    this.setState({ focusField: null });
                }
            };

            const readonly = this.props.readonly[field.field] || false;

            element = <Input mode={field.mode}
                             readOnly={readonly}
                             onFocus={onFocus}
                             onBlur={onBlur}
                             className={inputClassName}
                             errors={errors}
                             onChange={onChange}
                             value={value}/>;
        }

        return (
            <div key={`form-item-${index}`} className={'row'}>
                <label>{field.title}</label>
                {limit}
                {element}
            </div>
        );
    };

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
        required: value => !value || !value.length ? 'Field is required!' : null,
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
        }
    };

    public static wrap(...list: Array<ICallback<string | null, string | null>>): ICallback<string | null, Array<string>> {
        const isString = (x: unknown): x is string => Boolean(x);
        return input => list.map(validate => validate(input))
            .filter(isString);
    }

    private static getErrorsFromProps(props: Form.IProps<any>): Record<string, Array<string>> {
        return props.fields.reduce((acc, field) => {
            if (field.validator) {
                const errors = field.validator(props.values[field.field])
                    .filter(Boolean);
                acc[field.field] = errors;
            } else {
                acc[field.field] = [];
            }
            return acc;
        }, Object.create(null));
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

export namespace Form {

    export const enum ELEMENT {
        IMAGE = 'image'
    }

    export interface IProps<T extends Record<string, unknown>> {
        fields: Array<IFormItem>;
        values: T;
        onChange: ICallback<IChange<T>, void>;
        readonly: Record<string, boolean>;
    }

    export interface IChange<T extends Record<string, unknown>> {
        isValid: boolean;
        values: T;
        errors: Record<string, Array<string>>;
    }

    export interface IState<T extends Record<string, unknown>> {
        errors: Record<string, Array<string>>;
        values: T;
        focusField: string | null;
    }

    export interface IFormItem {
        title: string;
        mode: ELEMENT | Input.INPUT_MODE;
        field: string;
        validator?: ICallback<string | null, Array<string>>;
        counter?: IFormItemLimit;
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
        required(value: string | null): string | null;

        imageSizeKb(maxSize: number): ICallback<string | null, string | null>;

        link(url: string | null): string | null;

        protocol(available: string | Array<string>): ICallback<string | null, string | null>;

        email(email: string | null): string | null;

        limit(info: IFormItemLimit): ICallback<string | null, string | null>;
    }
}
