import './data.css';
import * as React from 'react';
import {EIcon, Icon} from './icon';
import {T} from './text';

export interface IDataProps {
	compact?: boolean;
	height?: number;
}
export class Data extends React.PureComponent<IDataProps, {}> {
	render () {
		var className = 'stk-data';
		if (this.props.compact === true){
			className += ' stk-data-compact';
		}
		
		if (this.props.height) {
			className += ' stk-data-height-' + this.props.height.toString();
		}
		
		return (
			<div className={className}>{this.props.children}</div>
		);
	}
}

export interface IDataRowProps {
	children?: any;
	selected?: boolean;
	highlighted?: boolean;
	big?: boolean;
	small?: boolean;
	selectable?: boolean;
	height?: number;
	onClick ?: {(e: any): void};
}
export class DataRow extends React.PureComponent<IDataRowProps, {}> {
	render () {
		let className = 'stk-data-row';
		if (this.props.selected === true){
			className += ' stk-data-row-selected';
		}
		if (this.props.highlighted === true){
			className += ' stk-data-row-highlighted';
		}
		if (this.props.big === true){ 
			className += ' stk-data-row-big';
		}
		if (this.props.small === true){ 
			className += ' stk-data-row-small';
		}
		if (this.props.selectable === true){ 
			className += ' stk-data-row-selectable';
		}
		
		if (this.props.height) {
			className += ' stk-data-row-' + this.props.height;
		}
		
		return (
			<div className={className} onClick={this.props.onClick}>{this.props.children}</div>
		);
	}
}

export class DataRowSeparator extends React.PureComponent {
	render () {
		return (<div className="stk-data-row-separator" />);
	}
}

export interface IDataHeadProps {
	children?: any;
	onClick?: {(e: any): void};
}
export class DataHead extends React.PureComponent<IDataHeadProps, {}> {
	render () {
		return (
			<div className="stk-data-head" onClick={this.props.onClick}>{this.props.children}</div>
		);
	}
}


export interface IDataCellProps {
	alignRight?: boolean;
	center?: boolean;
	className?: string;
	icon?: EIcon;
	noWrap?: boolean;
	size?: number;
	subtle?: boolean;
	whenHovering?: boolean;
}

export class DataCell extends React.Component<IDataCellProps, {}> {
	getCssClassName () {
		var className = 'stk-data-cell';
		if (this.props.className) {
			className += ' ' + this.props.className;
		}
		if (this.props.size){
			className += ' stk-data-cell-' + this.props.size;
		}
		if (this.props.center === true){
			className += ' stk-data-cell-center';
		}
		if (this.props.alignRight === true){
			className += ' stk-data-cell-right';
		}
		if (this.props.noWrap === true) {
			className += ' stk-no-wrap';
		}
		if (this.props.subtle === true) {
			className += ' stk-subtle';
		}
		if (this.props.whenHovering === true) {
			className += ' stk-data-cell-when-hovering';
		}
		return className
	}
	
	getIcon () {
		let icon = null;
		if (this.props.icon) {
			icon = (<Icon className="stk-data-cell-icon" icon={this.props.icon} />);
		}
		return icon;
	}
	
	render (): React.ReactNode {	
		return (
			<div className={this.getCssClassName()}>{this.getIcon()}{this.props.children}</div>
		);
	}
}



export interface IDataCellEditableProps extends IDataCellProps {
	children: string;
	enabled?: boolean;
	onEdit?: {(newValue: string): void};
}

export interface IDataCellEditableState {
	editing: boolean;
	initialValue: string;
	value: string;
}

export class DataCellEditable extends DataCell {

	props: IDataCellEditableProps;
	state: IDataCellEditableState;
	textInput: HTMLInputElement | null;

	constructor (props: IDataCellEditableProps) {
		super(props);
		
		this.state = {
			editing: false,
			initialValue: props.children,
			value: props.children,
		}
		this.textInput = null;
		this.handleDoubleClick = this.handleDoubleClick.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}
	
	getCssClassName () {
		let className = super.getCssClassName();
		
		if (this.state.editing !== true) {
			className += ' ';
		}
		
		return className;
	}
	
	componentDidUpdate () {
		if (this.state.editing === true && this.textInput !== null) {
			this.textInput.focus();
		}
	}
	
	handleBlur () {
		this.endEditing();
	}
	
	handleChange (e: React.ChangeEvent<HTMLInputElement>) {
		this.setState({value: e.target.value});
	}
	
	handleDoubleClick () {
		this.setState({editing: true});
	}	
	
	endEditing (): void {
		this.setState({editing: false, value: this.props.children});
		if (this.state.initialValue != this.state.value && this.props.onEdit) {
			this.props.onEdit(this.state.value);
		}
	}
	
	handleKeyPress (e: React.KeyboardEvent<HTMLInputElement>): void {		
		if (e.key == 'Enter') {
			this.endEditing();
		}
	}
	
	render (): React.ReactNode {
		if (this.state.editing === true) {
			return (
				<div className={this.getCssClassName()}>
					<input
						type="text"
						value={this.state.value}
						ref={(input) => { this.textInput = input; }}
						onBlur={this.handleBlur}
						onChange={this.handleChange}
						onKeyPress={this.handleKeyPress} />
				</div>
			);
		} else {
			let displayValue :React.ReactNode = this.props.children;
			if (this.props.enabled === false) {
				displayValue = (<T strike subtle>{displayValue}</T>);
			}
			return (
				<div className={this.getCssClassName()} onClick={this.handleDoubleClick}>{this.getIcon()}{displayValue}</div>
			);
		}
	}
}


export interface IDataColProps {
	alignRight?: boolean;
	className?: string;
	clickable?: boolean;
	size?: number;
}

export class DataCol extends React.PureComponent<IDataColProps, {}> {
	render () {
		var className = 'stk-data-col';
		if (this.props.className) {
			className += ' ' + this.props.className;
		}
		if (this.props.clickable === true){
			className += ' stk-data-col-clickable';
		}
		if (this.props.alignRight === true){
			className += ' stk-data-col-right';
		}
		if (this.props.size !== null){
			className += ' stk-data-col-' + this.props.size;
		}
		
		return (
			<div className={className}>{this.props.children}</div>
		);
	}
}