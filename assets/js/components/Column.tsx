import * as React from "react";
import {columnNameMaxLength, getColorSelect, ticketTitleMaxLength} from "../helpers/DomElementsHelper";
import {ColumnType, SelectedTicketDataType} from "../helpers/TypesHelper";
import {
    addTicketToBoardColumn,
    isValidColumnName,
    isValidTicketDescription,
    isValidTicketTitle,
    removeBoardColumn,
    updateBoardColumnName,
} from "../service/BoardDataService";
import Ticket from "./Ticket";

interface ColumnPropsType {
    boardId: number;
    columnId: number;
    columnData: ColumnType;
    updateAction: () => void;
    selectedTicket: SelectedTicketDataType;
}

interface ColumnStateType {
    colEditing: boolean;
    colAddTicket: boolean;
    ticketUpdated: boolean;
}

export default class Column extends React.PureComponent<ColumnPropsType, ColumnStateType>  {
    private columnNameInput: React.RefObject<HTMLInputElement>;
    private newTicketTitleInput: React.RefObject<HTMLInputElement>;
    private newTicketDescriptionInput: React.RefObject<HTMLTextAreaElement>;
    private newTicketColorSelect: React.RefObject<HTMLSelectElement>;

    private constructor(props: ColumnPropsType, state: ColumnStateType) {
        super(props, state);

        this.state = {
            colAddTicket: false,
            colEditing: false,
            ticketUpdated: false,
        };
        this.columnNameInput = React.createRef();
        this.newTicketTitleInput = React.createRef();
        this.newTicketDescriptionInput = React.createRef();
        this.newTicketColorSelect = React.createRef();
        this.removeColumn = this.removeColumn.bind(this);
        this.toggleColumnTitleEdit = this.toggleColumnTitleEdit.bind(this);
        this.saveColumnTitle = this.saveColumnTitle.bind(this);
        this.toggleColumnAddTicket = this.toggleColumnAddTicket.bind(this);
        this.cancelAddTicket = this.cancelAddTicket.bind(this);
        this.createNewTicket = this.createNewTicket.bind(this);
        this.update = this.update.bind(this);
        this.isSelectedColumn = this.isSelectedColumn.bind(this);
        this.getColumnHeaderTemplate = this.getColumnHeaderTemplate.bind(this);
        this.getTicketAddForm = this.getTicketAddForm.bind(this);
    }

    public render(): React.ReactNode {
        const columnId: number = this.props.columnId,
            boardId: number = this.props.boardId,
            selectedTicket: SelectedTicketDataType = this.props.selectedTicket,
            columnData: ColumnType = this.props.columnData,
            colHeader: JSX.Element = this.getColumnHeaderTemplate(columnData),
            updateAction: () => void = this.update;

        let ticketsTemplate: JSX.Element[] = [],
            extraColumnElement: JSX.Element = null;

        if (columnData.tickets.length) {
            ticketsTemplate = columnData.tickets.map((ticket, index) => {
                return (
                    <Ticket
                        key={index}
                        boardId={boardId}
                        columnId={columnId}
                        ticketId={index}
                        updateAction={updateAction}
                        selectedTicket={selectedTicket}
                    />
                );
            });
        }

        if (this.state.colAddTicket) {
            extraColumnElement = this.getTicketAddForm();
        }

        return (
            <div className={this.isSelectedColumn() ? "board-col current" : "board-col"}>
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

    private getTicketAddForm(): JSX.Element {
        return (
            <div className="col-item special-item">
                <input
                    type="text"
                    maxLength={ticketTitleMaxLength}
                    ref={this.newTicketTitleInput}
                    className="flex-input-small flex-full-row"
                    placeholder="Ticket title..."
                />
                {getColorSelect("", this.newTicketColorSelect)}
                <textarea
                    ref={this.newTicketDescriptionInput}
                    placeholder="Ticket description..."
                    className="flex-input-small flex-full-row"
                />
                <button
                    onClick={this.createNewTicket}
                    className="flex-button-small flex-full-row"
                >
                    Create ticket
                </button>
            </div>
        );
    }

    private getColumnHeaderTemplate(columnData: ColumnType): JSX.Element {
        if (this.state.colEditing) {
            return (
                <div className="col-header">
                    <input
                        type="text"
                        maxLength={columnNameMaxLength}
                        className="flex-input-small flex-width-70"
                        defaultValue={columnData.title}
                        ref={this.columnNameInput}
                        placeholder="New column name..."
                    />
                    <button className="flex-button-small add-button" onClick={this.saveColumnTitle}>
                        Save
                    </button>
                </div>
            );
        }

        if (this.state.colAddTicket) {
            return (
                <div className="col-header">
                    <div className="column-title">
                        {columnData.title}
                    </div>
                    <div className="column-tools">
                        <button className="tool-item remove" onClick={this.cancelAddTicket}>
                            &nbsp;
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="col-header">
                <div className="column-title">
                    {columnData.title}
                </div>
                <div className="column-tools">
                    <button className="tool-item add" onClick={this.toggleColumnAddTicket}>&nbsp;</button>
                    <button className="tool-item edit" onClick={this.toggleColumnTitleEdit}>&nbsp;</button>
                    <button className="tool-item delete" onClick={this.removeColumn}>&nbsp;</button>
                </div>
            </div>
        );
    }

    private isSelectedColumn(): boolean {
        const selectedTicket: SelectedTicketDataType = this.props.selectedTicket;

        return selectedTicket && selectedTicket.column === this.props.columnId;
    }

    private update() {
        this.setState({ticketUpdated: !this.state.ticketUpdated});
    }

    private removeColumn() {
        removeBoardColumn(this.props.boardId, this.props.columnId);
        this.props.updateAction();
    }

    private toggleColumnTitleEdit() {
        this.setState({colEditing: true, colAddTicket: false});
    }

    private toggleColumnAddTicket() {
        this.setState({colEditing: false, colAddTicket: true});
    }

    private cancelAddTicket() {
        this.setState({colEditing: false, colAddTicket: false});
    }

    private saveColumnTitle() {
        const newColumnName: string = this.columnNameInput.current.value,
            originalColumnName: string = this.columnNameInput.current.defaultValue;

        if (newColumnName === originalColumnName || isValidColumnName(this.props.boardId, newColumnName)) {
            updateBoardColumnName(this.props.boardId, this.props.columnId, newColumnName);
            this.setState({colEditing: false, colAddTicket: false});
            this.props.updateAction();
        }
    }

    private createNewTicket() {
        if (
            isValidTicketTitle(this.newTicketTitleInput.current.value) &&
            isValidTicketDescription(this.newTicketDescriptionInput.current.value)
        ) {
            addTicketToBoardColumn(
                this.props.boardId,
                this.props.columnId,
                this.newTicketTitleInput.current.value,
                this.newTicketDescriptionInput.current.value,
                this.newTicketColorSelect.current.value,
            );
            this.setState({colEditing: false, colAddTicket: false});
            this.props.updateAction();
        }
    }
}
