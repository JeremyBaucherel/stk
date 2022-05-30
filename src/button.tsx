import './button.css';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {EIcon, Icon} from './icon';
import {Tooltip} from './tooltip';
import {EPosition} from './popover';


export interface IButtonBarProps {
	children?: any;
}

export class ButtonBar extends React.PureComponent<IButtonBarProps, {}> {
	render () {
		return (<div className="stk-button-bar">{this.props.children}</div>);
	}
}

export interface IButtonProps {
	active?: boolean;
	caution?: boolean;
	className?: string; // Additional CSS class name to apply
	enabled?: boolean;
	flat?: boolean;
	icon?: EIcon; // Icon to display on the button
	loading?: boolean; // Whether the button is in a loading state (showing a spinner)
	onClick?: {():void}; // Event to call when the button is clicked
	onDoubleClick?: {():void}; // Event to call when the button double-clicked
	placeHolder?: boolean;
	primary?: boolean;
	secondary?: boolean;
	stealth?: boolean;
	style?: any; // Any custom CSS style to apply
	target?: string; // Equivalent to the HTML attribute target. Use target="_blank" to open the link in a new window
	to?: string; // Destination URL
	tooltip?: string; // Tooltip text to display when mouse-hovering the button
	position?: EPosition;
}

export class Button extends React.PureComponent<IButtonProps, {}> {

	constructor (props: IButtonProps) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
		this.handleDoubleClick = this.handleDoubleClick.bind(this);
	}

	handleClick (): void {
		if (this.isEnabled() && this.isLoading() !== true && this.props.onClick){
			this.props.onClick();
		}
	}

	handleDoubleClick (): void {
		if (this.isEnabled() && this.isLoading() !== true && this.props.onDoubleClick){
			this.props.onDoubleClick();
		}
	}

	isEnabled (): boolean {
		return this.props.enabled === undefined || this.props.enabled===true;
	}

	isLoading (): boolean {
		return this.props.loading===true;
	}

	render (): React.ReactNode {
		let className = 'stk-button'

		if (this.props.primary == true){
			className += ' stk-button-primary';
		} else if (this.props.secondary == true) {
			className += ' stk-button-secondary';
		} else if (this.props.caution == true) {
			className += ' stk-button-caution';
		} else if (this.props.flat == true) {
			className += ' stk-button-flat';
		}else if (this.props.stealth == true) {
			className += ' stk-button-stealth';
		} else if (this.props.placeHolder == true) {
			className += ' stk-button-placeholder';
		}

		if (this.props.loading === true) {
			className += ' stk-loading';
		}
		if (!this.isEnabled()) {
			className += ' stk-button-disabled';
		}

		if (this.props.className) {
			className += ' ' + this.props.className;
		}

		let icon = null;
		if (this.props.icon){
			if (this.props.loading === true) {
				icon = (<Icon className="stk-button-icon" icon={EIcon.REFRESH} spinning={true} />);
			} else {
				icon = (<Icon className="stk-button-icon" icon={this.props.icon} />);
			}
		}

		let children = null;
		if (this.props.children) {
			children = (<span>{this.props.children}</span>);
		}

		let target = '';
		if (this.props.target) {
			target = this.props.target;
		}

		let button = null;
		if (this.props.to) {
			if (this.props.to.substring(0, 4) == 'http' || this.props.to.substring(0, 6) == 'mailto') {
				button = (<a href={this.props.to} className={className} onClick={this.handleClick} onDoubleClick={this.handleDoubleClick} target="_blank" style={this.props.style}>{icon}{children}</a>);
			} else {
				button =(<Link to={this.props.to} className={className} onClick={this.handleClick} onDoubleClick={this.handleDoubleClick} style={this.props.style} target={target}>{icon}{children}</Link>);
			}
		} else {
			button = (<button className={className} onClick={this.handleClick} onDoubleClick={this.handleDoubleClick} style={this.props.style}>{icon}{children}</button>);
		}

		if (this.props.tooltip) {
			return (<Tooltip position={this.props.position} text={this.props.tooltip}>{button}</Tooltip>);
		} else {
			return button;
		}
	}
}
