import './form.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Button} from '../button';
import {FormControl} from './control';
import {EIcon, Icon} from '../icon';
import {Tooltip} from '../tooltip';
import {EPosition, ETrigger, Popover} from '../popover';
import {DayPickerPopup} from '../date';
import {T} from '../text';


export interface IFormDateProps {
	buttonIcon?: EIcon;
    buttonTooltip?: string;
    disabled?: boolean;
	error?: string;
	icon?: EIcon;
	label?: string;
	onChange?: {(newValue: Date): void};
	onKeyUp?: {(e: any): void};
	onButtonClick?: {(): void};
	value?: Date;
}

export interface IFormDateState {
    buttonElement?: HTMLElement;
	hasFocus: boolean;
    day: number | null;
    month: number | null;
    year: number | null;
    popupShown: boolean;
}

export class FormDate extends React.Component<IFormDateProps, IFormDateState> {
    elementDay: HTMLElement | null;
    elementMonth: HTMLElement | null;
    elementYear: HTMLElement | null;
    elementButton: HTMLElement | null;
	menuCursorPosition: Number;

	constructor (props: IFormDateProps) {
		super(props);

        let day = null;
        let month = null;
        let year = null;

        if (this.props.value) {
            day = this.props.value.getDate();
            month = this.props.value.getMonth() + 1;
            year = this.props.value.getFullYear();
        }

		this.state = {
			hasFocus: false,
            day: day,
            month: month,
            year: year,
            popupShown: false,
            buttonElement: undefined,
		};

		this.menuCursorPosition = 0;
        this.handleChangeDay = this.handleChangeDay.bind(this);
        this.handleChangeMonth = this.handleChangeMonth.bind(this);
        this.handleChangeYear = this.handleChangeYear.bind(this);
        this.handleSelectDay = this.handleSelectDay.bind(this);
        
		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
        this.elementDay = null;
        this.elementMonth = null;
        this.elementYear = null;
        this.elementButton = null;
	}

	componentWillReceiveProps(newProps: IFormDateProps): void {
        if (newProps.value) {
            let day = newProps.value.getDate();
            let month = newProps.value.getMonth() + 1;
            let year = newProps.value.getFullYear();
            this.setState({
                day: day,
                month: month,
                year: year,
            });
        }
	}

    getValueAsDate (year: number | null, month: number | null, day: number | null): Date {
        let valueAsDate = new Date;
        if (year !== null && month !== null && day !== null) {
            valueAsDate = new Date(year, month - 1, day);
        }
        return valueAsDate;
    }

    getButtonElement (): HTMLElement | undefined {
        return this.state.buttonElement;
    }

    hasNoEmptyDateItem (year: number | null, month: number | null, day: number | null): boolean {
        return (
            year != null && year != '' && year != undefined
            && month != null && month != '' && month != undefined
            && day != null && day != '' && day != undefined
        );
    }

	handleBlur (): void {
		this.setState({hasFocus: false});
	}

	handleChangeDay (e: React.ChangeEvent<HTMLInputElement>): void {
        let newDay = null;
        if (e.target.value !== '' && e.target.value !== null && e.target.value !== undefined) {
            newDay = e.target.value;
        }

        this.setState({day: newDay});
        this.raiseChange(this.state.year, this.state.month, newDay);  
    }
    
    
    handleChangeMonth (e: React.ChangeEvent<HTMLInputElement>): void {
        let newMonth = null;
        if (e.target.value !== '' && e.target.value !== null && e.target.value !== undefined) {
            newMonth = e.target.value;  
        }

        this.setState({month: newMonth}); 
        this.raiseChange(this.state.year, newMonth, this.state.day);
    }

    handleChangeYear (e: React.ChangeEvent<HTMLInputElement>): void {
        let newYear = null;
        if (e.target.value !== '' && e.target.value !== null && e.target.value !== undefined) {
            newYear = e.target.value;

            if (newYear < 1000) {
                newYear = null;
            }
        }
        this.setState({year: newYear}); 
        this.raiseChange(newYear, this.state.month, this.state.day);
    }

    raiseChange(year: number | null, month: number | null, day: number | null): void {        
        if (this.props.onChange) {
            if (this.hasNoEmptyDateItem(year, month, day)) {
                let newDate = this.getValueAsDate(year, month, day);
                this.props.onChange(newDate);
            } else {
                this.props.onChange(null);
            }
        }
    }


    handleClearAll (): void {
        
        this.raiseChange(null, null, null);
        this.setState({
            year: null,
            month: null,
            day: null
        });
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

    handleSelectDay(newDate: Date): void {
        let day = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();

        this.setState({
            day: day,
            month: month,
            year: year
        });

        this.raiseChange(year, month, day);
    }

	render (): React.ReactNode {
		let inputClass = 'stk-form-text stk-form-date';

		if (this.props.error) {
			inputClass += ' stk-error';
		} else if (this.state.hasFocus) {
			inputClass += ' stk-form-text-focus';
		}

        let buttonIcon = (<Button stealth icon={EIcon.ARROW_DROP_DOWN} />);

		let icon: EIcon | null = null;
		if (this.props.icon) {
			icon = this.props.icon;
		}
		if (this.props.error) {
			icon = EIcon.ERROR;
        }
        
        let button = null;
        if (this.props.disabled === undefined || this.props.disabled === false) {
            button = (
                <Popover trigger={ETrigger.CLICK} position={EPosition.BOTTOM_RIGHT} width="300px" allowReposition={true} >
                    {buttonIcon}                    
                    <DayPickerPopup selectedDay={this.getValueAsDate(this.state.year, this.state.month, this.state.day)} onSelectDay={this.handleSelectDay}/>
                </Popover>
            );
        }
		let node = (            
            <div className={inputClass}>
                { icon ? (<Icon icon={icon} />) : ''}
                {this.renderDay()}
                <T subtle>/</T>
                {this.renderMonth()}
                <T subtle>/</T>
                {this.renderYear()}
                {button}
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
    
    renderDay(): React.ReactNode {
        return (
            <input
                    ref={(e) => this.elementDay = e}
                    type="number"
                    spellCheck={false}
                    placeholder="__"
                    value={this.state.day != null ? this.state.day : undefined}
                    onChange={this.handleChangeDay}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    onKeyUp={this.handleKeyUp}
                    maxLength={2}
                    disabled={this.props.disabled} 
                     />
        );
    }

    renderMonth(): React.ReactNode {
        return (
            <input
                    ref={(e) => this.elementMonth = e}
                    type="number"
                    spellCheck={false}
                    placeholder="__"
                    value={this.state.month != null ? this.state.month : undefined}
                    onChange={this.handleChangeMonth}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    onKeyUp={this.handleKeyUp}
                    maxLength={2} 
                    min={1}
                    max={12}
                    step={1}
                    disabled={this.props.disabled}
                    />
        );
    }

    renderYear(): React.ReactNode {
        return (
            <input
                    ref={(e) => this.elementYear = e}
                    type="number"
                    spellCheck={false}
                    placeholder="____"
                    value={this.state.year != null ? this.state.year : undefined}
                    onChange={this.handleChangeYear}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    onKeyUp={this.handleKeyUp}
                    maxLength={4}
                    disabled={this.props.disabled} 
                     />
        );
    }
}