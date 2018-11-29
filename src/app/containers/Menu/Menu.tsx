import * as React from 'react';
import { Menu } from 'antd';
import './meny.less';
import * as menuConfig from './menu.json';

const { Item, SubMenu } = Menu;

interface IMenuItem {
    key: string;
    type: string;
    className?: string;
    title?: string;
    icon?: string;
    onSelect?: (key: string) => void;
}

interface ISubMenuItem extends IMenuItem {
    toggleSubMenu?: boolean;
    menu?: Array<IMenuItem|ISubMenuItem>;
}

const MenuItem: React.StatelessComponent<IMenuItem> = ({ key, title, icon, ...props }) => {
    return <Item key={key} {...props}>{title}</Item>
};

const MenuSubMenu: React.StatelessComponent<ISubMenuItem> = ({ toggleSubMenu, menu, key, title, icon, onSelect, ...props }) => {
    return <SubMenu title={title} key={key} {...props}>
        {menu ? <ParseMenu menu={menu}/> : null}
    </SubMenu>
};

const ParseMenu: React.StatelessComponent<{ menu: Array<any>, onSelect?: (key: string) => void }> =
    ({menu, onSelect, ...props}) => {
    return <React.Fragment>{menu.map(item => {
        switch (item.type ) {
            case 'Item':
                return <MenuItem onSelect={onSelect} {...{ ...item, ...props}}/>;
            case 'SubMenu':
                return <MenuSubMenu onSelect={onSelect} {...{ ...item, ...props}}/>;
            default:
                return null;
        }
    })}</React.Fragment>
};

export class OracleMenu extends React.PureComponent {
    
    render(): React.ReactNode {
        const { mode, menu, theme } = menuConfig as any;
        return (
            <div className="left-side">
                <div className="title">Oracle</div>
                <Menu mode={mode as any} theme={theme}>
                    <ParseMenu menu={menu}/>
                </Menu>
            </div>
        );
    }
    
}
