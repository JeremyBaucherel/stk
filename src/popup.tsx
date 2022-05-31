import './popup.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';


export interface IPopupProps {
	hideBlanket?: boolean;
	onBlanketClick: {(e: any): void};
	width?: string;
	minWidth?: string;
	height?: string;
	minHeight?: string;
}

export class Popup extends React.PureComponent<IPopupProps, {}> {

	domEl: HTMLElement | null;

	constructor (props: IPopupProps) {
		super(props);

		this.domEl = null;
		this.handleBlanketClick = this.handleBlanketClick.bind(this);
	}

	componentDidMount (): void {
		this.resize();
	}

	componentDidUpdate (): void {
		this.resize();
	}

	handleBlanketClick (e: React.MouseEvent<HTMLDivElement>): void {
		if (this.domEl) {
			var domElRect = this.domEl.getBoundingClientRect();
			var outElX = e.clientX < domElRect.left || e.clientX > domElRect.left + domElRect.width;
			var outElY = e.clientY < domElRect.top || e.clientY > domElRect.top + domElRect.height;

			if (outElX || outElY){
				this.props.onBlanketClick(e);
			}
		}
	}

	render (): React.ReactNode {
		this.resize();
		var style: {[prop: string]: string} = {};
		if (this.props.minHeight){
			style['min-height'] = this.props.minHeight;
		}
		if (this.props.height){
			style['height'] = this.props.height;
		}
		if (this.props.minWidth){
			style['min-width'] = this.props.minWidth ;
		}
		if (this.props.width){
			style['width'] = this.props.width ;
		}

		let popup = (<div className="stk-popup" style={style} ref={(el) => { this.domEl = el; }}>{this.props.children}</div>);
		if (this.props.hideBlanket !== true) {
			popup = (<div className="stk-popup-blanket" onClick={this.handleBlanketClick}>{popup}</div>);
		};

		let modalRootElement = document.getElementById('modal-root');
		if (modalRootElement !== null) {
			return ReactDOM.createPortal(popup, modalRootElement);
		} else {
			return null;
		}
	}

	resize () {
		if (this.domEl) {
			this.domEl.style.opacity = '1';
		}
	}
}

export class PopupTitle extends React.PureComponent {
	render () {
		return (
			<div className="stk-popup-heading">{this.props.children}</div>
		);
	}
}


export interface IPopupFooterProps {
	children?: any;
}

export class PopupFooter extends React.PureComponent<IPopupFooterProps, {}> {
	render () {
		return (
			<div className="stk-popup-footer">{this.props.children}</div>
		);
	}
}

export interface IPopupBodyProps {
	children?: any;
	noBorders?: boolean;
	style?: any;
}

export class PopupBody extends React.PureComponent<IPopupBodyProps, {}> {
	render () {
		let className = 'stk-popup-body stk-padding-medium';
		if (this.props.noBorders) {
			className += 'stk-popup-body-noborders';
		}

		return (
			<div className={className} style={this.props.style}>{this.props.children}</div>
		);
	}
}

export interface IPopupBodyRowProps {
	children?: any;
	noBorders?: boolean;
}

export class PopupBodyRow extends React.Component<IPopupBodyRowProps, {}> {
	render () {
		let className = 'stk-popup-body stk-popup-body-row';
		if (this.props.noBorders) {
			className += ' stk-popup-body-noborders';
		}

		return (
			<div className={className}>{this.props.children}</div>
		);
	}
}