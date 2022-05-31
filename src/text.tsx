import './text.css';
import * as React from 'react';

export interface ITProps {
    bold?: boolean;
    strike?: boolean;
    subtle?: boolean;
}

export class T extends React.PureComponent<ITProps, {}> {
    render (): React.ReactNode {
        let className = '';
        let style: {[prop: string]: string} = {};

        if (this.props.subtle) {
            className += ' stk-subtle';
        }

        if (this.props.bold) {
            style['fontWeight'] = 'bold';
        }
        if (this.props.strike) {
            style['textDecoration'] = 'line-through';
        }

        return (
            <span style={style} className={className}>{this.props.children}</span>
        );
    }
}