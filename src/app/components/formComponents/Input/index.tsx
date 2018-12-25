import * as React from 'react';
import { Input as AntdInput } from 'antd';
import { FormComponent, IState } from '../FormComponent';
import { InputProps } from 'antd/lib/input';
import { If } from 'app/components';
import classNames from 'classnames';
import { ChangeEvent } from 'react';


export class Input<T> extends FormComponent<T, IState<T>> {

    render() {
        const Tag = (this.props.mode === 'textarea' ? AntdInput.TextArea : AntdInput) as any;
        const isTouched = this.state.touched;
        const isValid = this.state.errors.length;
        const className = classNames(this.props.className || '', { isTouched }, { isValid });
        const props = {
            ...this.getProps(),
            className,
            onChange: (e: ChangeEvent) => this.changeHandler((e.target as HTMLInputElement).value),
            size: 'large',
        };
        const errors = this._getErrors();

        return (
            <div className={'input-wrapper'}>
                <Tag {...props} value={this.state.value}/>
                <If condition={this.state.touched}>
                    {errors}
                </If>
            </div>
        );
    }
    
    private _getErrors() {
        return (this.state.errors || []).map((error: string, index: number) => {
            return (
                <div key={`error-input-${index}`} className={'error'}>{error}</div>
            );
        });
    }
}

export namespace Input {
    export const enum INPUT_MODE {
        INPUT = 'input',
        TEXT_AREA = 'textArea'
    }

    export interface IProps extends InputProps {
        errors?: Array<string>;
        mode?: Input.INPUT_MODE
    }
}
