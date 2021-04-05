import './tab.css';
import * as React from 'react';

export interface IVTabsProps {
    children?: any;
    onChange: {(tabId: string, tabTitle: string): void};
}

export interface IVTabsState {
    selectedTabId?: string;
}

export class VTabs extends React.Component<IVTabsProps, IVTabsState> {
    
    tabs?: React.Component[];

    constructor (props: IVTabsProps) {
        super(props);

        this.state = {
            selectedTabId: (props.children && props.children.length > 0) ? props.children[0].props.id : null
        };

        this.tabs = this.props.children;
        this.handleTabClick = this.handleTabClick.bind(this);
    }

    componentWillReceiveNewProps (newProps: IVTabsProps) {
        this.setState({
            selectedTabId: newProps.children[0].props.id,
        })
    }

    handleTabClick (tabId: string): void {
        this.setState({selectedTabId: tabId});
        if (this.props.onChange) {
            let tabTitle = '';
            for (let i = 0; i < this.props.children.length; ++i) {
                if (this.props.children[i].props.id == tabId) {
                    tabTitle = this.props.children[i].props.title;
                }
            }
            this.props.onChange(tabId, tabTitle);
        }
    }

    render () {
        let currentTab = null;
        for (let i = 0; i < this.props.children.length; ++i) {
            if (this.props.children[i].props.id == this.state.selectedTabId) {
                currentTab = this.props.children[i];
            }
        }
        return (
            <div className="stk-vtabs">
                <div className="stk-vtabs-list">{this.renderToc()}</div>
                <div className="stk-vtabs-panel">{currentTab}</div>
            </div>
        );
    }

    renderToc (): React.ReactNode[] {
        let tabs = [];
        for (let i = 0; i < this.props.children.length; ++i) {
            let tab = this.props.children[i];
            let className='stk-vtabs-list-item';
            if (tab.props.id == this.state.selectedTabId) {
                className += ' stk-vtabs-list-item-selected';
            }
            tabs.push((
                <div key={tab.props.id} className={className} onClick={() => this.handleTabClick(tab.props.id)}>{tab.props.title}</div>
            ));
        }
        return tabs;
    }
}

export interface IVTabProps {
    children?: any;
    id: string;
    title: string;
}

export class VTab extends React.PureComponent<IVTabProps, {}> {
    render () {
        return (<div key={this.props.id}>{this.props.children}</div>);
    }
}
