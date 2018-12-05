import * as React from 'react';
import { Menu, Icon } from 'antd';
import { UserCard } from 'app/components'
import './meny.less';
import * as menuConfig from './menu.json';

const { Item, SubMenu } = Menu;


const MenuTitle:React.StatelessComponent<ITitleProps> = ({ title, icon = null }) => {
    return <span>{icon ? <Icon type={icon}/> : null}{title}</span>;
};

export class OracleMenu extends React.PureComponent<IMenu, IMenuState> {
    
    readonly state = Object.create(null);
    
    private selectMenuHandle = (params: { key: string }) => {
        const menuItem = (menuConfig as any).menu[params.key];
        const path = (menuItem && menuItem.path) || null;
        
        if (path != null) {
            this.props.history.push(path);
        }
        
    };
    
    render(): React.ReactNode {

        const { mode, menu, theme, selectedMenuBypath = {} }: IMenuConfig = menuConfig as any;
        const { oracle, logout, dataTransaction, templates, tokens } = menu;
        const currentPath = this.props.path;
        const realPath = Object.keys(selectedMenuBypath).reduce((acc, path) => {
            if (currentPath.includes(path) && acc.length < path.length) {
                return path;
            }
            return acc;
        }, '/');
        
        const menuKey = (selectedMenuBypath as any)[realPath] || oracle.key;
        
        return (
            <div className="oracle-menu">
                <div className="oracle-menu_title">Oracle</div>
                <div className="oracle-menu_user-card">
                    <UserCard address={this.props.address} name={this.props.name}/>
                </div>
                <Menu
                    selectedKeys={[menuKey]}
                    selectable={true}
                    mode={mode as any}
                    theme={theme as "dark"}
                    multiple={false}
                    onSelect={this.selectMenuHandle}
                    {...this.props}
                >
                    <Item key={oracle.key}>
                        <MenuTitle title={oracle.title} icon={oracle.icon}/>
                    </Item>
                    <SubMenu key={templates.key}
                             title={<MenuTitle title={templates.title} icon={templates.icon}/>}
                    >
                        <Item key={tokens.key}>
                            <MenuTitle title={tokens.title} icon={tokens.icon}/>
                        </Item>
                    </SubMenu>
                    <Item key={dataTransaction.key}>
                        <MenuTitle title={dataTransaction.title} icon={dataTransaction.icon}/>
                    </Item>
                    <Item key={logout.key}>
                        <MenuTitle title={logout.title} icon={logout.icon}/>
                    </Item>
                </Menu>
            </div>
        );
    }
    
}

interface IMenuItemConf {
    className?: string;
    title: string;
    key: string;
    icon?: string;
    path?: string;
}

interface IMenuConfig {
    menu: { [key: string]: IMenuItemConf}
    mode?: string,
    theme?: string,
    selectedMenuBypath?: Object;
}

interface IMenu {
    onSelect?: (options: any) => void;
    history?: any;
    address?: string;
    name?: string;
    path: string;
}

interface ITitleProps {
    title: string;
    icon: any;
}

interface IMenuState {
    opened: Array<string>;
}
