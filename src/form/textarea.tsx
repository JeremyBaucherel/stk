import './form.css';
import * as React from 'react';
import {EIcon, Icon} from '../icon';
import {Tooltip} from '../tooltip';

export interface IFormTextareaProps {
	icon?: EIcon;
	label?: string;
	error?: string;
	onChange?: {(newValue: string): void};
	onKeyUp?: {(e: any): void};
	placeholder?: string;
	rows?: number;
	value: string;
	disabled?: boolean;
	style?: any; // Any custom CSS style to apply
}

export interface IFormTextareaState {
	hasFocus: boolean;
	value: string;
}

export class FormTextarea extends React.Component<IFormTextareaProps, IFormTextareaState> {
	element?: HTMLTextAreaElement;

	constructor (props: IFormTextareaProps) {
		super(props);

		this.state = {
			hasFocus: false,
			value: props.value,
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
		this.element = undefined;
	}

	componentWillReceiveProps(newProps: IFormTextareaProps): void {
		this.setState({value: newProps.value});
	}

	handleBlur (): void {
		this.setState({hasFocus: false});
	}

	handleChange (e: React.ChangeEvent<HTMLTextAreaElement>): void {
		this.setState({value: e.target.value});
		if (this.props.onChange) {
			this.props.onChange(e.target.value);
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

	handleKeyUp (e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (this.props.onKeyUp) {
			this.props.onKeyUp(e);
		}
	}

	render (): React.ReactNode {
		let inputClass = 'stk-form-textarea';

		if (this.props.error) {
			inputClass += ' stk-form-textarea-error';
		}

		let controlClass = 'stk-form-control';

		return (
			<div className={controlClass} onClick={this.handleClick}>
				{ this.props.label ? (<label className="stk-form-label">{this.props.label}</label>) : ''}
					{ this.props.icon ? (<Icon icon={this.props.icon} />) : ''}
					<div className={inputClass}>
						{ this.props.error ? (<Tooltip text={this.props.error}><Icon icon={EIcon.ERROR} /></Tooltip>) : ''}
						<textarea
							ref={(e) => this.element = e !== null ? e : undefined}
							spellCheck={false}
							placeholder={this.props.placeholder}
							value={this.state.value}
							onChange={this.handleChange}
							onFocus={this.handleFocus}
							onBlur={this.handleBlur}
							onKeyUp={this.handleKeyUp}
							rows={this.props.rows} 
							disabled={this.props.disabled}
							style={this.props.style} />
					</div>
			</div>
		);
	}
}