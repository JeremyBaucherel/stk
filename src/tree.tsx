import './tree.css';
import * as React from 'react';
import {Button} from './button';
import {EIcon, Icon} from './icon';
import {Tooltip} from './tooltip';


export interface ITreeProps {
    children?: any;
    style?: {[propName :string]: string};
}

export class Tree extends React.PureComponent<ITreeProps, {}> {
    render (): React.ReactNode {
        let style = {};
        if (this.props.style) {
            style = this.props.style;
        }
        return (<div className="stk-tree" style={style}>{this.props.children}</div>);
    }
}

export interface ITreeNodeProps {
    buttons?: any;
    children?: any;
    collapsable?: boolean;
    icon?: EIcon;
    icons?: any;
    iconLabel?: string;
    label?: React.ReactNode;
    expanded?: boolean;
    onClick?: {(): void};
    onExpand?: {(expanded: boolean): void};
    secondaryLabel?: React.ReactNode;
    selectable?: boolean;
    selected?: boolean;
}

export interface ITreeNodeState {
    expanded: boolean;
}

export class TreeNode extends React.Component<ITreeNodeProps, ITreeNodeState> {

    constructor (props: ITreeNodeProps) {
        super(props);

        this.state = {
            expanded: !(this.props.expanded !== undefined && this.props.expanded !== true),
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleExpand = this.handleExpand.bind(this);
    }

    handleClick (): void {
        if (this.props.onClick) {
            this.props.onClick();
        }
    }

    handleExpand (): void {
        this.setState({expanded: !this.state.expanded});
        if (this.props.onExpand) {
            this.props.onExpand(!this.state.expanded);
        }
    }
    render (): React.ReactNode {
        let chevron = null;
        if (this.props.children !== undefined && this.props.collapsable !== false) {
            let chevronIcon = this.state.expanded ? EIcon.EXPAND_MORE : EIcon.CHEVRON_RIGHT;
            chevron = (<Button stealth icon={chevronIcon} onClick={this.handleExpand} />);
        }

        let children = null;
        if (this.props.children && this.state.expanded === true) {
            children = (<div className="stk-tree-node-children">{this.props.children}</div>);
        }

        let icons = [];
        if (this.props.icon) {
            let icon = (<Icon key="icon" icon={this.props.icon} />);
            if (this.props.iconLabel) {
                icon = (<Tooltip key="icon" text={this.props.iconLabel}>{icon}</Tooltip>);
            }
            icons.push((icon));
        } else if (this.props.icons) {
            icons = this.props.icons;
        }
        let nodeIcons = null;
        if (icons.length > 0) {
            nodeIcons = (<span className="stk-tree-node-icon">{icons}</span>);
        }
        
        let secondaryLabel = null;
        if (this.props.secondaryLabel) {
            secondaryLabel = (<span className="stk-tree-node-secondary-label">{this.props.secondaryLabel}</span>);
        }

        let className = 'stk-tree-node';
        let classNameTitle = 'stk-tree-node-title';
        if (this.props.selectable === true) {
            classNameTitle += ' stk-tree-node-selectable';
        }
        if (this.props.selected === true) {
            classNameTitle += ' stk-tree-node-selected';
        }

        let buttons = null;
        if (this.props.buttons) {
            buttons = (<div className="stk-tree-node-buttons">{this.props.buttons}</div>);
        }

        return (
            <div className={className}>
                <div className={classNameTitle} onClick={this.handleClick}>
                    {chevron}
                    {nodeIcons}
                    <span className="stk-tree-node-label">{this.props.label}</span>
                    {secondaryLabel}
                    {buttons}
                </div>
                {children}
            </div>
        );
    }
}