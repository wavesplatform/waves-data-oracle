import * as React from 'react';
import { Select as AntdSelect } from 'antd';
const Option = AntdSelect.Option;


export const Select: React.StatelessComponent<IProps<any>> = (props) => {
    return <div>
        <AntdSelect size="large"
                    defaultValue={props.value == null ? props.defaultValue : props.value}
                    onChange={props.onChange}>
            {props.values.map(item => <Option value={item.value} key={item.text}>{item.text}</Option>)}
        </AntdSelect>
    </div>
};

interface IProps<T> {
    onChange: (value: T) => void;
    convertValue: (value: T) => T;
    value: T;
    defaultValue: T;
    values: Array<{ value: T, text: string }>;
}
