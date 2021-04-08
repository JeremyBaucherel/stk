import './form.css';
import * as React from 'react';

export interface IFormControlProps {
	children?: any;
}

export class FormControl extends React.PureComponent<IFormControlProps, {}> {
	render () {
		return (<div className="stk-form-control">{this.props.children}</div>);
	}
}