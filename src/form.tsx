import './form.css';
import * as React from 'react';
import {Button} from './button';
import {Tooltip} from './tooltip';
import {Data, DataCell, DataRow} from './data';
import {EIcon, Icon} from './icon';
import {Popover} from './popover';
import {Menu, MenuItem} from './menu';
import {EPosition, ETrigger} from './popover';
import * as Equals from './equals';

export interface IFormTextareaProps {
	icon?: EIcon;
	label?: string;
	error?: string;
	onChange?: {(newValue: string): void};
	onKeyUp?: {(e: any): void};
	placeholder?: string;
	rows?: number;
	value: string;
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
			value: this.props.value,
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
		let inputClass = 'stk-form-text';

		if (this.props.error) {
			inputClass += ' stk-form-text-error';
		} else if (this.state.hasFocus) {
			inputClass += ' stk-form-text-focus';
		}

		let controlClass = 'stk-form-control';
		if (this.state.hasFocus) {
			controlClass += ' stk-form-control-focus';
		}

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
							rows={this.props.rows} />
					</div>
			</div>
		);
	}
}

export interface IFormCheckBoxProps {
	label: string; // Check box label
	onChange?: {(isChecked: boolean): void}; // Event raised when the check status changes
}

export interface IFormCheckBoxState {
	checked: boolean; // Whether the check box is checked
}

export class FormCheckBox extends React.Component<IFormCheckBoxProps, IFormCheckBoxState> {
	constructor (props: IFormCheckBoxProps) {
		super(props);

		this.state = {
			checked: false
		}

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick (): void {
		let newState = !this.state.checked;
		this.setState({checked: newState});
		if (this.props.onChange) {
			this.props.onChange(newState);
		}
	}

	render (): React.ReactNode {
		return (
			<div className="stk-form-control" style={{flexDirection:'row', alignItems:'center'}}>
				<Button secondary={this.state.checked !== true} primary={this.state.checked}
					onClick={this.handleClick}
					icon={this.state.checked ? EIcon.CHECK : undefined} className="stk-form-checkbox" />
				<span>{this.props.label}</span>
			</div>
		);
	}
}

export class FormValueValidator {
	static validate_positive_int (val: string): boolean {
		return /^[0-9]+$/.test(val);
	}

}

export interface IFormSmartTextProps {
	buttonIcon?: EIcon;
	buttonTooltip?: string;
	error?: string;
	icon?: EIcon;
	label?: string;
	mask?: string;
	onChange?: {(newValue: string): void};
	onKeyUp?: {(e: any): void};
	onButtonClick?: {(): void};
	password?: boolean;
	placeholder?: string;
	value?: string;
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
		}
	}

	componentWillReceiveProps(newProps: IFormSmartTextProps): void {
		this.setState({value: newProps.value});
	}

	handleBlur (): void {
		this.setState({hasFocus: false});
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

	handleKeyUp (e: React.KeyboardEvent<HTMLInputElement>): void {
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
			onKeyUp={this.handleKeyUp} />
		);

		let icon: EIcon | null = null;
		if (this.props.icon) {
			icon = this.props.icon;
		}
		if (this.props.error) {
			icon = EIcon.ERROR;
		}
		let node = (
			<div className={inputClass}>
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


export interface IFormTextSuggestProps {
	error?: string;
	onChange?: {(newValue: string): void};
	onKeyUp?: {(e: any): void};
	placeholder?: string;
	value?: string;
	items: any;
	itemValueKey: string;
}

export interface IFormTextSuggestState {
	hasFocus: boolean;
	query: string;
	inputElement?: HTMLElement;
	menuCursorPosition?: number;
	suggestions: any;
}

export class FormTextSuggest extends React.Component<IFormTextSuggestProps, IFormTextSuggestState> {
	element?: HTMLElement;
	inputElement?: HTMLElement;

	constructor (props: IFormTextSuggestProps) {
		super(props);

		this.state = {
			hasFocus: false,
			query: this.props.value ? this.props.value : '',
			inputElement: undefined,
			menuCursorPosition: undefined,
			suggestions: this.props.items,
		}
		this.element = undefined;
		this.inputElement = undefined;
		this.handleChange = this.handleChange.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
		this.handleClickSuggestion = this.handleClickSuggestion.bind(this);
	}

	componentWillReceiveProps(newProps: IFormTextSuggestProps): void {
		this.setState({query: newProps.value ? newProps.value : ''});
	}

	handleBlur (): void {
		this.setState({hasFocus: false});
	}

	handleChange (e: React.ChangeEvent<HTMLInputElement>): void {
		this.setState({
			query: e.target.value,
			suggestions: this.queryItems(e.target.value),
		});
		if (this.props.onChange) {
			this.props.onChange(e.target.value);
		}
	}

	handleClick (): void {
		if (this.element) {
			this.element.focus();
		}
	}

	handleClickSuggestion (value: string): void {
		this.setState({query: value});
		if (this.props.onChange) {
			this.props.onChange(value);
		}
	}

	handleFocus (): void {
		this.setState({hasFocus: true});
	}

	handleKeyUp (e: React.KeyboardEvent<HTMLInputElement>) {
		let menuCursorPosition = this.state.menuCursorPosition;

		if (e.key === 'ArrowUp') {
			if (menuCursorPosition === undefined) {
				this.setState({menuCursorPosition: 0});
			} else if (menuCursorPosition > 0) {
				this.setState({menuCursorPosition: menuCursorPosition - 1});
			}
		} else if (e.key === 'ArrowDown') {
			if (menuCursorPosition === undefined) {
				this.setState({menuCursorPosition: 0});
			} else {
				this.setState({menuCursorPosition: menuCursorPosition + 1});
			}
		} else if (e.key === 'Enter') {
			if (menuCursorPosition !== undefined) {
				let suggestions = this.queryItems(this.state.query);
				this.handleClickSuggestion(suggestions[menuCursorPosition][this.props.itemValueKey]);
			}
		} else if (e.key == 'Tab') {
			if (this.state.suggestions && this.state.suggestions.length > 0) {
				let newQuery = this.state.suggestions[0][this.props.itemValueKey];
				if (menuCursorPosition && menuCursorPosition < this.state.suggestions.length) {
					newQuery = this.state.suggestions[menuCursorPosition][this.props.itemValueKey];
				}
				this.setState({query: newQuery});
				if (this.props.onChange) {
					this.props.onChange(newQuery);
				}
			}
		}

		if (this.props.onKeyUp) {
			this.props.onKeyUp(e);
		}
	}

	render (): React.ReactNode {
		let inputClass = 'stk-form-text';

		if (this.props.error) {
			inputClass += ' stk-form-text-error';
		} else if (this.state.hasFocus) {
			inputClass += ' stk-form-text-focus';
		}

		let buttonIcon = null;

		let inputElement = (
			<input
				type="text"
				ref={(e) => this.inputElement = e !== null ? e : undefined}
				spellCheck={false}
				placeholder={this.props.placeholder}
				value={this.state.query}
				onChange={this.handleChange}
				onFocus={this.handleFocus}
				onBlur={this.handleBlur}
				onKeyDown={this.handleKeyUp} />
		);

		let control = (
			<div className={inputClass}>
				{ this.props.error ? (<Icon icon={EIcon.ERROR} />) : ''}
				<Popover position={EPosition.BOTTOM_LEFT} trigger={ETrigger.FOCUS}>
					{inputElement}
					{this.renderSuggestions()}
				</Popover>
				{buttonIcon}
			</div>
		);

		if (this.props.error) {
			control = (<Tooltip text={this.props.error}>{control}</Tooltip>);
		}
		return control;
	}

	formatItemForQuery (item: string): string {
		let charMap = [
			['é', 'e'],
			['è', 'e'],
			['ç', 'c']
		];
		let queryItem = item.toLowerCase();
		for (let i = 0; i < charMap.length; ++i) {
			queryItem = queryItem.replace(charMap[i][0], charMap[i][1]);
		}
		return queryItem;
	}

	queryItems (query: string): any[] {
		let results = [];
		if (query) {
			if (this.props.items) {
				query = this.formatItemForQuery(query);

				for (let i = 0; i < this.props.items.length ; ++i) {
					let item = this.props.items[i];
					let itemKey = this.formatItemForQuery(item[this.props.itemValueKey]);
					if (itemKey.indexOf(query) !== -1) {
						results.push(item);
					}
				}
			}
		} else {
			results = this.props.items;
		}
		return results;
	}

	renderSuggestions(): React.ReactNode {
		let suggestions = [];
		let items = this.state.suggestions;

		let cursorPos = this.state.menuCursorPosition;
		if (cursorPos && cursorPos > items.length - 1) {
			cursorPos = items.length - 1;
			this.setState({menuCursorPosition: cursorPos});
		}
		for (let i = 0; i < items.length; ++i) {
			let menuText = items[i][this.props.itemValueKey];
			let menuClick = () => this.handleClickSuggestion(items[i][this.props.itemValueKey]);
			suggestions.push((<MenuItem key={menuText} selected={i == cursorPos} text={menuText} onClick={menuClick} />));
		}

		if (suggestions.length == 0) {
		suggestions = [(<MenuItem key="@@@no-results" text="Pas de résultats" />)];
		}
		return (<Menu style={{maxHeight:'200px'}}>{suggestions}</Menu>);
	}
}


export interface IFormControlProps {
	children?: any;
}

export class FormControl extends React.PureComponent<IFormControlProps, {}> {
	render () {
		return (<div className="stk-form-control">{this.props.children}</div>);
	}
}

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
	value ?: any[]; // A list of IDs for the items selected
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
				items.push((
					<DataRow key={this.props.items[i].id} selectable onClick={() => this.handleItemClick(this.props.items[i].text, this.props.items[i].id)} selected={this.isItemSelected(this.props.items[i].id)}>
						<DataCell>{this.props.items[i].text}</DataCell>
					</DataRow>
				));
			}
		}

		let style = {};
		if (this.props.style) {
			style = this.props.style;
		}
		return (
			<div className="stk-form-control" style={style}>
				{this.props.label ? (<div className="stk-form-label">{this.props.label}</div>) : null}
				<div className="stk-form-listbox"><Data>{items}</Data></div>
			</div>
		);
	}
}