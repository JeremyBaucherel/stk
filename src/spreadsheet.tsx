import './spreadsheet.css';
import * as React from 'react';
import {FormSmartText} from './form';
import { any } from 'prop-types';


export class SpreadsheetColumn {
    name: string;
    size: number;
    type_?: string;
    sortable?: boolean;

    constructor (name: string, size: number = 12, type_: string = "text", sortable: boolean = false) {
        this.name = name;
        this.size = size;
        this.type_ = type_;
        this.sortable = sortable;
    }
}


interface ISpreadsheetProps {
    columns: SpreadsheetColumn[];
    rowIndex: string[];
    rows: any[];
    height?: string;
    onClickRow?: any;
    sortable?: boolean;
    filtrable?: boolean;
}

interface ISpreadsheetState {
    sort: string[];
    filter: any;
}

export class Spreadsheet extends React.Component<ISpreadsheetProps, ISpreadsheetState> 
{
    constructor (props: ISpreadsheetProps) 
    {
        super(props);

        this.state = {sort: [], filter: {}};

        this.handleClickRow = this.handleClickRow.bind(this);
        this.handleClickHeaderColumn = this.handleClickHeaderColumn.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
    }

    handleFilter(value: string, columnName: string): void
    {
        let newfilter:any = Array.prototype.slice.call(this.state.filter);
        
        let found = false;

        for(var element in newfilter)
        {
            let filterColumnName = this.state.filter[element];

            if(filterColumnName == columnName)
            {
                newfilter[filterColumnName] = value;
            }
            found = true;
        }

        if (!found){newfilter[columnName] = value;}

        this.setState({filter: newfilter});
    }

    handleClickRow (rowIndex: any[]) 
    {
        if (this.props.onClickRow) {
            this.props.onClickRow(rowIndex);
        }
    }
    render (): React.ReactNode 
    {
        let style = {height:""};
        if (this.props.height) {
            style['height'] = this.props.height;
        }else
        {
            delete style.height;
        }
        
        return  (
            <div className="stk-spreadsheet" style={style}>
                {this.renderHeaders()}
                {this.renderFilters()}
                {this.renderRows()}
            </div>
        )
    }

    renderHeaders (): React.ReactNode 
    {
        let columns = [];
        for (let i = 0; i < this.props.columns.length; ++i) {
            columns.push(this.renderColumn(this.props.columns[i]));
        }
        return (
            <div className="stk-spreadsheet-columns">{columns}</div>
        );
    }

    renderFilters (): React.ReactNode 
    {
        // Si on souhaite filtrer alors on ajoute une ligne de filtre
        if(this.props.filtrable)
        {
            let filters = [];
            for (let i = 0; i < this.props.columns.length; ++i) {
                filters.push(this.renderFiltersContent(this.props.columns[i]));
            }
            return (
                <div className="stk-spreadsheet-columns">{filters}</div>
            );
        }else
        {
            return ("");
        }
    }

    renderFiltersContent (column: SpreadsheetColumn): React.ReactNode 
    {
        let style = {
            flex: '0 0 ' + column.size.toString() + 'em', maxWidth: column.size.toString() + 'em'
        }
        let className = 'stk-spreadsheet-column';
        if (column.name in this.props.rowIndex) {
            className += ' stk-spreadsheet-column-index';
        }
        var valueInput = "";
        if(this.state.filter[column.name] != undefined){valueInput = this.state.filter[column.name];}
        console.log(this.state.filter);
        
        return (
            <div key={column.name} className={className} style={style} onClick={()=>{}}><FormSmartText  onChange={(value)=>this.handleFilter(value, column.name)} value={valueInput} ></FormSmartText></div>
        ); 
    }

    renderRows (): React.ReactNode 
    {
        let newrows = [];
        newrows = Array.prototype.slice.call(this.props.rows);

        // Filtre des colonnes
        if(newrows.length > 0)
        {
            // On parcourt chaque colonne, on regarde si on filtre est demandé
            for(var c in newrows[0]) 
            {
                // Si le filtre existe
                if(this.state.filter[c])
                {
                    // Si le filtre est différent de vide
                    if(this.state.filter[c] != "")
                    {
                        newrows = this.dynamicFilter(newrows, c, this.state.filter[c])
                    }
                }
            }
        }

        // Trie des colonnes
        if(this.state.sort.length>0)
        {
            newrows.sort(this.dynamicSort(this.state.sort));
        }

        let rows = [];

        for (let i = 0; i < newrows.length; ++i) {
            rows.push(this.renderRow(newrows[i]));
        }
        return (
            <div className="stk-spreadsheet-rows">{rows}</div>
        );
    }

    renderColumn (column: SpreadsheetColumn): React.ReactNode 
    {
        let style = {
            flex: '0 0 ' + column.size.toString() + 'em',
        }
        let className = 'stk-spreadsheet-column';
        if (column.name in this.props.rowIndex) {
            className += ' stk-spreadsheet-column-index';
        }
        return (
            <div key={column.name} className={className} style={style} onClick={()=>{if(this.props.sortable){this.handleClickHeaderColumn(column.name);}}}>{column.name}</div>
        );
    }

    handleClickHeaderColumn(columnName: string): void
    {
        let newsort: string[] = [];

        newsort = Array.prototype.slice.call(this.state.sort);

        let found = false;

        for(var element in newsort)
        {
            let sortColumnName = this.state.sort[element];
            let order = 1;
            if (sortColumnName.substr(0,1)== "-") {
                sortColumnName = sortColumnName.substr(1);
                order = -1;
            }

            if(sortColumnName == columnName)
            {
                if (order == 1) {
                    newsort[element] = "-" + sortColumnName;
                } else {
                    newsort[element] = sortColumnName;
                }
                found = true;   
            }             
        }

        if (!found) {
            newsort.push(columnName);
        }

        this.setState({sort: newsort});
    }

    dynamicSort(tabsort: string[]) 
    {
        return function (a: any,b:any) 
        {
            var sortOrder = 1;
            var comp;
            for(var sortkey in tabsort)
            {
                let columnName = tabsort[sortkey];
                if(tabsort[sortkey].substring(0,1) == "-") {
                    sortOrder = -1;
                   columnName = columnName.substr(1);
                }

                if(sortOrder == -1){
                    comp = b[columnName].toString().localeCompare(a[columnName]);
                }else{
                    comp = a[columnName].toString().localeCompare(b[columnName]);
                }   
                if(comp!=0){break;}
            }
            return comp;

        }
    }
    
    dynamicFilter(tableau:any[], columnName:string, value:any): any[] 
    {
        var texte:string;
        var ligneasupprimer:number[] = [];

        for(var ligne in tableau)
        {
            texte = tableau[ligne][columnName];
            
            // IndexOf renvoie le numéro de l'emplacement de la chaine, 0 si premier caractère, -1 si pas trouvé
            if(texte.toString().indexOf(value) < 0)
            {
                ligneasupprimer.push(parseInt(ligne));
            }
        }

        // Suppression des lignes
        var nbsupp:number = 0;
        for(var l in ligneasupprimer)
        {
            tableau.splice(ligneasupprimer[l]-nbsupp,1)
            nbsupp++;
        }
        return tableau;
    }

    renderRow (row: any): React.ReactNode 
    {
        let cells = []
        let index :any[] = [];
        for (let i = 0; i < this.props.rowIndex.length; ++i) {
            index.push(row[this.props.rowIndex[i]]);
        }

        for (let i = 0; i < this.props.columns.length; ++i) {
            let column = this.props.columns[i];
            let style = {flex: '0 0 ' + column.size.toString() + 'em'}

            cells.push((
                <div className="stk-spreadsheet-cell" style={style} onClick={() => {this.handleClickRow(index);}}>{row[column.name]}</div>
            ));
        }
        return (<div className="stk-spreadsheet-row">{cells}</div>);
    }
}