import './spinner.css';
import * as React from 'react';


export interface ISpinnerProps {
	delay?: number;
}

export interface ISpinnerState {
	shown: boolean;
}

export class Spinner extends React.Component<ISpinnerProps, ISpinnerState> {
	timeoutId: NodeJS.Timer | null;

	constructor (props: ISpinnerProps) {
		super(props);
		this.state = {
			shown: false,
		};

		this.timeoutId = null;
	}

	activateSpinner (): void {
		this.setState({shown: true});
	}

	componentDidMount (): void {
		var delay = this.props.delay;
		if (delay == null){
			delay = 500;
		}
		if (delay == 0){
			this.activateSpinner();
		} else {
			this.timeoutId = setTimeout(this.activateSpinner.bind(this), delay);
		}
	}

	componentWillUnmount (): void {
		if (this.timeoutId != null) {
			clearTimeout(this.timeoutId);
		}
	}

	render (): React.ReactNode {
		let width = 70;
		let path = this.getPath(width);
		let pathElement = null;
		if (this.state.shown) {
			pathElement = [
				(<path key="track"
					className="stk-spinner-track"
					d={path}>
				</path>),
				(<path key="slug"
					className="stk-spinner-slug"
					d={path}
					pathLength="280"
					strokeDasharray="280 280"
					strokeDashoffset="210" >
				</path>)
			];
		}
		
		return (
			<svg className="stk-spinner" height={width} width={width} viewBox={this.getViewBox(width)}>
				{pathElement}
			</svg>
		)
	}

	getPath (width: number): string {
		// M 50,50 m 0,-44.5 a 44.5,44.5 0 1 1 0,89 a 44.5,44.5 0 1 1 0,-89
		let margin = 6;

		let path = 'M ' + width.toString() + ',' + width.toString();
		path += ' m 0,-' + (width - margin).toString();
		path += ' a ' + (width - margin).toString() + ',' + (width - margin).toString() + ' 0 1 1 0,' + (width * 2 - margin * 2);
		path += ' a ' + (width - margin).toString() + ',' + (width - margin).toString() + ' 0 1 1 0,-' + (width * 2 - margin * 2);
		return path;
	}

	getViewBox (width: number): string {
		return "0 0 " + (width * 2).toString() + ' ' + (width * 2).toString();
	}
}


export interface ISpinnerInlineProps {
	delay?: Number;
}

export interface ISpinnerInlineState {
	contents?: any;
}

export class SpinnerInline extends React.Component<ISpinnerInlineProps, ISpinnerInlineState> {

	elDom: HTMLSpanElement | null;

	constructor (props: ISpinnerInlineProps) {
		super(props)
		this.state = {
			contents: null,
		}
		this.elDom = null;
		this.activateSpinner = this.activateSpinner.bind(this);
	}
	
	activateSpinner (): void {
		if (this.elDom != null) {
			this.elDom.className = 'stk-spinner-inline';			
			this.setState({contents: (<span><span>.</span><span>.</span><span>.</span></span>)});
		}
	}
	
	componentDidMount (): void {
		var delay = this.props.delay;
		if (delay == null){
			delay = 0;
		}
		if (delay == 0){
			this.activateSpinner();
		} else {
			window.setInterval(this.activateSpinner, delay);
		}
	}
	
	render () {
		return (<span><span ref={(el) => this.elDom=el}>{this.state.contents}</span></span>);
	}
}