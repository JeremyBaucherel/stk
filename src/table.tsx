import './table.css';
import * as React from 'react';


export interface ITableProps {
    children?: any;
}

export class Table extends React.PureComponent<ITableProps, {}> {
    render () {
        return (
            <div className="stk-table-wrapper">
                <table className="stk-table">{this.props.children}</table>
            </div>
        );
    }
}

export interface ITableHeaderProps {
    children?: any;
}

export class TableHeader extends React.PureComponent<ITableHeaderProps, {}> {
    render () {
        return (<thead><tr className="stk-table-header">{this.props.children}</tr></thead>);
    }
}

export interface ITableColumnProps {
    children?: any;
}

export class TableColumn extends React.PureComponent<ITableColumnProps, {}> {
    render () {
        return (<th className="stk-table-column">{this.props.children}</th>);
    }
}

export interface ITableBodyProps {
    children?: any;
}
export class TableBody extends React.PureComponent<ITableBodyProps, {}> {
    render () {
        return (<tbody className="stk-table-body">{this.props.children}</tbody>);
    }
}

export interface ITableRowProps {
    active?: boolean;
    onClick?: {(): void};
    selected?: boolean;
}

export interface ITableRowState {
    mouseOver: boolean;
}

export class TableRow extends React.Component<ITableRowProps, ITableRowState> {
    constructor (props: ITableRowProps) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);

        this.state = {mouseOver: false};
    }

    handleClick (): void {
        if (this.props.onClick) {
            this.props.onClick();
        }
    }

    handleMouseLeave (): void {
        this.setState({mouseOver: false});
    }

    handleMouseEnter (): void {
        this.setState({mouseOver: true});
    }

    render (): React.ReactNode {
        let className = 'stk-table-row';
        if (this.state.mouseOver === true ) {
            className += ' stk-table-row-hover';
        }
        if (this.props.selected === true || this.props.active === true) {
            className += ' stk-table-row-selected';
        }
        return (
            <tr
                className={className}
                onClick={this.handleClick}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}>
                {this.props.children}
            </tr>);
    }
}

export interface ITableCellProps {
    children?: any;
}

export class TableCell extends React.PureComponent<ITableCellProps, {}> {
    render (): React.ReactNode {
        return (<td className="stk-table-cell">{this.props.children}</td>);
    }
}