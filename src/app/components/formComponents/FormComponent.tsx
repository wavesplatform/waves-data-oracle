import * as React from 'react';

namespace FormComponent {
    
    export interface IProps<T> {
        field: string;
        value: T;
        validator?: (value: T) => Promise<null | Array<string>>;
        convertValue?: (value: number|string) => T;
        readOnly?: boolean;
        onFocus?: any;
        onBlur?: any;
        onChange?: ({ value, field, isValid }: { value: T, field: string, isValid: boolean }) => void;
        values?: Array<{value: T, text: string}>;
        defaultValue?: T;
        mode?: any;
        className?: string;
    }
    
    export interface IState<T> {
        value: T,
        errors: Array<string>;
        isValid: boolean;
        touched: boolean;
        focused: boolean;
    }
}

export type IState<T> = FormComponent.IState<T>;
export type IProps<T> = FormComponent.IProps<T>;

export class FormComponent<T, IState extends FormComponent.IState<T>> extends React.PureComponent<FormComponent.IProps<T>, IState> {

    readonly state = Object.create(null);
    
    constructor(props: FormComponent.IProps<T>) {
        super(props);
        this.state = {
            ...this.state,
            initValue: props.value,
            value: props.value,
            errors: [],
            isValid: true,
            touched: false,
            focused: false,
        };
        this.validate(props.value);
    }
    
    focus() {
        this.focusHandler();
    }
    
    blur() {
        this.blurHandler();
    }
    
    changeHandler = (nextValue: any) => {
        const value = this.props.convertValue ? this.props.convertValue(nextValue) : nextValue;
        this.setState({ value, isValid: false });
        this.validate(value);
    };
    
    focusHandler = () => {
        this.setState({ focused: true });
        if (this.props.onFocus) {
            this.props.onFocus(this.props.field);
        }
    };
    
    blurHandler = () => {
        this.setState({ focused: false, touched: true });
        if (this.props.onBlur) {
            this.props.onBlur(this.props.field);
        }
    };
    
    render() {
        return <div></div>;
    }

    protected getProps() {
        const props = { ...this.props } as any;
        
        [   'field',
            'value',
            'validator',
            'convertValue',
            'onFocus',
            'onBlur',
            'onChange',
            'values',
            'defaultValue',
            'mode',
            'index',
            'className',
            'limit'
        ].forEach((key) => {
            delete props[key];
        });
        
        return { ...props, onFocus: this.focusHandler, onBlur: this.blurHandler }
    }
    
    private async validate(value: T) {
        if (!this.props.validator) {
            this.setState({ errors: [], isValid: true });
            if (this.props.onChange) {
                this.props.onChange({ field: this.props.field, value: value, isValid: true });
            }
            return null;
        }
        
        const errors = await this.props.validator(value) || [];
        const isValid = !Boolean(errors && errors.length);
        
        this.setState({ errors, isValid });
        
        if (this.props.onChange) {
            this.props.onChange({ field: this.props.field, value: value, isValid });
        }
    }
    
    public static getDerivedStateFromProps(props: any, state: any) {
        const { value } = props;
        if (state.initValue === value) {
            return state;
        }
        
        return { ...state, value, initValue: value };
    }
}
