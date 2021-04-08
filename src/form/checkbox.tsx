import './form.css';
import * as React from 'react';
import {Button} from '../button';
import {EIcon} from '../icon';

export interface IFormCheckBoxProps {
	checked?: boolean;
	label?: string; // Check box label
	disabled?: boolean;
	onChange?: {(isChecked: boolean): void}; // Event raised when the check status changes
}

export interface IFormCheckBoxState {
	checked: boolean; // Whether the check box is checked
}

export class FormCheckBox extends React.Component<IFormCheckBoxProps, IFormCheckBoxState> {
	constructor (props: IFormCheckBoxProps) {
		super(props);

        let checked = false;
		if (this.props.checked) {
			checked = this.props.checked;
        }
        
		this.state = {
			checked: checked,
		}

		this.handleClick = this.handleClick.bind(this);
	}
	
	componentWillReceiveProps(newProps: IFormCheckBoxProps): void {
		this.setState({checked: newProps.checked});
    }
	
	handleClick (): void {
		let newState = !this.state.checked;
		this.setState({checked: newState});
		if (this.props.onChange) {
			this.props.onChange(newState);
		}
	}

	render (): React.ReactNode {
		let button;
		if(this.props.disabled)
		{
			button = <Button secondary={this.state.checked !== true} primary={this.state.checked}
						icon={this.state.checked ? EIcon.CHECK : undefined} className="stk-form-checkbox-disabled" />
		}else
		{
			button = <Button secondary={this.state.checked !== true} primary={this.state.checked}
						onClick={this.handleClick}
						icon={this.state.checked ? EIcon.CHECK : undefined} className="stk-form-checkbox" />	
		}

		return (
			<div className="stk-form-control" style={{flexDirection:'row', alignItems:'center'}}>
				{button}
				<span>{this.props.label}</span>
			</div>
		);
	}
}