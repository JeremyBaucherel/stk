import './flex.css';
import * as React from 'react';
import * as Common from './common';

export interface IHFlexProps {
    padding?: Common.Padding;
    children: any;
}

export class HFlex extends React.PureComponent<IHFlexProps, {}> {
    render () {
        let className = 'stk-hflex';
        className += ' ' + Common.getPaddingClass(this.props.padding, Common.Padding.None);
 
        return (
            <div className={className}>{this.props.children}</div>
        );
    }
}

export interface IVFlexProps {
    padding?: Common.Padding;
    children: any;
}

export class VFlex extends React.PureComponent<IVFlexProps, {}> {
    render () {
        let className = 'stk-vflex';
        className += ' ' + Common.getPaddingClass(this.props.padding, Common.Padding.None);

        return (
            <div className={className}>{this.props.children}</div>
        );
    }
}