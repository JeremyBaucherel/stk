import './timeline.css';
import * as React from 'react';
import {EIcon, Icon} from './icon';

export interface ITimelineProps {
    children: React.ReactNode;
}

export class Timeline extends React.PureComponent<ITimelineProps, {}> {
    render (): React.ReactNode {
        return (<div className="stk-timeline">{this.props.children}</div>);
    }
}

export interface ITimelineItemProps {
    children: React.ReactNode;
}

export class TimelineItem extends React.PureComponent<ITimelineItemProps, {}> {
    render (): React.ReactNode {
        return (<div className="stk-timeline-item">{this.props.children}</div>);
    }
}

export interface ITimelineItemHeaderProps {
    icon?: EIcon;
    children: React.ReactNode;
}

export class TimelineItemHeader extends React.PureComponent<ITimelineItemHeaderProps, {}> {
    render (): React.ReactNode {
        return (
            <div className="stk-timeline-item-header">
                <Icon icon={this.props.icon ? this.props.icon : EIcon.RADIO_BUTTON_UNCHECKED} />
                {this.props.children}
            </div>);
    }
}

export interface ITimelineItemBodyProps {
    children: React.ReactNode
}

export class TimelineItemBody extends React.PureComponent<ITimelineItemBodyProps, {}> {
    render (): React.ReactNode {
        return (<div className="stk-timeline-item-body"><div>{this.props.children}</div></div>);
    }
}

