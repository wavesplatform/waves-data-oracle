import * as React from 'react';
import { FormComponent, IState } from '../FormComponent';
import { Select as AntdSelect } from 'antd';
const Option = AntdSelect.Option;


export class Select<T> extends FormComponent<T, IState<T>> {
    
    render() {
        const { values = [] } = this.props;
        
        return <div>
            <AntdSelect size="large"
                        defaultValue={this.state.value == null ? this.props.defaultValue : this.state.value}
                        onChange={this.changeHandler}
                        onFocus={this.focusHandler}
                        onBlur={this.blurHandler}
            >
                {values.map(item => <Option value={item.value as never} key={item.text}>{item.text}</Option>)}
            </AntdSelect>
        </div>
    }
}
