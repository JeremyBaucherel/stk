import './form.css';
import * as React from 'react';
import {EIcon, Icon} from '../icon';
import {Menu, MenuItem} from '../menu';
import {EPosition, ETrigger, Popover} from '../popover';
import {Tooltip} from '../tooltip';

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

