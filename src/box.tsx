import * as React from 'react';
import * as Common from './common';
import './box.css';


export interface IBoxProps {
	children?: any;
	width?: string; // Custom CSS width to add
	raised?: boolean; // Add a raised style
	fullHeight?: boolean; // Whether to stretch to the full height available
	style?: any; // Any additional CSS style to apply
	withBorder?: boolean; // Add a border around the box
}

export class Box extends React.PureComponent<IBoxProps, {}> {

	render (): React.ReactNode {
		let style: {[prop: string]: string} = {};

		if (this.props.style) {
			style = this.props.style;
		}

		if (this.props.width) {
			style['width'] = this.props.width;
		}

		let className = 'stk-box-container';
		if (this.props.raised === true) {
			className += ' stk-box-raised';
		}
		if (this.props.fullHeight === true) {
			className += ' stk-box-full-height';
		}

		if (this.props.withBorder === true) {
			className += ' stk-box-with-borders';
		}
		return (
			<div className={className} style={style}>
				<div className="stk-box">{this.props.children}</div>
			</div>
		);
	}
}

export interface IBoxHeadingProps {
	children?: any;
	center?: boolean; // Whether to center the heading contents
	style?: any;
}

export class BoxHeading extends React.PureComponent<IBoxHeadingProps, {}> {
	render (): React.ReactNode {
		var className = 'stk-box-heading';
		if (this.props.center === true){
			className += ' stk-box-heading-center';
		}

		let style = {};
		if (this.props.style) {
			style = this.props.style;
		}
		return (
			<div className={className} style={style}>{this.props.children}</div>
		);
	}
}

export interface IBoxSubHeadingProps {
	center?: boolean; // Whether to center the subheading contents
}

export class BoxSubHeading extends React.PureComponent<IBoxSubHeadingProps, {}> {

	render (): React.ReactNode {
		var className = 'stk-box-subheading';
		if (this.props.center === true){
			className += ' stk-box-subheading-center';
		}

		return (
			<div className={className}>{this.props.children}</div>
		);
	}
}

export interface IBoxFooterProps {
	alignRight?: boolean; // Whether to align the footer contents to the right
	children?: any;
}

export class BoxFooter extends React.PureComponent<IBoxFooterProps, {}> {
	render (): React.ReactNode {
		var className="stk-box-footer";
		if (this.props.alignRight === true){
			className += ' stk-box-footer-right';
		}

		return (
			<div className={className}>{this.props.children}</div>
		);
	}
}

export interface IBoxBodyProps {
	// dense?: boolean;
	center?: boolean; // Whether to center the body contents
	fullHeight?: boolean; // Whether to stretch to the full height available
	className?: string; // A CSS class to add
	big?: boolean;
	flex?: boolean; // Set this DOM node to a flex node
	small?: boolean;
	padding?: Common.Padding; // A padding size to apply
	style?: any; // Any custom style to apply
	verticalScroll?: boolean; // Whether to add vertical scrolling capability
	withBackground?: boolean; // Add a solid light grey background
}

export class BoxBody extends React.PureComponent<IBoxBodyProps, {}> {

	render (): React.ReactNode {
		var className = 'stk-box-body';

		if (this.props.center === true) {
			className += ' stk-box-body-center';
		}
		if (this.props.fullHeight === true) {
			className += ' stk-box-body-grow';
		}

		if(this.props.withBackground === true) {
			className += ' stk-box-body-with-background';
		}

		if (this.props.className) {
			className += ' ' + this.props.className;
		}

		if (this.props.big === true) {
			className += ' stk-box-body-big';
		}
		if (this.props.small === true) {
			className += ' stk-box-body-small';
		}
		if (this.props.flex === true) {
			className += ' stk-box-body-flex';
		}

		if (this.props.padding) {
			className += ' ' + Common.getPaddingClass(this.props.padding);
		}else{
			className += ' ' + Common.getPaddingClass();
		}

		let comp = (
			<div className={className} style={this.props.style}>{this.props.children}</div>
		);

		if (this.props.verticalScroll === true) {
			comp = (<div className="stk-box-vscroll">{comp}</div>);
		}
		return comp;
	}
}