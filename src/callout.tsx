import './callout.css';
import * as React from 'react';
import * as Common from './common';
import {EIcon, Icon} from './icon';

export interface ICalloutProps {
    icon?: EIcon;
    padding?: Common.Padding;
    style?: Common.EStyle;
    title: string;
}

export class Callout extends React.PureComponent<ICalloutProps, {}> {
    render (): React.ReactNode {
        let className = 'stk-callout';
        className += ' ' + Common.getStyleClass(this.props.style, Common.EStyle.PRIMARY);
        className += ' ' + Common.getPaddingClass(this.props.padding, Common.Padding.Medium);

        return (
            <div className={className}>
                {this.renderIcon()}
                <div className="stk-callout-content">
                    <div className="stk-callout-title">{this.props.title}</div>
                    {this.renderBody()}
                </div>
            </div>
        );
    }

    renderBody (): React.ReactNode {
        if (this.props.children) {
            return (<div className="stk-callout-body">{this.props.children}</div>);
        } else {
            return null;
        }
    }

    renderIcon (): React.ReactNode {
        if (this.props.icon) {
            return (<Icon icon={this.props.icon} className="stk-callout-icon" />);
        } else {
            return null;
        }
    }
}