import './page.css';
import * as React from 'react';
import {Icon, EIcon} from './icon';
import {Spinner} from './spinner';


export interface IRowProps {
	children?: any;
	vcenter?: boolean;
	fullHeight?: boolean;
}

export class Row extends React.PureComponent<IRowProps, {}> {
	render (): React.ReactNode {
		let className = 'stk-row';
		if (this.props.vcenter === true) {
			className += ' stk-row-vcenter';
		}
		if (this.props.fullHeight === true) {
			className += ' stk-row-full-height';
		}
		return (<div className={className}>{this.props.children}</div>);
	}
}

interface IColProps {
	children?: any;
	size?: Number;
	style?: any;
}

export class Col extends React.PureComponent<IColProps, {}> {

	render (): React.ReactNode {
		let className = 'stk-col stk-col-12';
		if (this.props.size) {
			className = 'stk-col stk-col-' + this.props.size;
		}
		
		let style = null;
		if (this.props.style) {
			style = this.props.style;
		}
		return (<div className={className} style={style}>{this.props.children}</div>);
	};
}

interface IPageBodyProps {
	children?: any;
	fullWidth?: boolean;
}

export class PageBody extends React.PureComponent<IPageBodyProps, {}> {

	render (): React.ReactNode {
		let className = 'stk-page-body';
		if (this.props.fullWidth === true){
			className += ' stk-page-body-fullwidth';
		} else {
			className += ' stk-page-body';
		}
		return (<div className={className}>{this.props.children}</div>);
	}
}

export class PageBodyLoading extends React.PureComponent<{}, {}> {
	render () {
		return (<div style={{fontSize:'4em', textAlign:'center', display:'flex', alignItems:'center'}}><Spinner /></div>);
	}
}


export class PageBodyError extends React.Component {
	render (): React.ReactNode {
		return (
			<div style={{fontSize:'2em', textAlign:'center'}} className="stk-subtle">
				<Icon icon={EIcon.ERROR} /> Une erreur inattendue s'est produite.
			</div>
		);
	}
}

interface IPageProps {
	children?: any;
	title?: string;
}

export class Page extends React.PureComponent<IPageProps, {}> {

	render (): React.ReactNode {
		if (this.props.title){
			document.title = this.props.title + ' - Symphonie';
		} else {
			document.title = 'Symphonie'; 
		}
	
		return (<div className="stk-page">{this.props.children}</div>);
	}
}