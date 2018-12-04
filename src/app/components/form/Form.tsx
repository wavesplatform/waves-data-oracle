import * as React from 'react';
import { Input } from 'app/components';
import { assocPath, path } from 'ramda';
import { ChangeEvent } from 'react';
import classnames from 'classnames';


export class Form<T extends Record<string, unknown>> extends React.PureComponent<Form.IProps<T>, Form.IState<T>> {
    state: Form.IState<T>  = {
        errors: Object.create(null),
        values: Object.create(null)
    };

    public render() {
        return (
            <form>
                {
                    this.props.fields.map(this._prepareField, this)
                }
            </form>
        );
    }

    private _prepareField(field: Form.IFormItem, index: number) {
        // const hasCounter = field.maxBytes || field.maxLength;
        const value = path(field.field.split('.'), this.state.values) as string;
        const isValid = !this.state.errors[field.field] || !this.state.errors[field.field];
        const inputClassName = classnames({ isValid });

        const onChange = (event: ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            const clone = assocPath(field.field.split('.'), value, this.state.values);
            this.setState({ values: clone });
            this.props.onChange(clone);
        };

        return (
            <div key={`form-item-${index}`} className={'row'}>
                <label>{field.title}</label>
                <Input mode={field.mode}
                       className={inputClassName}
                       errors={this.state.errors[field.field]}
                       onChange={onChange}
                       value={value}/>
            </div>
        );
    };

    static getDerivedStateFromProps(props: Form.IProps<any>, state: Form.IState<any>) {
        const clone = { ...state };
        clone.values = Object.create(null);
        clone.errors = Object.create(null);

        props.fields.forEach(field => {
            if (field.validator) {
                const errors = field.validator(props.values[field.field])
                    .filter(Boolean);
                clone.errors[field.field] = errors;
            }

            const value = path(field.field.split('.'), props.values);
            clone.values = assocPath(field.field.split('.'), value, clone.values);
        });

        return clone;
    }

    static wrap(...list: Array<ICallback<string, string | null>>): ICallback<string, Array<string>> {
        const isString = (x: unknown): x is string => Boolean(x);
        return input => list.map(validate => validate(input))
            .filter(isString);
    }

    static validators = {
        required: (value: string) => String(value).length === 0 ? 'Field is required!' : null
    };
}


export namespace Form {

    export interface IProps<T extends Record<string, unknown>> {
        fields: IFormItem[];
        values: T;
        onChange: ICallback<T, void>;
    }

    export interface IState<T extends Record<string, unknown>> {
        errors: Record<keyof T, Array<string>>;
        values: T;
    }

    export interface IFormItem {
        title: string;
        mode: Input.INPUT_MODE;
        field: string;
        maxLength?: number;
        maxBytes?: number;
        validator?: ICallback<string, Array<string>>;
    }
}
