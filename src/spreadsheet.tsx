import './spreadsheet.css';
import * as React from 'react';
import {FormSmartText} from './form';
import {MenuFilter} from './menufilter';
import {Button} from './button';

export class SpreadsheetColumn 
{
    name: string;
    size: number;
    type_?: string;
    sortable?: boolean;
    filtrable?: boolean;

    sortable_defaut?:any;
    filter_default?: any;
    MultiSelection?: boolean;

    buttons: React.ReactNode | null;

    constructor (name: string, size: number = 12, type_: string = "text", sortable: boolean = false, filtrable: boolean = false, sortable_defaut: any = "", filter_default: any = "", MultiSelection: boolean = false) 
    {
        this.name = name;
        this.size = size;
        this.type_ = type_;
        this.sortable = sortable;
        this.filtrable = filtrable;
        this.sortable_defaut = sortable_defaut;
        this.filter_default = filter_default;
        this.MultiSelection = MultiSelection;
    }
}

interface ISpreadsheetProps {
    columns: SpreadsheetColumn[];
    rowIndex: string[];
    rows: any[];
    height?: string;
    onClickRow?: any;
    filter_default?: any;
    selectedRow?:any;
    infoSupp?:boolean;
}

interface ISpreadsheetState {
    sort: string[];
    filter: any;
}

export class Spreadsheet extends React.Component<ISpreadsheetProps, ISpreadsheetState> 
{
    wrapperElement: HTMLElement | null;


    constructor (props: ISpreadsheetProps) 
    {
        super(props);

        let filter_default = this.props.filter_default;
        
        if(filter_default==undefined){filter_default="";}

        this.state = {sort: [], filter: filter_default};

        this.handleClickRow = this.handleClickRow.bind(this);
        this.handleClickHeaderColumn = this.handleClickHeaderColumn.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.dynamicSort = this.dynamicSort.bind(this);
        this.dynamicFilter = this.dynamicFilter.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.wrapperElement = null;

        this.recherche_children = this.recherche_children.bind(this);
    }

    setWrapperElement (el: HTMLElement | null) {
        if (el !== null) {
            el.addEventListener('scroll', this.handleScroll);
            this.wrapperElement = el;
        }
    }

    unsetWrapperElement () {
        if (this.wrapperElement !== null) {
            this.wrapperElement.removeEventListener('scroll', this.handleScroll);
        }
    }
    
    componentWillUnmount () {
        this.unsetWrapperElement();
    }

    componentWillReceiveProps(nextProps: ISpreadsheetProps): void {
		// On relance la requête seulement lorsque la propriété qui est ici le numéro de l'équipement change.
		if (this.props.filter_default != nextProps.filter_default) {
			this.setState({filter: nextProps.filter_default});
		}
    }

    handleCopyTable(): void {
        let rows = this.filterRows();
		let text_copy;
		text_copy = ""

		// En-tête
		for(let indexCol = 0; indexCol < this.props.columns.length; ++indexCol) {
			text_copy += this.props.columns[indexCol].name+"\t";
		}
		text_copy += "\n";

		// Contenu
		for (var indexLine in rows) {
            let cells = rows[indexLine].props.children;

			for (let indexCol = 0; indexCol < this.props.columns.length; ++indexCol) {
                let cell = cells[indexCol];
                console.log(cell)
                let cellValue = this.recherche_children(cell);
                console.log(cellValue)
				if (cellValue !== undefined && cellValue !== null) {
					text_copy += cellValue + "\t";
				} else {
					text_copy += "\t";
				}
			}
			text_copy += "\n";
		}	

        // Works only on localhost or HTTPS
		navigator.clipboard.writeText(text_copy)
    }

    handleScroll(): void {
        if (this.wrapperElement !== null) {
            let translate = "translate(0,"+ (this.wrapperElement.scrollTop)+"px)";
            const allTh = this.wrapperElement.querySelectorAll("th");
            for( let i=0; i < allTh.length; i++ ) {
                allTh[i].style.transform = translate;
            }

            const allFilters = this.wrapperElement.querySelectorAll(".stk-spreadsheet-filters > td");
            for( let i=0; i < allFilters.length; i++ ) {
                allFilters[i].style.transform = translate;
            }
        }
    }

    handleFilter(value: string, columnName: string): void
    {
        let newfilter:any = this.state.filter;
        let filterColumnName:string;
        let found = false;

        for(var element in newfilter)
        {
            filterColumnName = this.state.filter[element];
            
            if(filterColumnName == columnName)
            {
                newfilter[filterColumnName] = value;
                found = true;
            }
        }
        if (!found){newfilter[columnName] = value;}
        this.setState({filter: newfilter});
    }

    /*
     value => un ou plusieurs item sélectionné
     columnName => nom de la colonne ou l'on filtre
     tableau_item => Liste des items du menu déroulant
    */
    handleFilterMenu(value: string, columnName: string, tableau_item:any): void
    {
        let newfilter:any = this.state.filter;
        
        var liste_val: string[] = [];

        if(Array.isArray(value))
        {
            liste_val = value;
        }else
        {
            liste_val.push(value);
        }
 
        delete newfilter[columnName]

        for(var lval in liste_val)
        {
            if(tableau_item[liste_val[lval]] != undefined)
            { 
                var newvalue:string = tableau_item[liste_val[lval]].text

                if (newfilter[columnName] == undefined)
                {
                    newfilter[columnName]=[newvalue];
                }else
                {
                    newfilter[columnName].push(newvalue);
                }
            }
        }
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

        let rows = this.filterRows();

        return  (
            <div className="stk-spreadsheet" style={style}>
                <div ref={(e) => this.setWrapperElement(e)}>
                    <table>
                        {this.renderHeaders()}                    
                        {this.renderRows(rows)}
                    </table>
                </div>
                {this.renderFooter(rows)}               
            </div>
        );
    }

    renderFooter (rows: any[]): React.ReactNode {
        if (this.props.infoSupp === true) {
            return (
                <div className="stk-spreadsheet-footer">
                    <span>Nombre de lignes : {rows.length}</span>
                    <Button secondary tooltip="Copier le tableau dans le presse-papier" onClick={this.handleCopyTable.bind(this)}><strong>Copier</strong></Button>
                </div>
            );
        }
        return null;
    }

    renderHeaders (): React.ReactNode 
    {
        let columns = [];
        for (let i = 0; i < this.props.columns.length; ++i) {
            columns.push(this.renderColumn(this.props.columns[i]));
        }
        return (
            <thead className="stk-spreadsheet-columns"><tr>{columns}</tr></thead>
        );
    }

    renderFilters (): React.ReactNode {
        var filtrable = false;

        // Si on souhaite filtrer alors on ajoute une ligne de filtre
        for (let i = 0; i < this.props.columns.length; ++i)
        {
            if(this.props.columns[i].filtrable == true){
                filtrable = true;
            }
        }
        
        if(filtrable)
        {
            let filters = [];
            for (let i = 0; i < this.props.columns.length; ++i) {
                filters.push(this.renderFiltersContent(this.props.columns[i]));
            }
            return (
               <tr className="stk-spreadsheet-filters">{filters}</tr>
            );
        }else
        {
            return null;
        }
    }

    renderFiltersContent (column: SpreadsheetColumn): React.ReactNode {       
        let className = undefined;

        if (column.name in this.props.rowIndex) {
            className = 'stk-spreadsheet-column-index';
        }else
        {
            className = 'stk-spreadsheet-columns-filters';
        }

        if(column.type_ == "text")
        {
            var valueInput = "";
            if(this.state.filter[column.name] != undefined) {
                valueInput = this.state.filter[column.name];
            }
            
            return (
                <td key={column.name} className={className}>
                    <FormSmartText  onChange={(value)=>this.handleFilter(value, column.name)} value={valueInput} />
                </td>
            ); 
        } else if(column.type_ == "menu") {
            var tableau_item:any = {};
            tableau_item = this.tableau_item_filter(column.name);

            let value_select:any = [];

            // Si on a des filtres
            if(this.state.filter[column.name] != undefined) {
                // Parcours les Items de la liste
                for(var i in tableau_item) {
                    // Parcours les filtres sélectionnées
                    for(var j in this.state.filter[column.name]) {
                        if(tableau_item[i]["text"].toLowerCase() == this.state.filter[column.name][j].toLowerCase()) {
                            value_select.push(tableau_item[i]["id"]);
                        }
                    }
                }
            }
            
            return (
                <td key={column.name} className={className}>
                    <MenuFilter
                        enableMultiSelection={column.MultiSelection} 
                        value={value_select} 
                        onSelectionChange={(value)=>this.handleFilterMenu(value, column.name, tableau_item)}
                        items={tableau_item}
                        style={{height:'200px', width:'200px', padding:'5px'}}
                    />
                </td>
            ); 
        }
        else
        {

            return (
                <td key={column.name} className={className} />
            ); 
        }
    }

    tableau_item_filter (colonne:string): any
    {
        var tableau_item_filter:any[] = [];
        // Formalisme de la sorte: tableau_item_filter = [{id:0, text:"False"}, {id:1, text:"True"}];
        
        var inc:number = 0;

        // Parcours les lignes du tableau
        for (var ligne in this.props.rows)
        {
            // Parcours les colonnes du tableau
            for (var col in this.props.rows[ligne])
            {
                if (col == colonne)
                {
                    let value = "";
                    if (this.props.rows[ligne][col] != undefined) {
                        value = this.props.rows[ligne][col];
                    }

                    var add = true;
                    if (tableau_item_filter.length > 0) {
                        for (var ligne_t in tableau_item_filter) {
                            if(tableau_item_filter[ligne_t]["text"] == value) {
                                add = false;
                            }
                        }
                    }
                    if (add) {
                        tableau_item_filter.push({id:inc, text:value})
                        inc++;
                    }
                }
            }
        }

        return tableau_item_filter;
    }

    filterRows (): any[] {
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
                    newrows = this.dynamicFilter(newrows, c, this.state.filter[c])
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

        return rows;
    }

    renderRows (rows: any[]): React.ReactNode 
    {     
        let infoSupp = this.props.infoSupp;
        if(infoSupp==undefined){infoSupp=false;}

        if(infoSupp)
        {
            return (
            <tbody>
                {this.renderFilters()}
                {rows}           
            </tbody>
            );
        }else
        {
            return (
                <tbody>
                    {this.renderFilters()}
                    {rows}
                </tbody>
                );  
        }
    }

    renderColumn (column: SpreadsheetColumn): React.ReactNode {
        let className = undefined;
        if (column.name in this.props.rowIndex) {
            className = 'stk-spreadsheet-column-index';
        }

        let buttons = undefined;
        if (column.buttons !== null) {
            buttons = (<div>{column.buttons}</div>);
        }

        let aff_fleche_tri;

        let newsort: string[] = [];
        newsort = Array.prototype.slice.call(this.state.sort)
        for(var element in newsort)
        {
            let sortColumnName = this.state.sort[element];

            if(sortColumnName == column.name)
            {
                aff_fleche_tri = (<div className="arrow-up"></div>);
            }
            else if (sortColumnName.substr(1) == column.name)
            {
                aff_fleche_tri = (<div className="arrow-down"></div>);
            }
        }
 
        return (
            <th key={column.name} className={className} onClick={()=>{if(column.sortable){this.handleClickHeaderColumn(column.name);}}}>
                <div>
                    {aff_fleche_tri}
                    <span>{column.name}</span>
                    {buttons}
                </div>
            </th>
        );
    }

    handleClickHeaderColumn(columnName: string): void {
        let newsort: string[] = [];

        newsort = Array.prototype.slice.call(this.state.sort);
        let found = false;

        for(var element in newsort)
        {
            let sortColumnName = this.state.sort[element];
            let order = 1;
            if (sortColumnName.substr(0,1)== "-") {
                newsort = [];
                found = true;
                break;
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
                
                if(sortOrder == -1)
                {
                    if(b[columnName] == null)
                    {
                        comp = 1;
                    }else
                    {
                        comp = b[columnName].toString().localeCompare(a[columnName]);
                    }    
                }
                else
                {
                    if(a[columnName] == null)
                    {
                        comp = 1;
                    }else
                    {
                        comp = a[columnName].toString().localeCompare(b[columnName]);
                    }    
                }   
                if(comp!=0){break;}
            }
            return comp;
        }
    }
    
    /*
        si la valeur cherchée v est un tableau => menu déroulant
            - si v est "" ou null on test si le texte est ""
            - Sinon on regarde  si texte = v pour chaque item du tableau

        Dans le reste des cas on est dans une recherche de caractère standard
        plusieurs choix possible,
            - v commence et termine par * en contenant du texte, exemple *textecherche* alors on ne garde que textecherche
            - v ne contient pas de caractère de recherche, exemple textecherche alors on regarde si le champ contient textecherche dans l'ensemble de ces catactères
            - v commence par * exemple *textecherche, on recherche ce qui termine par textecherche
            - v termine par * exemple textecherche*, alors on recherche ce qui commence par textecherche
            - v commence par <, si champ date alors on ne garde que ce qui est < a la date demandée (YYYY-MM-DD). 
                Si on ne rentre que l'année YYYY alors sera considéré le 1er janvier. Ne sera retourné que les champs < au 1er janvier YYYY
            - v commence par >, si champ date alors on ne garde que ce qui est > a la date demandée (YYYY-MM-DD). 
                Si on ne rentre que l'année YYYY alors sera considéré le 1er janvier. Ne sera retourné que les champs > au 1er janvier YYYY donc YYYY compris, équivaut à >= mais ce n'est pas grave   
    */
    dynamicFilter(tableau: any[], columnName: string, filterValue: any): any[] {
        var cellValue = "";
        var filteredRows: any[] = [];

        for (var ligne in tableau)
        {
            let keepRow = true; // Whether to keep this row in the final rows

            // Si la valeur du champ est null, on le passe en ""
            if(tableau[ligne][columnName] != null) {
                cellValue = tableau[ligne][columnName];
            } else {
                cellValue = "";
            }

            // Cas menu déroulant
            if(Array.isArray(filterValue)) 
            {
                for(var lval in filterValue) 
                {
                    let currentFilterValue = filterValue[lval].toLowerCase();

                    if (currentFilterValue == "null" || currentFilterValue == "") {
                        if(cellValue.toString() == ""){
                            keepRow = false;
                        }
                    } else if(currentFilterValue == cellValue.toLowerCase()) {
                        keepRow = false; 
                    }
                }
            }else
            {
                // On passe en minuscule le filtre demandé
                filterValue = filterValue.toLowerCase()

                // Dans le cas ou il y a des enfants (lien dans la cellule ou mise en forme de couleur etc), alors on récupère la valeur comprise dans le dernier enfant
                cellValue = this.recherche_children(cellValue)

                // Si commence et termine par * alors on ne garde que la partie centrale
                if(filterValue.substr(-1) == "*" && filterValue.length > 1 && filterValue.substr(0,1) == "*") {
                    filterValue = filterValue.substr(1, filterValue.length-2)
                }

                // Si null, on recherche un texte vide
                if (filterValue == "null") {
                    if (cellValue.toString() == "") {keepRow = false;}                
                // Si * on cherche tout ce qui n'est pas vide
                } else if (filterValue == "*") {
                    if (cellValue.toString() != "") {keepRow = false;}
                // Si tt* on cherche ce qui commence par tt
                } else if(filterValue.substr(-1) == "*" && filterValue.length > 0) {
                    var regex = new RegExp("\^"+filterValue.substr(0,filterValue.length-1));
                    if (cellValue.toString().toLowerCase().search(regex) >= 0){keepRow = false;}
                // Si *tt on cherche ce qui termine par tt
                }else if(filterValue.substr(0,1) == "*" && filterValue.length > 0) {
                    var regex = new RegExp(filterValue.substr(1) + "\$");
                    if(cellValue.toString().toLowerCase().search(regex) >= 0){keepRow = false;}
                }else if(filterValue.substr(0,1) == "<" && cellValue.length > 0) {
                    // Si le champ est une date
                    if(!isNaN(Date.parse(cellValue))){
                        // Test si la date est inférieur à la date demandée
                        if(Date.parse(cellValue) < Date.parse(filterValue.substr(1))){keepRow = false;}
                    }
                }else if(filterValue.substr(0,1) == ">" && filterValue.length > 0) {
                    // Si le champ est une date
                    if(!isNaN(Date.parse(cellValue))) {
                        // Test si la date est supérieur à la date demandée
                        if(Date.parse(cellValue) > Date.parse(filterValue.substr(1))){keepRow = false;}
                    }
                // sinon on recherche la totalité de la chaine (équivalent *filterValue*)
                }else 
                {
                    if (cellValue.toString().toLowerCase().indexOf(filterValue) >= 0) {keepRow = false;}
                }
            }

            if(keepRow !== true) {filteredRows.push(tableau[ligne]);}
        }

        return filteredRows;
    }

    recherche_children (cellValue:React.ReactNode): any
    {
        if((cellValue!=undefined && cellValue.props!= undefined && cellValue.props.children != undefined) || (cellValue!=undefined && cellValue.props!= undefined && cellValue.props.children == null)) 
        {
            cellValue = cellValue.props.children;
            cellValue = this.recherche_children(cellValue);
        }
        return cellValue;
    }


    renderRow (row: any): React.ReactNode 
    {
        let cells = []
        let index :any[] = [];
        for (let i = 0; i < this.props.rowIndex.length; ++i) {
            index.push(row[this.props.rowIndex[i]]);
        }   

        let selectedRow = this.props.selectedRow;
        if(selectedRow==undefined){selectedRow=-1;}

        // Pour la comparaison permettant de savoir si on est sur la ligne sélectionné, on compare la valeur du dernier enfant (les composants reacts ne se comparent pas correctement)
        let click:any = index[0];
        click = this.recherche_children(click)
        selectedRow = this.recherche_children(selectedRow)

        for (let i = 0; i < this.props.columns.length; ++i) {
            let column = this.props.columns[i];
            if(click==selectedRow)
            {
                //console.log("yes")
                cells.push(<td className={"stk-spreadsheet-rows-selected"} onClick={() => {this.handleClickRow(index);}}>{row[column.name]}</td>);
            }else
            {
                cells.push(<td onClick={() => {this.handleClickRow(index);}}>{row[column.name]}</td>); 
            }
        }
        return (<tr>{cells}</tr>);
    }
}
