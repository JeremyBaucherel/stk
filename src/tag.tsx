import './tag.css';
import * as React from 'react';
import {EIcon, Icon} from './icon';


export interface ITagProps {
    icon?: EIcon;
    onClick?: {(): void};
    onRemove?: {(): void};
    removable?: boolean;
    text: string;
}

export class Tag extends React.Component<ITagProps> {
    render (): React.ReactNode {
        let className = 'stk-tag';
        if (this.props.onClick) {
            className += ' stk-tag-clickable';
        }

        let icon: React.ReactNode | null = null;
        if (this.props.icon) {
            icon = <Icon icon={this.props.icon} />
        }

        let removeButton : React.ReactNode | null = null;
        if (this.props.removable === true) {
            removeButton = (
                <span className="stk-tag-remove-button" onClick={this.props.onRemove}><Icon icon={EIcon.CLOSE} /></span>
            );
        }

        return (
            <span className={className}>
                <span className="stk-tag-label" onClick={this.props.onClick}>
                    {icon}
                    {this.props.text}
                </span>
                {removeButton}
            </span>
        );
    }
}

export interface ITagListProps {

}

export class TagList extends React.Component {
    render (): React.ReactNode {
        return (<span className="stk-tag-list">{this.props.children}</span>);
    }
}