import * as React from 'react';
import {FormList, FormSmartText} from './form';
import {Popover, ETrigger, EPosition} from './popover';

export interface IFormListItem {
	id: any; // ID could be of any type as long as it's unique
	text: string; // Text to be displayed for the item
}

export interface IMenuFilterProps 
{
    enableMultiSelection?: boolean;
    value ?: any[]; // A list of IDs for the items selected
    onSelectionChange?: {(newSelection :any): void};
    items?: IFormListItem[];
    style?: any;
}

export interface IMenuFilterState 
{
    display: boolean;
}

export class MenuFilter extends React.Component<IMenuFilterProps, IMenuFilterState> 
{
    constructor (props: IMenuFilterProps) 
    {
        super(props);

		this.state = {
			display: false,
        }
        
        this.handleClickFilter.bind(this);

    }

    handleClickFilter(): void
    {
        this.setState({display: !this.state.display});
    }


    render (): React.ReactNode 
    {
        let choix_defaut:string = "";
        let tab_choix_defaut:string[] = [];

        if(this.props.value != undefined)
        {
            for(var i in this.props.value)
            {
                if(this.props.items)
                {
                    tab_choix_defaut.push(this.props.items[this.props.value[i]].text);
                }
            }

            choix_defaut = tab_choix_defaut.toString();
        }

        return  (
            <Popover trigger={ETrigger.CLICK} position={EPosition.BOTTOM_LEFT}>
                <FormSmartText value={choix_defaut} />
                <FormList
                    enableMultiSelection={this.props.enableMultiSelection} 
                    value={this.props.value} 
                    onSelectionChange={this.props.onSelectionChange}
                    items={this.props.items}
                    style={this.props.style}
                />
            </Popover>
        );
        
        if(this.state.display == true)
        {
            return  (
                <Popover trigger={ETrigger.CLICK}>
                    <FormSmartText value={choix_defaut} />
                    <FormList
                        enableMultiSelection={this.props.enableMultiSelection} 
                        value={this.props.value} 
                        onSelectionChange={this.props.onSelectionChange}
                        items={this.props.items}
                        style={this.props.style}
                    />
                </Popover>
            );
        }else
        {
            return  (
                <div className="stk-MenuFilter">
                    <div onClick={() => this.handleClickFilter()}>
                        <FormSmartText disabled={true} value={choix_defaut} ></FormSmartText>
                    </div>
                </div>
            )
        }
    }

}