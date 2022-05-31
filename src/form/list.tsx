import './form.css';
import * as React from 'react';
import * as Equals from '../equals';
import {Data, DataCell, DataRow} from '../data';
import {Tooltip} from '../tooltip';
import {EPosition} from '../popover';


export interface IFormListItem {
	id: any; // ID could be of any type as long as it's unique
	text: string; // Text to be displayed for the item
}

export interface IFormListProps {
	items?: IFormListItem[];
	label?: string;
	enableMultiSelection?: boolean;
	onSelectionChange?: {(newSelection :any): void};
	style?: any;
	value?: any[]; // A list of IDs for the items selected
	error?:string;
	disabled?: boolean;
}

export interface IFormListState {
	selectedIds: any;
}

export class FormList extends React.Component<IFormListProps, IFormListState> {

	constructor (props: IFormListProps) {
		super(props);

		let selectedIds = [];
		if (this.props.value) {
			selectedIds = this.getInitialSelectedIds(props.value);
		}

		this.state = {
			selectedIds: selectedIds,
		}

		this.handleItemClick = this.handleItemClick.bind(this);
		this.handleSelectionChange = this.handleSelectionChange.bind(this);
	}

	componentWillUpdate (newProps: IFormListProps): void {
		if (!Equals.equals(newProps.value, this.props.value)) {
			this.setState({selectedIds: this.getInitialSelectedIds(newProps.value)});
		}
	}

	getInitialSelectedIds (initialSelectedIds?: any[]): any[] {
		if (this.props.enableMultiSelection !== true) {
			if (initialSelectedIds) {
				return [initialSelectedIds[0]];
			} else {
				return [];
			}
		} else {
			if (initialSelectedIds) {
				return initialSelectedIds;
			} else {
				return [];
			}
		}
	}

	handleItemClick (_: string, id: any): void {

		if (this.isItemSelected(id)) {
			this.removeSelectedItem(id);
		} else {
			this.addSelectedItems(id);
		}
	}

	handleSelectionChange (newSelection: any[]): void {
		if (this.props.onSelectionChange) {
			this.props.onSelectionChange(newSelection);
		}
	}

	isItemSelected (id: any): boolean {
		for (let i = 0; i < this.state.selectedIds.length; ++i) {
			if (Equals.equals(this.state.selectedIds[i], id)) {
				return true;
			}
		}
		return false
	}

	addSelectedItems (id: any): void {
		if (!this.isItemSelected(id)){
			let selection = [];
			if (this.props.enableMultiSelection === true) {
				selection = this.state.selectedIds.slice(0);
			}
			selection.push(id);

			this.setState({selectedIds: selection});
			this.handleSelectionChange(selection);
		}
	}

	removeSelectedItem (id: any): void {
		for (let i = 0; i < this.state.selectedIds.length; ++i) {
			if (Equals.equals(this.state.selectedIds[i], id)) {
				let selection = this.state.selectedIds.slice(0);
				selection.splice(i, 1);
				this.setState({selectedIds: selection});
				this.handleSelectionChange(selection);
				break;
			}
		}
	}

	render (): React.ReactNode {
		let items = [];

		if (this.props.items) {
			for (let i = 0 ; i < this.props.items.length; ++i) {
				if(this.props.disabled){			
					items.push((
					<DataRow key={this.props.items[i].id} selected={this.isItemSelected(this.props.items[i].id)}>
						<DataCell>{this.props.items[i].text}</DataCell>
					</DataRow>
					));
				}else{
					items.push((
					<DataRow key={this.props.items[i].id} selectable onClick={() => this.handleItemClick(this.props.items[i].text, this.props.items[i].id)} selected={this.isItemSelected(this.props.items[i].id)}>
						<DataCell>{this.props.items[i].text}</DataCell>
					</DataRow>
					));
				}
			}
		}

		let style = {};
		if (this.props.style) {
			style = this.props.style;
		}

		let className = (this.props.error)?"stk-form-listbox stk-error":"stk-form-listbox";

		let node = (
			<div className="stk-form-control" style={style}>
				{this.props.label ? (<div className="stk-form-label">{this.props.label}</div>) : null}
				<div className={className}><Data>{items}</Data></div>
			</div>
		);

		if (this.props.error) {
			node = (
				<Tooltip text={this.props.error} position={EPosition.BOTTOM_LEFT}>{node}</Tooltip>
				);
		}
		return node;
	}
}

