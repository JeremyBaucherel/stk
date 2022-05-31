import './tooltip.css';
import * as React from 'react';
import {Popover, EPosition, ETrigger} from './popover';


export interface ITooltipProps {
	children: JSX.Element;
	position?: EPosition;
	text: string;
}

export class Tooltip extends React.PureComponent<ITooltipProps, {}> {
	render (): React.ReactNode {
		return (
			<Popover position={this.props.position} trigger={ETrigger.HOVER_TARGET_ONLY} allowReposition={true} popoverClassName="stk-tooltip">
				{this.props.children}
				<div className="stk-tooltip-text">{this.props.text}</div>
			</Popover>
		);
	}
}