import './toolbar.css';
import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import {EIcon, Icon} from '../src/icon';


export interface IToolbarProps {
    title?: React.ReactNode;
    buttons?: React.ReactNode;
    tabs?: React.ReactNode;
}

export class Toolbar extends React.PureComponent<IToolbarProps> {
	render (): React.ReactNode {
        let buttons = undefined;
        if (this.props.buttons) {
            buttons = (<div className="stk-page-toolbar-buttons">{this.props.buttons}</div>);
        }
		return (
			<div className="stk-page-toolbar">		
				<div className="stk-page-toolbar-title-container">
					<div className="stk-page-toolbar-title">
						{this.props.title}
					</div>
					{buttons}
				</div>
				{this.props.tabs}
			</div>
		);
	}
}

export class ToolbarTabs extends React.PureComponent<{}> {
	render (): React.ReactNode {
		return (
			<div className="stk-page-toolbar-tabs">{this.props.children}</div>
		);
	}
}

interface IToolbarTabProps {
	active: boolean; // Wheter the tab is active (clickable) or not
	icon?: EIcon; // An optional icon for the tab title
	label: string; // The label of the tab
	to: string; // The URL the tab will lead to
}

export class ToolbarTab extends React.PureComponent<IToolbarTabProps> {
	render (): React.ReactNode {
		let className = '';
		if (this.props.active === true) {
			className = 'stk-page-toolbar-tab-active';
		}
		return (
			<ReactRouterDOM.Link className={className} to={this.props.to}>
                {this.props.icon ? (<Icon icon={this.props.icon} />) : ''}{this.props.label}
            </ReactRouterDOM.Link>
		);
	}
}