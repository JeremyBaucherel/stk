import './menu.css';
import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import {EIcon, Icon} from './icon';
import * as Common from './common';

export interface IMenuProps {
    children?: any;
    closePopover?: {(): void};
    style?: any;
}

export class Menu extends React.PureComponent<IMenuProps, {}> {

    constructor (props: IMenuProps) {
        super(props);

        this.handleItemClick = this.handleItemClick.bind(this);
    }
    
    handleItemClick (): void {
        if (this.props.closePopover) {
            this.props.closePopover();
        }
    }

    render (): React.ReactNode {
        let children = [];
        for (let i = 0; i < this.props.children.length; ++i) {
            if(this.props.children[i]!=null){
                children.push(React.cloneElement(this.props.children[i], {_onClick: this.handleItemClick}));
            }
        }
        let style = null;
        if (this.props.style) {
            style = this.props.style;
        }
        let className = Common.getClassName("stk-menu", Common.getPaddingClass(Common.Padding.Small));
        
        return (<div className={className} style={style}>{children}</div>);
    }
}

export interface IMenuSeparatorProps {
    key: string;
}

export class MenuSeparator extends React.PureComponent<IMenuSeparatorProps, {}> {
    render (): React.ReactNode {
        return (<div key={this.props.key} className="stk-menu-separator" />);
    }
}

export interface IMenuItemProps {
    checked?: boolean;
    children?: any;
    key: string;
    icon?: EIcon;
    onClick?: {(): void};
    _onClick?: {(): void};
    selected?: boolean;
    text?: string;
    to?: string;
}

export class MenuItem extends React.PureComponent<IMenuItemProps, {}> {
    constructor (props: IMenuItemProps) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick (): void {
        if (this.props.onClick) {
            this.props.onClick();
        }
        if (this.props._onClick) {
            this.props._onClick();
        }
    }

    render (): React.ReactNode {
        let className = Common.getClassName('stk-menu-item', Common.getPaddingClass(Common.Padding.Medium));
        if (this.props.selected === true) {
            className += ' stk-menu-item-selected';
        }

        let icon = null;
        if (this.props.icon) {
            icon = (<Icon className="stk-menu-item-icon" icon={this.props.icon} />);
        }

        if (this.props.checked === true) {
            icon = (<Icon className="stk-menu-item-icon" icon={EIcon.CHECK} />);
        }

        let content = null;
        if (this.props.text) {
            content = (<p>{this.props.text}</p>);
        } else {
            content = this.props.children;
        }

        if (this.props.to) {
            if (this.props.to.substring(0, 4) == 'http' || this.props.to.substring(0, 6) == 'mailto') {
                return (<a href={this.props.to} className={className} onClick={this.handleClick} target="_blank">{icon}{content}</a>);
            } else {
                return (<ReactRouterDOM.Link to={this.props.to} className={className} onClick={this.handleClick}>{icon}{content}</ReactRouterDOM.Link>);
            }
        } else {
            return (<div className={className} onClick={this.handleClick}>{icon}{content}</div>);
        }
    }
}
