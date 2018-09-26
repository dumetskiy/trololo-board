import * as React from 'react'
import {RefObject} from 'react';
import Board from './Board';
import Ticket from './Ticket';
import {TicketType, ColumnType, BoardType, SelectedTicketDataType, ColorDataType} from '../helpers/TypesHelper';
import {getColumnForBoard, getColorsData} from '../helpers/LocalStorageHelper';

import {
    removeBoardColumn,
    isValidColumnName,
    updateBoardColumnName,
    addTicketToBoardColumn,
    isValidTicketTitle,
    isValidTicketDescription
} from '../helpers/LocalStorageHelper';

export interface ColumnProps {
    boardId: number;
    columnId: number;
    updateAction: Function;
    selectedTicket: SelectedTicketDataType;
}

export default class Column extends React.PureComponent<ColumnProps>  {
    private columnNameInput: RefObject<HTMLInputElement>;
    private newTicketTitleInput: RefObject<HTMLInputElement>;
    private newTicketDescriptionInput: RefObject<HTMLTextAreaElement>;
    private newTicketColorSelect: RefObject<HTMLSelectElement>;
    state: any;
    
    constructor(props: any, state: any) {
        super(props, state);

        this.state = {
            colEditing: false,
            colAddTicket: false,
            ticketUpdated: false,
        };
        this.removeColumn = this.removeColumn.bind(this);
        this.toggleColumnTitleEdit = this.toggleColumnTitleEdit.bind(this);
        this.saveColumnTitle = this.saveColumnTitle.bind(this);
        this.toggleColumnAddTicket = this.toggleColumnAddTicket.bind(this);
        this.cancelAddTicket = this.cancelAddTicket.bind(this);
        this.createNewTicket = this.createNewTicket.bind(this);
        this.update = this.update.bind(this);
        this.isSelectedColumn = this.isSelectedColumn.bind(this);
        this.getTicketColorSelect = this.getTicketColorSelect.bind(this);
    }

    render(): React.ReactNode {
        this.columnNameInput = React.createRef();
        this.newTicketTitleInput = React.createRef();
        this.newTicketDescriptionInput = React.createRef();
        this.newTicketColorSelect = React.createRef();

        let columnId: number = this.props.columnId,
            boardId: number = this.props.boardId,
            selectedTicket: SelectedTicketDataType = this.props.selectedTicket,
            columnData: ColumnType = getColumnForBoard(boardId, columnId),
            ticketsTemplate: JSX.Element[] = [],
            extraColumnElement: JSX.Element = null,
            colHeader: JSX.Element = null,
            updateAction: Function = this.update;

        if (columnData.tickets.length) {
            ticketsTemplate = columnData.tickets.map(function(ticket, index) {
                return (<Ticket key={index}
                                boardId={boardId}
                                columnId={columnId}
                                ticketId={index}
                                updateAction={updateAction}
                                selectedTicket={selectedTicket}/>);
            });
        }

        if (this.state.colEditing) {
            colHeader = (
                <div className="col-header">
                    <input type="text"
                           className="flex-input-small flex-width-70"
                           defaultValue={columnData.title}
                           ref={this.columnNameInput}
                           placeholder="New column name..."/>
                    <button className="flex-button-small add-button" onClick={this.saveColumnTitle}>Save</button>
                </div>
            );
        }

        if (this.state.colAddTicket) {
            colHeader = (
                <div className="col-header">
                    {columnData.title}
                    <div className="column-tools">
                        <button className="tool-item remove" onClick={this.cancelAddTicket}>&nbsp;</button>
                    </div>
                </div>
            );

            extraColumnElement = (
                <div className="col-item special-item">
                    <input type="text"
                           ref={this.newTicketTitleInput}
                           className="flex-input-small flex-full-row"
                           placeholder="Ticket title..."/>
                   {this.getTicketColorSelect(null)}
                    <textarea
                        ref={this.newTicketDescriptionInput}
                        placeholder="Ticket description..."
                        className="flex-input-small flex-full-row"></textarea>
                    <button
                        onClick={this.createNewTicket}
                        className="flex-button-small flex-full-row">Create ticket</button>
                </div>
            )
        }

        if (!this.state.colAddTicket && !this.state.colEditing) {
            colHeader = (
                <div className="col-header">
                    {columnData.title}
                    <div className="column-tools">
                        <button className="tool-item add" onClick={this.toggleColumnAddTicket}>&nbsp;</button>
                        <button className="tool-item edit" onClick={this.toggleColumnTitleEdit}>&nbsp;</button>
                        <button className="tool-item delete" onClick={this.removeColumn}>&nbsp;</button>
                    </div>
                </div>
            );
        }

        return (
            <div className={this.isSelectedColumn() ? 'board-col current' : 'board-col'}>
                <div className="board-col-content">
                    {colHeader}
                    <div className="col-items-holder">
                        <div className="col-items-wrap">
                            {extraColumnElement}
                            {ticketsTemplate}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    getTicketColorSelect(ticket: TicketType) {
        let ticketColor: string = ticket ? ticket.color : 'none',
            selectOptions: JSX.Element[] = [];

        getColorsData().forEach(function(color: ColorDataType, index: number) {
            selectOptions.push(<option key={index} value={color.handle} >{color.title}</option>);
        });

        return (
            <select ref={this.newTicketColorSelect} defaultValue={ticketColor} className="flex-input-small">
                {selectOptions}
            </select>
        );
    }

    isSelectedColumn(): boolean {
        let selectedTicket: SelectedTicketDataType = this.props.selectedTicket;

        return selectedTicket && selectedTicket.column === this.props.columnId;
    }

    update() {
        this.setState({ticketUpdated: !this.state.ticketUpdated});
    }

    removeColumn() {
        removeBoardColumn(this.props.boardId, this.props.columnId);
        this.props.updateAction();
    }

    toggleColumnTitleEdit() {
        this.setState({colEditing: true, colAddTicket: false});
    }

    toggleColumnAddTicket() {
        this.setState({colEditing: false, colAddTicket: true});
    }

    cancelAddTicket() {
        this.setState({colEditing: false, colAddTicket: false});
    }

    saveColumnTitle() {
        let newColumnName: string = this.columnNameInput.current.value,
            originalColumnName: string = this.columnNameInput.current.defaultValue;

        if (newColumnName === originalColumnName || isValidColumnName(this.props.boardId, newColumnName)) {
            updateBoardColumnName(this.props.boardId, this.props.columnId, newColumnName);
            this.setState({colEditing: false, colAddTicket: false});
            this.props.updateAction();
        }
    }

    createNewTicket() {
        if (
            isValidTicketTitle(this.newTicketTitleInput.current.value) &&
            isValidTicketDescription(this.newTicketDescriptionInput.current.value)
        ) {
            addTicketToBoardColumn(
                this.props.boardId,
                this.props.columnId,
                this.newTicketTitleInput.current.value,
                this.newTicketDescriptionInput.current.value,
                this.newTicketColorSelect.current.value
            );
            this.setState({colEditing: false, colAddTicket: false});
            this.props.updateAction();
        }
    }
}