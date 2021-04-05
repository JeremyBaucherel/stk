import './alert.css';
import * as React from 'react';
import {EIcon, Icon} from './icon';

export interface IAlertBoxProps {
	icon?: EIcon;
	title?: string;
	text?: string;
}

export class AlertBox extends React.PureComponent<IAlertBoxProps, {}> {
		
	render (): React.ReactNode {
		let icon = this.props.icon;

		if (icon === undefined) {
			icon = EIcon.ERROR_OUTLINE;
		}

		let title = null;
		if (this.props.title) {
			title = (<h2><strong>{this.props.title}</strong></h2>)
		}

		let text = null;
		if (this.props.text) {
			text = (<p>{this.props.text}</p>);
		}

		return (
			<div className="stk-alertbox">
				<div className="stk-alertbox-icon"><Icon icon={icon} /></div>
				<div className="stk-alertbox-body">
					{title}
					{text}
					{this.props.children}
				</div>
			</div>
		);
	}
}