import * as React from 'react';
import { Input as AntdInput } from 'antd';
import { InputProps } from 'antd/lib/input';
import { If } from 'app/components';
import classNames from 'classnames';


export class Input extends React.PureComponent<Input.IProps, Input.IState> {

    state = {
        touched: false
    };

    render() {
        const Tag = this.props.mode === Input.INPUT_MODE.TEXT_AREA ? AntdInput.TextArea : AntdInput;
        const isTouched = this.state.touched;
        const className = classNames(this.props.className || '', { isTouched });
        const props = { ...this.props, onBlur: this._onBlur, className };

        const errors = this._getErrors();

        return (
            <div className={'input-wrapper'}>
                <Tag {...props}></Tag>
                <If condition={this.state.touched}>
                    {errors}
                </If>
            </div>
        );
    }

    private _onBlur = (event: any) => {
        this.setState({ touched: true });
        if (this.props.onBlur) {
            this.props.onBlur(event);
        }
    };

    private _getErrors() {
        return (this.props.errors || []).map((error, index) => {
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

    export interface IState {
        touched: boolean;
    }
}
