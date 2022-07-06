import './spreadsheet.css';
import * as React from 'react';
import {DayRangePicker, DayPicker} from './date';
import {FormSmartText, FormDate} from './form';
import {MenuFilter} from './menufilter';
import {Button, ButtonBar} from './button';
import { EIcon } from './icon';
import {EPosition, ETrigger, Popover} from './popover';
import {Popup, PopupBody, PopupTitle, PopupBodyRow, PopupFooter} from './popup';
import {ToggleSwitch} from './ToggleSwitch/ToggleSwitch'

export class SpreadsheetColumn 
{
    name: string;
    titre: string|undefined;

    size: number|undefined;
    typeFiltre:string;
    type_: string;
    sortable?: boolean;
    filtrable?: boolean;
    multiSelection?: boolean;
    edit?: boolean;
    mandatory?: boolean;

    listeItems?: any;

    buttons: React.ReactNode | null;

    constructor (
        name: string, 
        titre:string|undefined, 
        size: number|undefined, 
        typeFiltre: string, 
        type_: string, 
        sortable: boolean = false, 
        filtrable: boolean = false, 
        multiSelection: boolean = false, 
        edit: boolean = false, 
        mandatory: boolean = false,
        listeItems: any = {},) 
    {
        this.name = name;
        this.titre = titre;
        this.size = size;
        this.typeFiltre = typeFiltre;
        this.type_ = type_;
        this.sortable = sortable;
        this.filtrable = filtrable;
        this.multiSelection = multiSelection;
        this.edit = edit;
        this.mandatory = mandatory;
        this.listeItems = listeItems;
    }
}

interface ISpreadsheetProps {
    columns: SpreadsheetColumn[];
    rowIndex: string[];
    rows: any[];
    height?: string;
    onClickRow?: any;
    onSaveCell?: any;
    onAddCell?: any;
    onDelCell?: any;
    sortable_default?: string[];
    filter_default?: any;
    selectedRow?:any;
    infoSupp?:boolean;
    edit?:boolean;
    add?: boolean;
    delete?: boolean;
}

interface ISpreadsheetState {
    sort: string[];
    filter: any;
    affCal: any;
    editCell:any[];
    saveRows: any[];
    addRow: any;
    popupDelShown: boolean;
    affAddLine: boolean;
}

export class Spreadsheet extends React.Component<ISpreadsheetProps, ISpreadsheetState> 
{
    wrapperElement: HTMLElement | null;

    constructor (props: ISpreadsheetProps) 
    {
        super(props);

        let filter_default = this.props.filter_default;
        if(filter_default==undefined){filter_default="";}

        let sortable_default = this.props.sortable_default;
        if(sortable_default==undefined){sortable_default=[];}

        this.state = {
            sort: sortable_default,
            filter: filter_default,
            affCal:{},
            editCell:[],
            saveRows: [],
            addRow: {},
            popupDelShown: false,
            affAddLine: false,
        };

        this.handleClickRow = this.handleClickRow.bind(this);
        this.handleDblClickCell = this.handleDblClickCell.bind(this);
        this.handleSaveSpreadSheet = this.handleSaveSpreadSheet.bind(this);
        this.handleCancelSaveSpreadSheet = this.handleCancelSaveSpreadSheet.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleBlurCell = this.handleBlurCell.bind(this);
        this.handleBlurCellAdd = this.handleBlurCellAdd.bind(this);
        this.handleSuppSpreadSheet = this.handleSuppSpreadSheet.bind(this)
        this.handleAffPopupSuppSpreadSheet = this.handleAffPopupSuppSpreadSheet.bind(this);
        this.handleCancelSuppSpreadSheet = this.handleCancelSuppSpreadSheet.bind(this);
        this.handleAffAddSpreadSheet = this.handleAffAddSpreadSheet.bind(this)

        this.handleClickHeaderColumn = this.handleClickHeaderColumn.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.dynamicSort = this.dynamicSort.bind(this);
        this.dynamicFilter = this.dynamicFilter.bind(this);
        this.handleScroll = this.handleScroll.bind(this);

        this.handleDateSupChange = this.handleDateSupChange.bind(this);
        this.handleDateSupClose = this.handleDateSupClose.bind(this);
        this.handleDateInfChange = this.handleDateInfChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleDateClose = this.handleDateClose.bind(this);

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
		// On relance la requête seulement lorsque la propriété de filtre change.
		if (this.props.filter_default != nextProps.filter_default) {
			this.setState({filter: nextProps.filter_default});
            this.setState({affCal:{}});
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

                let cellValue = this.recherche_children(cell);

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
        let found = false;

        if(value==""){
            delete newfilter[columnName];
        }

        for(var element in newfilter)
        {
            if(element == columnName)
            {
                newfilter[element] = value;
                found = true;
            }
        }
        if (!found){
            if(!newfilter){
                newfilter = {};
            }
            newfilter[columnName] = value;
        }
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
        if(!newfilter){
            newfilter = {};
        }
        for(var lval in liste_val){
            for(var v in tableau_item){
                if(tableau_item[v].id == liste_val[lval])
                { 
                    var newvalue:string = tableau_item[v].text;
    
                    if (newfilter[columnName] == undefined)
                    {
                        newfilter[columnName]=[newvalue];
                    }else
                    {
                        newfilter[columnName].push(newvalue);
                    }
                    break;
                }
            }
        }
        this.setState({filter: newfilter});
    }

    /*
        3 cas possibles pour value tableau_item:
            >= Supérieur ou égal à
            <= Inférieur ou égal à
            <> Compris entre
    */
    handleFilterMenuDate(value: string, columnName: string): void { 
        var affCalend = this.state.affCal;
        
        if(value[0] == "0"){
            affCalend[columnName] = 0;
        }else if(value[0] == "1"){
            affCalend[columnName] = 1;
        }else if(value[0] == "2"){
            affCalend[columnName] = 2;
        }
        this.setState({affCal:affCalend});
    }

    handleDateSupClose(columnName: string): void {
        var affCalend = this.state.affCal;
        delete affCalend[columnName];
        this.setState({affCal:affCalend});
    }

    handleDateSupChange(datesup: Date|undefined, columnName: string): void {
        var affCalend = this.state.affCal;
        delete affCalend[columnName];
        this.setState({affCal:affCalend}); 

        // Définition du nouveau filtre
        let newfilter:any = this.state.filter;
        delete newfilter[columnName]
        if(datesup!=undefined)
        {
            newfilter[columnName] = ">="+this.formatDate(datesup);
            this.setState({filter: newfilter});
        }
        
    }

    handleDateInfChange(dateinf: Date|undefined, columnName: string): void {
        var affCalend = this.state.affCal;
        delete affCalend[columnName];
        this.setState({affCal:affCalend}); 

        // Définition du nouveau filtre
        let newfilter:any = this.state.filter;
        delete newfilter[columnName]
        if(dateinf!=undefined)
        {
            newfilter[columnName] = "<=" + this.formatDate(dateinf);
            this.setState({filter: newfilter});
        }
    }

    handleDateClose (columnName: string): void {
        var affCalend = this.state.affCal;
        delete affCalend[columnName];
        this.setState({affCal:affCalend}); 
    }

	handleDateChange (dateStart: Date, dateEnd: Date, columnName: string): void {
        var affCalend = this.state.affCal;
        delete affCalend[columnName];
        this.setState({affCal:affCalend}); 

        // Définition du nouveau filtre
        let newfilter:any = this.state.filter;
        delete newfilter[columnName]
        newfilter[columnName] = '>='+this.formatDate(dateStart) + ",<=" + this.formatDate(dateEnd);
        this.setState({filter: newfilter});
	}

    formatDate (dat: Date): string {
        return '' + dat.getFullYear() + "-" + (dat.getMonth() < 9 ? '0' + (dat.getMonth()+1) : dat.getMonth()+1) + "-" + (dat.getDate() < 10 ? '0' + dat.getDate() : dat.getDate());
    }

    formatDateHour (dat: Date): string {
        return '' + dat.getFullYear() + "-" + (dat.getMonth() < 9 ? '0' + (dat.getMonth()+1) : dat.getMonth()+1) + "-" + (dat.getDate() < 10 ? '0' + dat.getDate() : dat.getDate()) + " " + dat.getHours()+":"+dat.getMinutes();
    }

    handleClickRow (rowIndex: any[], columnName:string, ifSelectedRow:boolean) {
        if (this.props.onClickRow) {
            this.props.onClickRow(rowIndex, ifSelectedRow);
        }

        if(this.state.editCell){
            if(this.state.editCell[0]!=rowIndex || this.state.editCell[1]!=columnName){
                // On désactive la cellule qui est en edit
                this.setState({editCell:[]});
            }
        }
    }

    handleDblClickCell(rowId:number, columnName:string){
        if(this.props.edit){
            this.setState({editCell:[rowId,columnName]});
        }
    }

	handleKeyUp (e:any, rowId:number, columnName:string): void {
        // Si on a pressé la touche Enter
		if (e.key == 'Enter') {
            // Enregistrement de la cellule modifié dans l'état
            this.handleBlurCell(e.target.value, rowId, columnName);
            // Savegarde de la cellule dans la BDD
			this.handleSaveSpreadSheet();
		}
	}

    handleBlurCell(value:any, rowId:number, columnName:string, columnType:string = "", listeItems?:any){
        if(columnType == "datetime"){
            // Changement de format pour enregistrement
            value = this.formatDateHour(value)
        }else if(columnType == "date"){
            // Changement de format pour enregistrement
            value = this.formatDate(value)
        }else if(columnType == "liste"){
            value = value[0];
        }
        // Récupération de la ligne index correspondant à l'id dans le tableau de départ
        var index = -1;
        for(let l in this.props.rows){
            if(this.props.rows[l]["id"] == rowId){
                index = Number(l);
            }
        }

        // Récupération du dict des valeurs modifiées
        var saveState = this.state.saveRows;
        
        // Test si c'est la valeur modifiée à déjà été modifiée
        let present = false;
        if(saveState.length>0){
            for(let c in saveState){
                if(saveState[c]["id"] == rowId && saveState[c]["columnName"] == columnName){
                    present = true;
                    // Test si la valeur est égale à la valeur de départ on la retire du tableau
                    if(this.props.rows[index][columnName] == value || (columnType == "liste" && this.props.rows[index][columnName] == this.recupTextItems(value[0], listeItems))){
                        saveState.splice(Number(c),1);
                    }else{
                        // Maj de la valeur
                        saveState[c]["value"] = value;
                    }
                    break;
                }
            }
        }
        // Ajout de la nouvelle valeur
        if(!present){
            // Test si la valeur est différente de la valeur de départ
            if(this.props.rows[index][columnName] != value ){
                saveState.push({"id":rowId, "columnName":columnName, "value":value});
            }
        }
        this.setState({saveRows:saveState});

        // On désactive la cellule qui est en edit
        this.setState({editCell:[]});
    }

    handleBlurCellAdd(value:any,columnName:string, columnType:string = ""){
        if(columnType == "datetime"){
            // Changement de format pour enregistrement
            value = this.formatDateHour(value);
        }else if(columnType == "date"){
            // Changement de format pour enregistrement
            value = this.formatDate(value);
        }else if(columnType == "liste"){
            value = value[0];
        }

        // Récupération du dict des valeurs modifiées
        var saveAdd = this.state.addRow;
        saveAdd[columnName] = value;

        this.setState({addRow:saveAdd});
    }


    handleSaveSpreadSheet (): void {
        // Si on est en train d'ajouter une nouvelle ligne
        if(this.state.affAddLine)
        {
            this.handleAddSpreadSheet();
        }

        if (this.props.onSaveCell) {
            this.props.onSaveCell(this.state.saveRows);
        }
    
        this.setState({saveRows: [], editCell:[]});
    }

    handleAddSpreadSheet (): void {
        if (this.props.onAddCell) {
            this.props.onAddCell(this.state.addRow);
        }
    
        this.setState({addRow: {}});
    }

    handleCancelSaveSpreadSheet (): void {
        this.setState({saveRows: [], addRow:{}, editCell:[], affAddLine: false});
    }

    handleAffAddSpreadSheet (): void {
        this.setState({affAddLine: true});
    }

    handleSuppSpreadSheet (): void {
        if (this.props.onDelCell) {
            this.props.onDelCell(this.props.selectedRow);
        }
        this.setState({popupDelShown: false})
        this.props.onClickRow(this.props.rowIndex, false);
    }

    handleAffPopupSuppSpreadSheet (): void {
        this.setState({popupDelShown: true})
    }

    handleCancelSuppSpreadSheet (): void {
        this.setState({popupDelShown: false})
        // On désélectionne la ligne
        this.props.onClickRow(this.props.rowIndex, false);
    }

    render (): React.ReactNode {
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
        if (this.props.infoSupp === true || this.props.edit || this.props.add || this.props.delete) {

            let buttonSaveCancel: React.ReactNode = (null);
            let buttonAdd: React.ReactNode = (null);
            let buttonSave: React.ReactNode = (null);
            let buttonCancel: React.ReactNode = (null);
            let confDelete: React.ReactNode = (null);
            if(this.props.edit || (this.props.add && this.state.affAddLine)){
                if(this.state.saveRows.length>0 || Object.keys(this.state.addRow).length !== 0){
                    let affBoutonSave = true;
                    // On regarde si toutes les valeurs mandatory sont compétées
                    for (let i = 0; i < this.props.columns.length; ++i) {
                        let column = this.props.columns[i];

                        // Si la colonne est obligatoire ET cas ajout nouvelle ligne
                        if(column.mandatory && Object.keys(this.state.addRow).length !== 0){
                            if(column.name in this.state.addRow){
                                if(this.state.addRow[column.name] == "" || this.state.addRow[column.name] == undefined){
                                    affBoutonSave = false;
                                    break;
                                }
                            }else{
                                affBoutonSave = false;
                                break;
                            }
                        }
                        // Si la colonne est obligatoire ET cas modification d'une ligne
                        if(column.mandatory && this.state.saveRows.length>0){
                            for(let cellule in this.state.saveRows){
                                if(this.state.saveRows[cellule]["columnName"] == column.name && this.state.saveRows[cellule]["value"] == ""){
                                    affBoutonSave = false;
                                    break;
                                }
                            }
                        }
                    }

                    if(affBoutonSave){
                        buttonSave = (<Button position={EPosition.TOP_CENTER} secondary icon={EIcon.DONE} tooltip="Enregistrer les modifications" onClick={this.handleSaveSpreadSheet}><strong>Enregistrer</strong></Button>)
                    }
                }
                if(this.state.editCell.length>0 || this.state.saveRows.length>0 || Object.keys(this.state.addRow).length !== 0 || this.state.affAddLine){
                    buttonCancel = (<Button position={EPosition.TOP_CENTER} secondary icon={EIcon.BLOCK} tooltip="Annuler les modifications" onClick={this.handleCancelSaveSpreadSheet}><strong>Annuler</strong></Button>)

                    buttonSaveCancel = (<div>
                                    <ButtonBar>
                                        {buttonSave} 
                                        {buttonCancel}
                                    </ButtonBar>
                                </div>);
                }
            }
            if(this.props.add && !this.state.affAddLine){
                if(this.state.editCell.length==0 && Object.keys(this.state.addRow).length === 0){
                    buttonAdd = (<Button position={EPosition.TOP_CENTER} secondary icon={EIcon.ADD} tooltip="Ajouter une nouvelle ligne" onClick={this.handleAffAddSpreadSheet}><strong>Ajouter</strong></Button>)
                }
            }
            if(this.props.delete){
                if(this.props.selectedRow){
                    if(this.props.selectedRow > 0 && this.state.editCell.length==0 && this.state.saveRows.length==0 && Object.keys(this.state.addRow).length === 0){

                        
                        if(!this.state.popupDelShown){
                            
                            confDelete = (
                                <Button position={EPosition.TOP_CENTER} secondary icon={EIcon.DELETE} tooltip="Supprimer la ligne sélectionnée" onClick={this.handleAffPopupSuppSpreadSheet}><strong>Supprimer</strong></Button>
                            );
                            
                            //confDelete = (<Button position={EPosition.TOP_CENTER} secondary icon={EIcon.DELETE} tooltip="Supprimer la ligne sélectionnée" onClick={this.handleAffPopupSuppSpreadSheet}><strong>Supprimer</strong></Button>);

                        }else{
                            confDelete = (<Popup onBlanketClick={(e) => {}} height="180px">
                                			<PopupTitle>
                                                <h2>Suppression d'une ligne</h2>
                                            </PopupTitle>
                                            <PopupBody style={{display: "block"}}>
                                                    <p style={{padding:"0px 5px 10px 5px", fontSize:"1.2em"}}><strong>Etes-vous sûr de vouloir supprimer cette ligne ? <br/>
                                                    Attention car ceci est une action définitive !!!</strong>
                                                    </p>
                                                    <Button secondary icon={EIcon.DELETE} onClick={this.handleSuppSpreadSheet}><strong>Supprimer</strong></Button>
                                                    <Button secondary icon={EIcon.BLOCK} onClick={this.handleCancelSuppSpreadSheet} ><strong>Annuler</strong></Button>
                                            </PopupBody>
                                        </Popup>);
                        }
                    }
                }
            }

            return (
                <div style={{textAlign:"center"}} className="stk-spreadsheet-footer">
                    <div>Nombre de lignes : {rows.length}</div>
                    {buttonAdd}
                    {confDelete}
                    {buttonSaveCancel}
                    <div>
                        <Button  position={EPosition.TOP_RIGHT} secondary tooltip="Copier le tableau dans le presse-papier" onClick={this.handleCopyTable.bind(this)}><strong>Copier</strong></Button>
                    </div>
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

    renderFilters (rows: any[]): React.ReactNode {
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
                filters.push(this.renderFiltersContent(this.props.columns[i], rows));
            }

            return (
               <tr className="stk-spreadsheet-filters">{filters}</tr>
            );
        }else
        {
            return null;
        }
    }
	
	parseDateDatabase(date: string, sephour:string="-", septime:string=":"): Date|null{

        if(date != null){
            let tabMyDate = date.split(" ");
        
            if(tabMyDate.length > 1){
                let MyDate = tabMyDate[0].split(sephour);
                let MyTime = tabMyDate[1].split(septime);
        
                // Attention le mois est écrit en index donc commence à 0, on enlève 1 pour la conversion
                // new Date(year, monthIndex, day, hours, minutes, seconds, milliseconds)
                return new Date(Number(MyDate[0]), Number(MyDate[1])-1, Number(MyDate[2]), Number(MyTime[0]), Number(MyTime[1]));
            }else{
                let MyDate = tabMyDate[0].split(sephour);
                return new Date(Number(MyDate[0]), Number(MyDate[1])-1, Number(MyDate[2]));
            }
        }else{
            return null;
        }
	}

    renderFiltersContent (column: SpreadsheetColumn, rows: any[]): React.ReactNode {       
        let className = undefined;
 
        if (column.name in this.props.rowIndex) {
            className = 'stk-spreadsheet-column-index';
        }else
        {
            className = 'stk-spreadsheet-columns-filters';
        }

        let styleSize = undefined;
        if (column.size) {
            styleSize = {minWidth:column.size+"px"};    //anciennement maxWidth
        }

        if(column.typeFiltre == "text")
        {
            var valueInput = "";
            if(this.state.filter[column.name] != undefined) {
                valueInput = this.state.filter[column.name];
            }
            
            return (
                <td key={column.name+"-Filter"} className={className} style={styleSize}>
                    <FormSmartText  onChange={(value)=>this.handleFilter(value, column.name)} value={valueInput} />
                </td>
            ); 
        } else if(column.typeFiltre == "menu") {
            
            var tableau_item:any = {};

            tableau_item = this.tableau_item_filter(column.name, rows);
            /* Ajout du 29-04-2022 : Tri du menu de sélection par ordre alphabétique et non par id de la ligne */
            tableau_item.sort((tab1:any, tab2:any) => {
                return this.compareObjects(tab1, tab2, 'text')
              })
            //console.log(tableau_item);
            /* Fin ajout */

            let value_select:any = [];
            // Si on a des filtres
            if(this.state.filter[column.name] != undefined) {
                // Parcours les Items de la liste
                for(var i in tableau_item) {
                    // Parcours les filtres sélectionnées
                    for(var j in this.state.filter[column.name]) {
                        if(tableau_item[i]["text"].toString().toLowerCase() == this.state.filter[column.name][j].toString().toLowerCase()) {
                            value_select.push(tableau_item[i]["id"]);
                        }
                    }
                }
            }
            return (
                <td key={column.name+"-Filter"} className={className} style={styleSize}>
                    <MenuFilter
                        enableMultiSelection={column.multiSelection} 
                        value={value_select} 
                        onSelectionChange={(value)=>this.handleFilterMenu(value, column.name, tableau_item)}
                        items={tableau_item}
                        style={{height:'200px', width:'200px', padding:'5px'}}
                        disabled={true}
                    />
                </td>
            ); 
        }else if(column.typeFiltre == "date"){
            var tableau_item:any = [{id:0, text:">= Supérieur ou égal à"}, {id:1, text:"<= Inférieur ou égal à"}, {id:2, text:"<> Compris entre"}]
	
            /*		
            let currentDay = new Date();
            let firstDayOfMonth = new Date(currentDay.getFullYear(), currentDay.getMonth(), 1);
            let lastDayOfMonth = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() + 1, 0);
            
            // Pour le filtre du calendrier
            let firstDay = firstDayOfMonth;
            let lastDay = lastDayOfMonth;
            */

            // Pour le filtre du calendrier
            let firstDay:Date|null = new Date();
            let lastDay:Date|null = new Date();
            let lastDaySearch:Date|null = new Date();

            for(var line in this.props.rows){
                lastDaySearch = this.parseDateDatabase(this.recherche_children(this.props.rows[line][column.name]));
                if(lastDaySearch != null){
                    if(lastDaySearch > lastDay){
                        lastDay = lastDaySearch;
                    }
                }
            }
            // Ajoute 1 jour à lastDay
            lastDay = new Date(lastDay.setTime(lastDay.getTime() + 86400000));

            if(this.state.affCal[column.name]==undefined){
                let value_select:any = [];
  
                // Si on a des filtres
                if(this.state.filter[column.name] != undefined) {
                    value_select = this.state.filter[column.name];
                }
                return (
                    <td key={column.name+"-Filter"} className={className} style={styleSize}>
                        <MenuFilter
                            enableMultiSelection={column.multiSelection} 
                            displayvalue={value_select} 
                            onSelectionChange={(value)=>this.handleFilterMenuDate(value, column.name)}
                            items={tableau_item}
                            style={{height:'200px', width:'200px', padding:'5px'}}
                            disabled={true}
                        />
                    </td>
                );
            }else{
                if(this.state.affCal[column.name] == 0){
                    return(<td key={column.name+"-Filter"} className={className} style={styleSize}>
                                <div>
                                    <DayPickerColumn colName={column.name} onClose={this.handleDateSupClose} onChange={this.handleDateSupChange} />
                                </div>
                        </td>);
                }else if(this.state.affCal[column.name] == 1){
                    return(<td key={column.name+"-Filter"} className={className} style={styleSize}>
                                <div>
                                    <DayPickerColumn colName={column.name} onClose={this.handleDateSupClose} onChange={this.handleDateInfChange} />
                                </div>
                        </td>
                    );
                }else if(this.state.affCal[column.name] == 2){
                    return(
                        <td key={column.name+"-Filter"} className={className} style={styleSize}>
                            <div>
                                <DayRangePickerColumn dayStart={firstDay} dayEnd={lastDay} colName={column.name} onClose={this.handleDateClose} onChange={this.handleDateChange} viewButton={false}/>
                            </div>
                        </td>
                    );
                }
            }
        }else
        {
            return (
                <td key={column.name+"-Filter"} className={className} style={styleSize}/>
            ); 
        }
    }


    compareObjects(object1:any, object2:any, key:any) {
        const obj1 = object1[key];
        const obj2 = object2[key];
      
        if (obj1 < obj2) {
          return -1;
        }
        if (obj1 > obj2) {
          return 1;
        }
        return 0;
      }


    tableau_item_filter (colonne:string, rows:any[]): any
    {
        /* Ajout du 15/04/22 => A revoir
            console.log(newrow);            => Format composant React
            console.log(this.props.rows);   => Format dict standard
            Dans la suite du code on pourra alors remplacer this.props.rows par la nouvelle variable rows
        */
       /*
        var tabColumnName = [];
        for(var columnName in this.props.columns)
        {
            tabColumnName.push(this.props.columns[columnName].name);
        }

        var newrow:any = [];
        for (var ligne in rows)
        {
            let cellglobal = this.recherche_children(rows[ligne])
            newrow.push(ligne);
            newrow[ligne] = {};

            // On parcourt chaque colonne
            for(var column in cellglobal) 
            {
                let columnName = tabColumnName[Number(column)];

                let cellValue = this.recherche_children(cellglobal[column])
                newrow[ligne][columnName] = cellValue;
            }
        }
        */
        /* Fin Ajout */
        


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
                        value = this.recherche_children(this.props.rows[ligne][col]);
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
            rows.push(this.renderRow(newrows[i], i));
        }

        return rows;
    }

    renderRows (rows: any[]): React.ReactNode {     

        return (
            <tbody>
                {this.renderFilters(rows)}
                {rows}
                {this.renderAddRow()}           
            </tbody>
            );
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

        let styleSize = undefined;
        if (column.size) {
            styleSize = {minWidth:column.size+"px"};    //maxWidth
        }

        var columnName = column.name
        if(column.titre != undefined){
            columnName = column.titre;
        }
        return (
            <th key={column.name} className={className} style={styleSize} onClick={()=>{if(column.sortable){this.handleClickHeaderColumn(column.name);}}}>
                <div>
                    {aff_fleche_tri}
                    <span>{columnName}</span>
                    {buttons}
                </div>
            </th>
        );
    }

    handleClickHeaderColumn(columnName: string): void {
        let newsort: string[] = [];

        newsort = Array.prototype.slice.call(this.state.sort);
        let found = false;

        for(var element in newsort){
            let sortColumnName = this.state.sort[element];
            let order = 1;
            if (sortColumnName.substr(0,1)== "-") {
                newsort = [];
                found = true;
                break;
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
        console.log(newsort)
        this.setState({sort: newsort});
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

    dynamicSort(tabsort: string[]) 
    {
        //return function (a: any,b:any){
        return (a: any,b:any)=>{
            var sortOrder = 1;
            var comp;
            var va:any;
            var vb:any;

            for(var sortkey in tabsort)
            {
                let columnName = tabsort[sortkey];
                if(tabsort[sortkey].substring(0,1) == "-") {
                    sortOrder = -1;
                    columnName = columnName.substr(1);
                }

                va = this.recherche_children(a[columnName]);
                vb = this.recherche_children(b[columnName]);

                if(sortOrder == -1)
                {
                    if(vb == null)
                    {
                        comp = 1;
                    }else
                    {
                        comp = vb.toString().localeCompare(va);
                    }    
                }
                else
                {
                    if(va == null)
                    {
                        comp = 1;
                    }else
                    {
                        comp = va.toString().localeCompare(vb);
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
        
        var typeFiltre:string = "";
        // Parcours les colonnes
        for(var c in this.props.columns){
            if(this.props.columns[c].name == columnName){
                typeFiltre = this.props.columns[c].typeFiltre
            }
        }


        for (var ligne in tableau)
        {
            let keepRow = false; // Whether to keep this row in the final rows

            // Si la valeur du champ est null, on le passe en ""
            if(tableau[ligne][columnName] != null) {
                cellValue = tableau[ligne][columnName];
                cellValue = this.recherche_children(cellValue)
            } else {
                cellValue = "";
            }
            
            // Cas menu déroulant
            if(typeFiltre == 'menu') 
            {
                for(var lval in filterValue) 
                {
                    let currentFilterValue = filterValue[lval].toString().toLowerCase();
                    
                    if (currentFilterValue == "null" || currentFilterValue == "") {
                        if(cellValue.toString() == ""){
                            keepRow = true;
                        }
                    } else if(currentFilterValue == cellValue.toString().toLowerCase()) {
                        keepRow = true; 
                    }
                }
            }else if(typeFiltre == 'text') 
            {
                filterValue = filterValue.toString().split(",");

                var tabKeepRow = new Array(filterValue.length);

                for(var lval in filterValue) 
                {
                    tabKeepRow[Number(lval)] = keepRow;

                    // On passe en minuscule le filtre demandé
                    filterValue[lval] = filterValue[lval].toString().toLowerCase()

                    // Dans le cas ou il y a des enfants (lien dans la cellule ou mise en forme de couleur etc), alors on récupère la valeur comprise dans le dernier enfant
                    cellValue = this.recherche_children(cellValue)

                    if(cellValue != null){
                        // Si commence et termine par * alors on ne garde que la partie centrale
                        if(filterValue[lval].substr(-1) == "*" && filterValue[lval].length > 1 && filterValue[lval].substr(0,1) == "*") {
                            filterValue[lval] = filterValue[lval].substr(1, filterValue[lval].length-2)
                        }
                        
                        // Si null, on recherche un texte vide
                        if (filterValue[lval] == "null") {
                            if (cellValue.toString() == "") {tabKeepRow[Number(lval)] = true;}                
                        // Si * on cherche tout ce qui n'est pas vide
                        } else if (filterValue[lval] == "*") {
                            if (cellValue.toString() != "") {tabKeepRow[Number(lval)] = true;}
                        // Si tt* on cherche ce qui commence par tt
                        } else if(filterValue[lval].substr(-1) == "*" && filterValue[lval].length > 0) {
                            var regex = new RegExp("\^"+filterValue[lval].substr(0,filterValue[lval].length-1));
                            if (cellValue.toString().toLowerCase().search(regex) >= 0){tabKeepRow[Number(lval)] = true;}
                        // Si *tt on cherche ce qui termine par tt
                        }else if(filterValue[lval].substr(0,1) == "*" && filterValue[lval].length > 0) {
                            var regex = new RegExp(filterValue[lval].substr(1) + "\$");
                            if(cellValue.toString().toLowerCase().search(regex) >= 0){tabKeepRow[Number(lval)] = true;}
                        }else if(filterValue[lval].substr(0,2) == "<=" && cellValue.length > 0) {
                            // Si le champ est une date
                            if(!isNaN(Date.parse(cellValue))){
                                // Test si la date est inférieur à la date demandée
                                if(Date.parse(cellValue) <= Date.parse(filterValue[lval].substr(1))){tabKeepRow[Number(lval)] = true;}
                            }
                        }else if(filterValue[lval].substr(0,2) == ">=" && filterValue[lval].length > 0) {
                            // Si le champ est une date
                            if(!isNaN(Date.parse(cellValue))) {
                                // Test si la date est supérieur à la date demandée
                                if(Date.parse(cellValue) >= Date.parse(filterValue[lval].substr(1))){tabKeepRow[Number(lval)] = true;}
                            }
                        // sinon on recherche la totalité de la chaine (équivalent *filterValue[lval]*)
                        }else if(filterValue[lval].substr(0,1) == "<" && cellValue.length > 0) {
                            // Si le champ est une date
                            if(!isNaN(Date.parse(cellValue))){
                                // Test si la date est inférieur à la date demandée
                                if(Date.parse(cellValue) < Date.parse(filterValue[lval].substr(1))){tabKeepRow[Number(lval)] = true;}
                            }
                        }else if(filterValue[lval].substr(0,1) == ">" && filterValue[lval].length > 0) {
                            // Si le champ est une date
                            if(!isNaN(Date.parse(cellValue))) {
                                // Test si la date est supérieur à la date demandée
                                if(Date.parse(cellValue) > Date.parse(filterValue[lval].substr(1))){tabKeepRow[Number(lval)] = true;}
                            }
                        // sinon on recherche la totalité de la chaine (équivalent *filterValue[lval]*)
                        }else{
                            if (cellValue.toString().toLowerCase().indexOf(filterValue[lval]) >= 0) {tabKeepRow[Number(lval)] = true;}
                        }
                    }
                }
                
                keepRow = false;
                for(var k in tabKeepRow){
                    if(tabKeepRow[k] == true){
                        keepRow = true;
                        break;
                    }
                }
            }else if(typeFiltre == 'date') 
            {
                filterValue = filterValue.toString().split(",");

                var tabKeepRow = new Array(filterValue.length);

                for(var lval in filterValue) 
                {
                    tabKeepRow[Number(lval)] = keepRow;

                    // On passe en minuscule le filtre demandé
                    filterValue[lval] = filterValue[lval].toString().toLowerCase()

                    // Dans le cas ou il y a des enfants (lien dans la cellule ou mise en forme de couleur etc), alors on récupère la valeur comprise dans le dernier enfant
                    cellValue = this.recherche_children(cellValue)

                    if(cellValue != null){
                        // Si commence et termine par * alors on ne garde que la partie centrale
                        if(filterValue[lval].substr(-1) == "*" && filterValue[lval].length > 1 && filterValue[lval].substr(0,1) == "*") {
                            filterValue[lval] = filterValue[lval].substr(1, filterValue[lval].length-2)
                        }

                        // Si null, on recherche un texte vide
                        if (filterValue[lval] == "null") {
                            if (cellValue.toString() == "") {tabKeepRow[Number(lval)] = true;}    
                        }else if(filterValue[lval].substr(0,7) == "<=|null") {
                            // Si le champ est une date
                            if(!isNaN(Date.parse(cellValue))){
                                // Test si la date est inférieur à la date demandée
                                if(Date.parse(cellValue) <= Date.parse(filterValue[lval].substr(7))){tabKeepRow[Number(lval)] = true;}
                            }         
                        }else if(filterValue[lval].substr(0,2) == "<=" && cellValue.length > 0) {
                            // Si le champ est une date
                            if(!isNaN(Date.parse(cellValue))){
                                // Test si la date est inférieur à la date demandée
                                if(Date.parse(cellValue) <= Date.parse(filterValue[lval].substr(2))){tabKeepRow[Number(lval)] = true;}
                            }
                        }else if(filterValue[lval].substr(0,7) == ">=|null") {
                            // Si le champ est une date
                            if(!isNaN(Date.parse(cellValue))){
                                // Test si la date est supérieur à la date demandée
                                if(Date.parse(cellValue) >= Date.parse(filterValue[lval].substr(7))){tabKeepRow[Number(lval)] = true;}
                            }
                        }else if(filterValue[lval].substr(0,2) == ">=" && filterValue[lval].length > 0) {
                            // Si le champ est une date
                            if(!isNaN(Date.parse(cellValue))) {
                                // Test si la date est supérieur à la date demandée
                                if(Date.parse(cellValue) >= Date.parse(filterValue[lval].substr(2))){tabKeepRow[Number(lval)] = true;}
                            }
                        // sinon on recherche la totalité de la chaine (équivalent *filterValue[lval]*)
                        }else if(filterValue[lval].substr(0,1) == "<" && cellValue.length > 0) {
                            // Si le champ est une date
                            if(!isNaN(Date.parse(cellValue))){
                                // Test si la date est inférieur à la date demandée
                                if(Date.parse(cellValue) < Date.parse(filterValue[lval].substr(1))){tabKeepRow[Number(lval)] = true;}
                            }
                        }else if(filterValue[lval].substr(0,1) == ">" && filterValue[lval].length > 0) {
                            // Si le champ est une date
                            if(!isNaN(Date.parse(cellValue))) {
                                // Test si la date est supérieur à la date demandée
                                if(Date.parse(cellValue) > Date.parse(filterValue[lval].substr(1))){tabKeepRow[Number(lval)] = true;}
                            }
                        // sinon on recherche la totalité de la chaine (équivalent *filterValue[lval]*)
                        }else{
                            if (cellValue.toString().toLowerCase().indexOf(filterValue[lval]) >= 0) {tabKeepRow[Number(lval)] = true;}
                        }
                    }else{
                        if(filterValue[lval].substr(0,7) == ">=|null" || filterValue[lval].substr(0,7) == "<=|null"){
                            tabKeepRow[Number(lval)] = true;
                        }
                    }
                }
                
                keepRow = true;
                for(var k in tabKeepRow){
                    if(tabKeepRow[k] == false){
                        keepRow = false;
                        break;
                    }
                }
            }
            if(keepRow === true) {filteredRows.push(tableau[ligne]);}
        }

        return filteredRows;
    }


    recupTextItems(id:number, listeItems:any):string{
        for(let item in listeItems){
            if(listeItems[item]["id"] == id){
                return listeItems[item]["text"];
            }
        }
        return "";
    }

    recupIdItems(text:string, listeItems:any):number[]{
        for(let item in listeItems){
            if(listeItems[item]["text"] == text){
                return [listeItems[item]["id"]];
            }
        }
        return [0]
    }


    renderAddRow(): React.ReactNode {
        if(this.state.affAddLine){
            let cells = []  

            for (let i = 0; i < this.props.columns.length; ++i) {
                let column = this.props.columns[i];
                let formEdit: React.ReactNode;

                if(column.edit){
					let mandatory:boolean|undefined = column.mandatory;
					let valeurAff:any = "";

					// Remplacement par les valeurs en cours d'edit
					if(Object.keys(this.state.addRow).length !== 0){
						if(this.state.addRow[column.name]){
							valeurAff = this.state.addRow[column.name];

							// Si on a complété la cellule on retire le fond de couleur
							if(valeurAff != ""){mandatory = false;}
						}
					}

					if(column.type_ == "boolean"){
						formEdit = (<ToggleSwitch optionLabels={["Oui","Non"]} id={column.name+"-0"} checked={valeurAff} onChange={(value:boolean) => this.handleBlurCellAdd(value, column.name)}/>);
					}else if(column.type_ == "text"){
						formEdit = (<FormSmartText mandatory={mandatory} onBlur={(value)=>this.handleBlurCellAdd(value, column.name)} value={valeurAff} />);
					}else if(column.type_ == "date" || column.typeFiltre == "datetime"){
						if(valeurAff==""){valeurAff=undefined}
						formEdit = (<DayPicker popupShown={false} onChange={(value)=>this.handleBlurCellAdd(value, column.name, column.type_)} value={valeurAff}/>);
					}else if(column.type_ == "liste"){
						formEdit = (<MenuFilter
							enableMultiSelection={false}  
							value={[valeurAff]}
							onSelectionChange={(value)=>this.handleBlurCellAdd(value, column.name, column.type_)}
							items={column.listeItems}
							style={{height:'200px', width:'200px', padding:'5px'}}
							disabled={true}
							mandatory={mandatory}
							/>);
					}else{
						valeurAff = this.recupTextItems(valeurAff, column.listeItems);
						formEdit = (<FormSmartText mask={column.type_} mandatory={mandatory} onBlur={(value)=>this.handleBlurCellAdd(value, column.name)} value={valeurAff} />);
					}

                }else{
                    formEdit = (null);
                }
                cells.push(<td key={column.name+"-"+i}>
                                {formEdit}
                            </td>);
            }
            return (<tr key={"line-0"}>{cells}</tr>);
        }
        return(null);
    }


    renderRow (row: any, numLine:number): React.ReactNode 
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

        click = this.recherche_children(click);
        selectedRow = this.recherche_children(selectedRow);

        for (let i = 0; i < this.props.columns.length; ++i) {
            let column = this.props.columns[i];
            let className = "";
            let ifSelectedRow:boolean = false;
            if(!column.edit){
                className = "stk-spreadsheet-rows-noteditable";
            }
            if(click==selectedRow){
                className = "stk-spreadsheet-rows-selected";
                ifSelectedRow = true;
            }
            var valeurAff:any = row[column.name];
            var valeurAffId:number[] = [];

            // Dans le cas du menu liste, au premier chargement on a la valeur text et pas l'id de stocké dans valeurAff, on créé donc une variable valeurAffId contenant l'ID a afficher
            if(column.type_ == "liste"){
                valeurAffId = this.recupIdItems(valeurAff, column.listeItems);
            }   
            
            // Remplacement par les valeurs en cours d'edit
            if(this.state.saveRows.length>0){
                for(let c in this.state.saveRows){
                    if(this.state.saveRows[c]["id"] == row["id"] && this.state.saveRows[c]["columnName"] == column.name){
                        valeurAff = this.state.saveRows[c]["value"];

                        // Dans le cas du menu liste, lors d'une modification on ne possède que l'ID du menu dans valeurAff, on la déplace donc dans valeurAffId et on recherche la correspondance text pour valeurAff
                        if(column.type_ == "liste"){
                            valeurAffId = valeurAff;
                            valeurAff = this.recupTextItems(valeurAff, column.listeItems);
                        }
                    }
                }
            }
            
            if(this.state.editCell[0] == row["id"] && this.state.editCell[1] == column.name && column.edit)
            {
				valeurAff = this.recherche_children(valeurAff);
                if(column.type_=="text")
                {
                    cells.push(<td key={column.name+"-"+click} className={className}>
                                    <FormSmartText mandatory={column.mandatory} onKeyUp={(value)=>this.handleKeyUp(value, row["id"], column.name)} onBlur={(value)=>this.handleBlurCell(value, row["id"], column.name)}  value={valeurAff} />
                                </td>);
                }else if(column.type_ == "date" || column.type_ == "datetime"){
                    if(valeurAff == undefined || valeurAff==""){
                        valeurAff = new Date();
                    }else{
                        valeurAff = new Date(valeurAff);
                    }
                    cells.push(<td key={column.name+"-"+click} className={className}>     
                                    <DayPicker popupShown={false} onChange={(value)=>this.handleBlurCell(value, row["id"], column.name, column.type_)} value={valeurAff}/>
                                </td>);
                }else if(column.type_=="boolean"){
                    cells.push(<td key={column.name+"-"+click} className={className} onClick={() => {this.handleClickRow(index, column.name, ifSelectedRow);}}>
                                    <ToggleSwitch disabled={false} id={column.name+"-"+click} small={true} checked={valeurAff} onChange={(value:boolean) => this.handleBlurCell(value, row["id"], column.name)}/>
                                </td>);
                }else if(column.type_ == "liste"){
                    console.log(valeurAffId)
                    cells.push(<td key={column.name+"-"+click} className={className} onClick={() => {this.handleClickRow(index, column.name, ifSelectedRow);}}>
                            <MenuFilter
                            enableMultiSelection={false}  
                            value={valeurAffId}
                            onSelectionChange={(value)=>this.handleBlurCell(value, row["id"], column.name, column.type_, column.listeItems)}
                            items={column.listeItems}
                            style={{height:'200px', width:'200px', padding:'5px'}}
                            disabled={false}
                            mandatory={column.mandatory}
                            />
                        </td>);
                }else{
                    // Tous les autres cas de Type (int, int positif, etc)
                    cells.push(<td key={column.name+"-"+click} className={className}>
                                    <FormSmartText mandatory={column.mandatory} mask={column.type_} onKeyUp={(value)=>this.handleKeyUp(value, row["id"], column.name)} onBlur={(value)=>this.handleBlurCell(value, row["id"], column.name)}  value={valeurAff} />
                                </td>);
                }
            // On est pas dans le cas EDIT, affichage du tableau standard
            }else{
                if(!column.edit){
                    if(column.type_=="boolean"){
                        cells.push(<td key={column.name+"-"+click} className={className} onClick={() => {this.handleClickRow(index, column.name, ifSelectedRow);}}>
                                        <ToggleSwitch disabled={true} id={column.name+"-"+click} small={true} checked={valeurAff} onChange={(value:boolean) => this.handleBlurCell(value, row["id"], column.name)}/>
                                    </td>);
                    }else{
                        cells.push(<td key={column.name+"-"+click} className={className} onClick={() => {this.handleClickRow(index, column.name, ifSelectedRow);}}>{valeurAff}</td>);
                    }
                }else{
                    if(column.type_=="boolean"){
                        let disabled = true;
                        if(this.props.edit){
                            disabled = false;
                        }
                        cells.push(<td key={column.name+"-"+click} className={className} onClick={() => {this.handleClickRow(index, column.name, ifSelectedRow);}}>
                                        <ToggleSwitch disabled={disabled} id={column.name+"-"+click} small={true} checked={valeurAff} onChange={(value:boolean) => this.handleBlurCell(value, row["id"], column.name)}/>
                                    </td>);
                    }else{
                        cells.push(<td key={column.name+"-"+click} className={className} onClick={() => {this.handleClickRow(index, column.name, ifSelectedRow);}} onDoubleClick={() => {this.handleDblClickCell(row["id"], column.name);}}>{valeurAff}</td>);
                    }
                }
            }
        }
        return (<tr key={"line-"+numLine}>{cells}</tr>);
    }
}



export interface IDayRangePickerColumnProps {
	dayStart: Date;
	dayEnd: Date;
    colName:string;
	viewButton: boolean;
	onChange: (dateStart: Date, dateEnd: Date, colName: string) => void;
    onClose?: (colName: string) => void;
}


export class DayRangePickerColumn extends React.Component<IDayRangePickerColumnProps> {

	constructor (props: IDayRangePickerColumnProps) {
		super(props);

        this.handleDateChangeColumn = this.handleDateChangeColumn.bind(this);
        this.handleDateCloseColumn = this.handleDateCloseColumn.bind(this);
    }

    handleDateChangeColumn (dayStart: Date, dayEnd: Date): void {
        if (this.props.onChange) {
            this.props.onChange(dayStart, dayEnd, this.props.colName);
        }
    }

    handleDateCloseColumn (): void {
		if (this.props.onClose) {
			this.props.onClose(this.props.colName);
		}
    }

	render (): React.ReactNode {
		return (<DayRangePicker popupShown={true} dayStart={this.props.dayStart} dayEnd={this.props.dayEnd} onClose={this.handleDateCloseColumn} onChange={this.handleDateChangeColumn} viewButton={this.props.viewButton}/>);
    }
}




export interface IDayPickerColumnProps {
	onChange?: (dat: Date|undefined, colName: string) => void;
	value?: Date;
    colName:string;
    onClose?: (colName: string) => void;
}

export class DayPickerColumn extends React.Component<IDayPickerColumnProps> {

	constructor (props: IDayPickerColumnProps) {
		super(props);

        this.handleDateChangeColumn = this.handleDateChangeColumn.bind(this);
        this.handleDateCloseColumn = this.handleDateCloseColumn.bind(this);
    }

    handleDateChangeColumn (dayStart: Date|undefined): void {
        if (this.props.onChange) {
            this.props.onChange(dayStart, this.props.colName);
        }
    }

    handleDateCloseColumn (): void {
		if (this.props.onClose) {
			this.props.onClose(this.props.colName);
		}
    }

	render (): React.ReactNode {
        var dateDefaut = new Date();
        if(this.props.value){dateDefaut = this.props.value;}
		return (<DayPicker popupShown={true} value={dateDefaut} onClose={this.handleDateCloseColumn} onChange={this.handleDateChangeColumn}/>);
    }
}
