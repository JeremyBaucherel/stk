import './popover.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';


export enum ETrigger {
	CLICK = 'click',
	FOCUS = 'focus',
	HOVER = 'hover',
	HOVER_TARGET_ONLY = 'hover-target-only',
}

export enum EPosition {
	BOTTOM_CENTER = 'bottom-center',
	BOTTOM_LEFT = 'bottom-left',
	BOTTOM_RIGHT = 'bottom-right',
	RIGHT = 'right',
	LEFT = 'left',
	TOP_RIGHT = 'top-right',
	TOP_LEFT = 'top-left',
	TOP_CENTER = 'top-center'
}

export interface IPopoverChild {

}

export interface IPopoverProps {
	allowReposition?: boolean;
	height?: string;
	popoverClassName?: string;
	position?: EPosition;
	trigger: ETrigger;
	width?: string;
}

export interface IPopoverState {
	isMouseOver: boolean;
}

export interface IPopoverCoords {
	left: number;
	top: number;
}

export class Popover extends React.Component<IPopoverProps, IPopoverState> {
	ignoreEvents: boolean;
	ignoreTargetBlur: boolean;
	ignoreTargetFocus: boolean;
	mouseOnTarget: boolean;
	mouseOnTooltip: boolean;
	position: EPosition;
	tooltipElement: HTMLElement | null;
	targetElement: React.ReactNode | null;
	tooltipMargin: number;

	constructor (props: IPopoverProps) {
		super(props);
		this.state = {isMouseOver: false};
		this.tooltipElement = null;		
		this.targetElement = null;
		
		if (this.props.position) {
			this.position = this.props.position;
		} else {
			this.position = EPosition.BOTTOM_CENTER;
		}

		this.ignoreTargetBlur = false;
		this.ignoreTargetFocus = false;

		this.tooltipMargin = 3;
		this.tooltipElement = null;

		this.mouseOnTarget = false;
		this.mouseOnTooltip = false;

		this.ignoreEvents = false;
		this.handleMouseEnterTarget = this.handleMouseEnterTarget.bind(this);
		this.handleMouseLeaveTarget = this.handleMouseLeaveTarget.bind(this);
		this.handleFocusTarget = this.handleFocusTarget.bind(this);
		this.handleBlurTarget = this.handleBlurTarget.bind(this);
		this.handleClickChild = this.handleClickChild.bind(this);
		this.handleWindowScroll = this.handleWindowScroll.bind(this);
		this.handleClickTooltip = this.handleClickTooltip.bind(this);
		this.handleChangeTarget = this.handleChangeTarget.bind(this);

		if (this.props.trigger == ETrigger.CLICK) {
			document.addEventListener('click', this.handleDocumentClick.bind(this));
		}
	}

	addEvents () {
		let targetElement = this.targetElement;

		if (targetElement) {
			switch (this.props.trigger) {
				case ETrigger.HOVER_TARGET_ONLY:
					targetElement.addEventListener('mouseenter', this.handleMouseEnterTarget);
					targetElement.addEventListener('mouseleave', this.handleMouseLeaveTarget);
					break;
				case ETrigger.HOVER:
					targetElement.addEventListener('mouseenter', this.handleMouseEnterTarget);
					targetElement.addEventListener('mouseleave', this.handleMouseLeaveTarget);
					break;
				case ETrigger.CLICK:
					targetElement.addEventListener('click', this.handleClickChild);
					break;
				case ETrigger.FOCUS:
					targetElement.addEventListener('focus', this.handleFocusTarget);
					targetElement.addEventListener('blur', this.handleBlurTarget);
					targetElement.addEventListener('keydown', this.handleChangeTarget);
					if (this.tooltipElement) {
						this.tooltipElement.addEventListener('mousedown', this.handleClickTooltip);
					}
					break;
			}
		}

		this.addTooltipEvents();		
		window.addEventListener('scroll', this.handleWindowScroll);
	}

	addTooltipEvents () {
		if (this.tooltipElement !== null) {
			//this.tooltipElement.addEventListener('click', this.handleClickTooltip.bind(this));
			switch (this.props.trigger) {
				case ETrigger.HOVER:
					this.tooltipElement.addEventListener('mouseenter', this.handleMouseEnterTooltip.bind(this));
					this.tooltipElement.addEventListener('mouseleave', this.handleMouseLeaveTooltip.bind(this));
					break;
			}
		}
	}
	
	getTarget () {		
		return this.targetElement;
	}

	removeEvents () {
		let targetElement = this.getTarget();

		if (targetElement) {
			if (this.props.trigger == 'hover-target-only') {
				targetElement.removeEventListener('mouseenter', this.handleMouseEnterTarget);
				targetElement.removeEventListener('mouseleave', this.handleMouseLeaveTarget);
			} else if (this.props.trigger == 'hover') {
				targetElement.removeEventListener('mouseenter', this.handleMouseEnterTarget);
				targetElement.removeEventListener('mouseleave', this.handleMouseLeaveTarget);
			} else if (this.props.trigger == 'click') {
				targetElement.removeEventListener('click', this.handleClickChild);
			} else if (this.props.trigger == 'focus') {
				targetElement.removeEventListener('focus', this.handleFocusTarget);
				targetElement.removeEventListener('blur', this.handleFocusTarget);
				targetElement.removeEventListener('keydown', this.handleChangeTarget);
				if (this.tooltipElement) {
					this.tooltipElement.removeEventListener('mousedown', this.handleClickTooltip);
				}
			}
		}

		window.removeEventListener('scroll', this.handleWindowScroll);
	}
	
	componentDidMount (): void {
		this.addEvents();		
	}

	componentDidUpdate (_: IPopoverProps, prevState: IPopoverState): void {
		if (prevState.isMouseOver === false && this.state.isMouseOver === true) {
			this.addTooltipEvents();
			this.show();
		} else if (prevState.isMouseOver === true && this.state.isMouseOver === false) {
			this.tooltipElement = null;
		}

		this.positionPopover(this.position);
	}

	shouldComponentdUpdate (_: IPopoverProps, prevState: IPopoverState): boolean {
		return prevState.isMouseOver !== this.state.isMouseOver;
	}
	
	componentWillUnmount () {
		this.removeEvents();
	}
	
	getTrigger () {
		if (this.props.trigger === undefined) {
			return 'hover';		
		} else {
			return this.props.trigger;
		}
	}

	handleDocumentClick (e: any): void {
		if (this.tooltipElement && this.state.isMouseOver === true) {
			let tooltipRect = this.tooltipElement.getBoundingClientRect();
			let outTooltipX = e.clientX < tooltipRect.left || e.clientX > tooltipRect.left + tooltipRect.width;
			let outTooltipY = e.clientY < tooltipRect.top || e.clientY > tooltipRect.top + tooltipRect.height;
			let outTooltip = outTooltipX || outTooltipY;

			let targetElement = this.getTarget();
			if (targetElement) {
				let targetRect = targetElement.getBoundingClientRect();
				let outTargetX = e.clientX < targetRect.left || e.clientX > targetRect.left + targetRect.width;
				let outTargetY = e.clientY < targetRect.top || e.clientY > targetRect.top + targetRect.height;
				let outTarget = outTargetX || outTargetY;

				if (outTooltip && outTarget) {
					this.setState({isMouseOver: false});
				}
			}
		}
	}

	handleChangeTarget (): void {
		this.mouseOnTarget = true;
		this.setState({isMouseOver: true});
	}

	handleFocusTarget (): void {
		if (this.ignoreTargetFocus === true) {
			this.ignoreTargetFocus = false;
		} else {
			this.mouseOnTarget = true;
			this.setState({isMouseOver: true});
		}
	}

	handleBlurTarget (): void {
		if (this.ignoreTargetBlur === true) {
			this.ignoreTargetBlur = false;
			if (this.targetElement) {
				this.targetElement.focus();
			}
			this.ignoreTargetFocus = true;
		} else {
			window.setTimeout(() => {
				this.mouseOnTarget = false;
				this.setState({isMouseOver: false});
			}, 100);
		}
	}

	handleMouseEnterTarget (): void {
		this.mouseOnTarget = true;
		this.setState({isMouseOver: this.shouldShow()});
	}

	handleMouseEnterTooltip (_: any): void {
		this.mouseOnTooltip = true;
		this.setState({isMouseOver: this.shouldShow()});
	}

	handleMouseLeaveTarget (): void {
		window.setTimeout(() => {
			this.mouseOnTarget = false;
			this.setState({isMouseOver: this.shouldShow()});
		}, 20);
	}

	handleMouseLeaveTooltip (): void {
		this.mouseOnTooltip = false;
		this.setState({isMouseOver: this.shouldShow()});
	}
	
	handleClickChild (): void {
		this.setState({isMouseOver: true});
	}

	handleClickTooltip (): void {
		this.ignoreTargetBlur = true;
	}

	handleWindowScroll (): void {
		this.setState({isMouseOver: false});
	}
	
	initTargetElement (element: React.ReactNode): void {
		this.targetElement = element;
		this.addEvents();
	}

	shouldShow (): boolean {
		if (this.getTrigger() == 'hover') {
			return this.mouseOnTarget || this.mouseOnTooltip;
		} else if (this.getTrigger() == 'hover-target-only') {
			return this.mouseOnTarget;
		} else {
			return true;
		}
	}

	getComplementCoords (position: EPosition, hasEnoughWidth: boolean, hasEnoughHeight: boolean): EPosition {
		switch (position) {
			case EPosition.BOTTOM_LEFT:
				if (hasEnoughHeight && !hasEnoughWidth) {
					return EPosition.BOTTOM_RIGHT;
				} else if (!hasEnoughHeight && hasEnoughWidth) {
					return EPosition.TOP_LEFT;
				}
		}
		return position;
	}

	getCoords (position: EPosition): IPopoverCoords {
		let coords: IPopoverCoords = {
			top: 0,
			left:0,
		};

		let targetElement = this.getTarget();
		let childRect = targetElement.getBoundingClientRect();
		let tooltipRect = this.tooltipElement.getBoundingClientRect();	
		const MARGIN = 3;

		switch (position) {
			case EPosition.BOTTOM_CENTER:
				coords.left = childRect.left + (childRect.width / 2) - (tooltipRect.width/2);
				coords.top = childRect.top + childRect.height + MARGIN;
				break;

			case EPosition.BOTTOM_LEFT:
				coords.left = (childRect.left);
				coords.top = (childRect.top + childRect.height) + MARGIN;
				break;

			case EPosition.BOTTOM_RIGHT:
				coords.left = childRect.left + childRect.width - tooltipRect.width;
				coords.top = childRect.top + childRect.height + MARGIN;
				break;

			case EPosition.LEFT:
				coords.top = (childRect.top + (childRect.height / 2) - (tooltipRect.height / 2));
				coords.left = childRect.left - tooltipRect.width - MARGIN;
				break;

			case EPosition.RIGHT:
				coords.top = (childRect.top + (childRect.height / 2) - (tooltipRect.height / 2));
				coords.left = childRect.left + childRect.width + MARGIN;
				break;

			case EPosition.TOP_LEFT:
				coords.left = childRect.left;
				coords.top = childRect.top - tooltipRect.height - MARGIN;
				break;

			case EPosition.TOP_RIGHT:
				coords.left = childRect.left + childRect.width - tooltipRect.width;
				coords.top = childRect.top - tooltipRect.height - MARGIN;
				break;

			case EPosition.TOP_CENTER:
				coords.left = childRect.left + (childRect.width / 2) - (tooltipRect.width/2);
				coords.top = childRect.top - tooltipRect.height - MARGIN;
				break;

		}
		return coords
	}

	positionPopover (position: EPosition): void {
		if (this.tooltipElement) {
			let finalCoords: IPopoverCoords = this.getCoords(position);

			let tooltipRect = this.tooltipElement.getBoundingClientRect();

			if (this.props.allowReposition === true) {
				let hasEnoughWidth = finalCoords.left + tooltipRect.width < window.innerWidth;
				let hasEnoughHeight = finalCoords.top + tooltipRect.height < window.innerHeight;

				if (!hasEnoughWidth || !hasEnoughHeight) {
					let newPosition = this.getComplementCoords(position, hasEnoughWidth, hasEnoughHeight);
					finalCoords = this.getCoords(newPosition);
				}
			}
			this.tooltipElement.style.top = (finalCoords.top).toString() + 'px';
			this.tooltipElement.style.left = finalCoords.left.toString() + 'px';
		}
	}
	
	show (): void {
		let targetElement = this.getTarget();

		if (targetElement !== null && this.tooltipElement !== null) {
			this.tooltipElement.style.pointerEvents = 'none';
			
			this.positionPopover(this.position);

			if (this.getTrigger() !== ETrigger.HOVER_TARGET_ONLY) {
				window.setTimeout(() => {	
					if (this.tooltipElement !== null) {			
						this.tooltipElement.style.pointerEvents = 'auto';
					}
				}, 100);
			}
		}
	}

	hide (): void {
		this.setState({isMouseOver: false});
	}

	cloneTooltip (comp: React.ReactNode): React.ReactNode {
		if (comp) {
			let props = {};		
			props = {closePopover: this.hide.bind(this)};
			return React.cloneElement(comp, props);
		} else {
			return null;
		}
	}

	render (): React.ReactNode {	
		let tooltip = null;

		if (this.state.isMouseOver) {
			let containerStyle: {[prop: string]: string} = {};
			if (this.props.width) {
				containerStyle['width'] = this.props.width;
			}
			if (this.props.height) {
				containerStyle['height'] = this.props.height;
			}
			let popoverClassName = "stk-popover-container";
			if (this.props.popoverClassName) {
				popoverClassName = this.props.popoverClassName;
			}
			let tooltipComp = (
				<div key="tooltip" className={popoverClassName} style={containerStyle} ref={(e) => this.tooltipElement = e}>
					{this.cloneTooltip(this.props.children[1])}
				</div>
			);
			let modalRoot = document.getElementById('modal-root');
			if (modalRoot) {
				tooltip = ReactDOM.createPortal(tooltipComp, modalRoot);
			} else {
				tooltip = null;
			}
		}
		
		if (this.props.children && this.props.children.length > 1) {
			let targetElement = React.cloneElement(
				this.props.children[0],
				{key: 'target', active: this.props.trigger == 'click' && this.state.isMouseOver ? true : undefined, ref: (e) => {this.initTargetElement(ReactDOM.findDOMNode(e))}}
			);

			return [
				tooltip,
				targetElement
			];
		} else {
			return null;
		}
	}
}