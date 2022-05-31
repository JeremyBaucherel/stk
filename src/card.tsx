import './card.css';
import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import * as Common from './common';
import { EIcon, Icon } from './icon';

export interface ICardDeckProps {
    children?: any;
}

export class CardDeck extends React.PureComponent<ICardDeckProps, {}> {
    render (): React.ReactNode {
        return (
            <div className="stk-card-deck">{this.props.children}</div>
        );
    }
}

export interface ICardProps {
    loading?: boolean;
    placeHolder?: boolean;
    title?: string;
    raisable?: boolean;
    width?: string;
    height?: string;
    flex?: string;
    to?: string;
}

export class Card extends React.PureComponent<ICardProps, {}> {
    render (): React.ReactNode {
        let style: {[props: string]: string} = {};
        
        if (this.props.width) {
            style['width'] = this.props.width;
        }
        if (this.props.height) {
            style['height'] = this.props.height;
        }

        if (this.props.flex) {
            style['flex'] = this.props.flex + ' ' + this.props.flex;
        }

        let title = null;
        if (this.props.title && this.props.to) {
            title = (<CardTitle><ReactRouterDOM.Link to={this.props.to}><strong>{this.props.title}</strong></ReactRouterDOM.Link></CardTitle>);
        }

        let cardClassName = 'stk-card';
        if (this.props.raisable === true) {
            cardClassName += ' stk-card-raisable';
        }

        if (this.props.loading === true) {
            cardClassName += ' stk-loading';
        }
        
        if (this.props.placeHolder === true) {
            return (<div className="stk-card-shell" style={style} />);
        } else {
            return (
                <div className="stk-card-shell" style={style}>
                    <div className={cardClassName}>
                        {title}
                        {this.props.children}
                    </div>
                </div>
            );
        }
    }
}

export interface ICardTitleProps {
    children?: any;
}
export class CardTitle extends React.PureComponent<ICardTitleProps, {}> {
    render (): React.ReactNode {
        return (<div className="stk-card-title">{this.props.children}</div>);
    }
}

export interface ICardBodyProps {
    children?: any;
    padding?: Common.Padding;
    style?: any;
}

export class CardBody extends React.PureComponent<ICardBodyProps, {}> {
    render (): React.ReactNode {
        let className = 'stk-card-body';
        if (this.props.padding) {
            className += ' ' + Common.getPaddingClass(this.props.padding);
        }
        return (<div className={className} style={this.props.style}>{this.props.children}</div>);
    }
}

export interface ICardBodyImageProps {
    image: string;
    to?: string;
}

export class CardBodyImage extends React.PureComponent<ICardBodyImageProps, {}> {
    render (): React.ReactNode {
        let style = {
            backgroundImage: 'url(' + this.props.image + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
        };

        if (this.props.to) {
            return (<ReactRouterDOM.Link to={this.props.to} className="stk-card-body" style={style} />);
        } else {
            return (<div className="stk-card-body" style={style} />);
        }
    }
}

export interface ICardFooterProps {
    children?: any;
    style?: any;
}
export class CardFooter extends React.Component<ICardFooterProps, {}> {
    render (): React.ReactNode {
        return (<div className="stk-card-footer" style={this.props.style}>{this.props.children}</div>);
    }
}