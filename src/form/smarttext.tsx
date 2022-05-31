import './form.css';
import * as React from 'react';
import {Button} from '../button';
import {FormControl} from './control';
import {EIcon, Icon} from '../icon';
import {EPosition} from '../popover';
import {Tooltip} from '../tooltip';

export class FormValueValidator {
	static validate_positive_int (val: string): boolean {
		if(val == ""){
			return true;
		}else{
			return /^[0-9]+$/.test(val);
		}
	}
	static validate_int (val: string): boolean {
		if(val == ""){
			return true;
		}else{
			return /^([+-]?[1-9]\d*|0)$/.test(val);
		}
	}

}


export interface IFormSmartTextProps {
	buttonIcon?: EIcon;
	buttonTooltip?: string;
	error?: string;
	icon?: EIcon;
	label?: string;
	mask?: string;
	onBlur?: {(newValue: string): void};
	onChange?: {(newValue: string): void};
	onKeyUp?: {(e: any): void};
	onButtonClick?: {(): void};
	password?: boolean;
	placeholder?: string;
	value?: string;
	disabled?: boolean;
	mandatory?: boolean;
}

export interface IFormSmartTextState {
	hasFocus: boolean;
	value?: string;
}

export class FormSmartText extends React.Component<IFormSmartTextProps, IFormSmartTextState> {
	element: HTMLElement | null;
	menuCursorPosition: Number;
	validator: {(value: string): boolean} | null;

	constructor (props: IFormSmartTextProps) {
		super(props);

		this.state = {
			hasFocus: false,
			value: this.props.value,
		}

		this.menuCursorPosition = 0;
		this.handleChange = this.handleChange.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
		this.element = null;
		this.validator = null;

		if (this.props.mask) {
			if (this.props.mask == 'int,positive') {
				this.validator = FormValueValidator.validate_positive_int;
			}
			if (this.props.mask == 'int') {
				this.validator = FormValueValidator.validate_int;
			}
		}
	}

	componentWillReceiveProps(newProps: IFormSmartTextProps): void {
		this.setState({value: newProps.value});
	}

	handleBlur (e: React.ChangeEvent<HTMLInputElement>): void {
		this.setState({hasFocus: false});
		if (this.validator === null || (this.validator !== null && this.validator(e.target.value))) {
			this.setState({value: e.target.value});
			if (this.props.onBlur) {
				this.props.onBlur(e.target.value);
			}
		}
	}

	handleChange (e: React.ChangeEvent<HTMLInputElement>): void {
		if (this.validator === null || (this.validator !== null && this.validator(e.target.value))) {
			this.setState({value: e.target.value});
			if (this.props.onChange) {
				this.props.onChange(e.target.value);
			}
		}
	}

	handleClick (): void {
		if (this.element) {
			this.element.focus();
		}
	}

	handleFocus (): void {
		this.setState({hasFocus: true});
	}

	handleKeyUp (e:any): void {
		if (this.props.onKeyUp) {
			this.props.onKeyUp(e);
		}
	}

	render (): React.ReactNode {
		let inputClass = 'stk-form-text';

		if (this.props.error) {
			inputClass += ' stk-error';
		} else if (this.state.hasFocus) {
			inputClass += ' stk-form-text-focus';
		}

		let buttonIcon = null;
		if (this.props.buttonIcon) {
			buttonIcon = (<Button stealth icon={this.props.buttonIcon} onClick={this.props.onButtonClick} />);

			if (this.props.buttonTooltip) {
				buttonIcon = (<Tooltip text={this.props.buttonTooltip}>{buttonIcon}</Tooltip>);
			}
		}

		let input = (<input
			ref={(e) => this.element = e}
			type={this.props.password === true ? 'password' : 'text'}
			spellCheck={false}
			placeholder={this.props.placeholder}
			value={this.state.value}
			onChange={this.handleChange}
			onFocus={this.handleFocus}
			onBlur={this.handleBlur}
			onKeyUp={this.handleKeyUp} 
			disabled={this.props.disabled}
			/>
		);

		let icon: EIcon | null = null;
		if (this.props.icon) {
			icon = this.props.icon;
		}
		if (this.props.error) {
			icon = EIcon.ERROR;
		}

		let style:any = {}
		if(this.props.mandatory && this.state.value==""){ 
			style = {backgroundColor: "#ffcccc"};
		}

		let node = (
			<div className={inputClass} style={style}>
				{ icon ? (<Icon icon={icon} />) : ''}
				{input}
				{buttonIcon}
			</div>
		);

		if (this.props.label) {
			node = (
				<FormControl>
					{ this.props.label ? (<label className="stk-form-label">{this.props.label}</label>) : ''}
					{node}
				</FormControl>
			)
		}

		if (this.props.error) {
			node = (<Tooltip text={this.props.error} position={EPosition.BOTTOM_LEFT}>{node}</Tooltip>);
		}
		return node;
	}
}
