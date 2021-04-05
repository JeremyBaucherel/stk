import './progress.css';
import * as React from 'react';

interface IProgressProps {
    value: number;
}

export class Progress extends React.PureComponent<IProgressProps, {}> {
    render () {
        let bar: React.ReactNode= (
            <div className="stk-progress-bar" style={{width: (this.props.value * 100.0).toString() + '%'}} />
        );
        if (this.props.value <= 0.01) {
            bar = null;
        }
        return (
            <div className="stk-progress">
                {bar}
                <div className="stk-progress-background" />
                
            </div>
        )
    }
}