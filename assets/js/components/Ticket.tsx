import * as React from 'react'
import * as ReactDOM from 'react-dom';
import Board from './Board';
import {TicketType, SelectedTicketDataType, ColorDataType} from '../helpers/TypesHelper';
import {getTicketForBoardColumn,
        removeBoardColumnTicket,
        isValidTicketTitle,
        isValidTicketDescription,
        updateBoardColumnTicketData,
        getColorsData,
        moveLeft,
        moveRight,
        moveUp,
        moveDown} from '../helpers/LocalStorageHelper';
import {RefObject} from 'react';

export interface TicketProps {
    boardId: number;
    columnId: number;
    ticketId: number;
    updateAction: Function;
    selectedTicket: SelectedTicketDataType;
}

export default class Ticket extends React.PureComponent<TicketProps> {
    private ticketTitleInput: RefObject<HTMLInputElement>;
    private ticketDescriptionInput: RefObject<HTMLTextAreaElement>;
    private newTicketColorSelect: RefObject<HTMLSelectElement>;
    state: any;

    constructor(props: any, state: any) {
        super(props, state);

        this.state = {
            ticketEditing: false,
        };
        this.deleteTicket = this.deleteTicket.bind(this);
        this.toggleUpdateTicket = this.toggleUpdateTicket.bind(this);
        this.updateTicket = this.updateTicket.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.isSelectedTicket = this.isSelectedTicket.bind(this);
        this.makeSelectedTicket = this.makeSelectedTicket.bind(this);
        this.getTicketColorSelect = this.getTicketColorSelect.bind(this);
    }

    render(): React.ReactNode {
        let ticketData: TicketType = getTicketForBoardColumn(this.props.boardId, this.props.columnId, this.props.ticketId),
            isSelectedTicket: boolean = this.isSelectedTicket();

        if (isSelectedTicket) {
            document.onkeydown = this.handleKeyPress;
        }

        this.ticketTitleInput = React.createRef<HTMLInputElement>();
        this.ticketDescriptionInput = React.createRef<HTMLTextAreaElement>();
        this.newTicketColorSelect = React.createRef<HTMLSelectElement>();

        if (this.state.ticketEditing) {
            return (
                <div className={isSelectedTicket ? 'col-item current ' + ticketData.color : 'col-item ' + ticketData.color} onClick={this.makeSelectedTicket}>
                    <input type="text"
                           ref={this.ticketTitleInput}
                           defaultValue={ticketData.title}
                           className="flex-input-small flex-full-row"
                           placeholder="Ticket title..."/>
                    {this.getTicketColorSelect(ticketData)}
                    <textarea
                        ref={this.ticketDescriptionInput}
                        placeholder="Ticket description..."
                        defaultValue={ticketData.description}
                        className="flex-input-small flex-full-row">&#8203;</textarea>
                    <button
                        onClick={this.updateTicket}
                        className="flex-button-small flex-full-row">Update ticket</button>
                </div>
            );
        }

        return (
            <div className={isSelectedTicket ? 'col-item current ' + ticketData.color : 'col-item ' + ticketData.color} onClick={this.makeSelectedTicket}>
                <div className="col-item-wrap">
                    <div className="item-header">
                        <div className="item-title">{ticketData.title}</div>
                        <div className="item-tools">
                            <div className="tool-item edit" onClick={this.toggleUpdateTicket}>&nbsp;</div>
                            <div className="tool-item delete" onClick={this.deleteTicket}>&nbsp;</div>
                        </div>
                    </div>
                    <div className="item-description">
                        {ticketData.description}
                    </div>
                </div>
            </div>
        );
    }

    getTicketColorSelect(ticket: TicketType): React.ReactNode {
        let ticketColor: string = ticket ? ticket.color : 'none',
            selectOptions: any = [];

        getColorsData().forEach(function(color: ColorDataType, index: number) {
            selectOptions.push(<option key={index} value={color.handle}>{color.title}</option>);
        });

        return (
            <select ref={this.newTicketColorSelect} defaultValue={ticketColor} className="flex-input-small">
                {selectOptions}
            </select>
        );
    }

    isSelectedTicket(): boolean {
        let selectedTicket: SelectedTicketDataType = this.props.selectedTicket;

        return selectedTicket &&
            selectedTicket.column === this.props.columnId &&
            selectedTicket.ticket === this.props.ticketId;
    }

    deleteTicket(e: React.MouseEvent) {
        e.stopPropagation();
        removeBoardColumnTicket(this.props.boardId, this.props.columnId, this.props.ticketId);
        this.props.updateAction();
    }

    toggleUpdateTicket(e: React.MouseEvent) {
        e.stopPropagation();
        this.setState({ticketEditing: true});
    }

    updateTicket(e: React.MouseEvent) {
        e.stopPropagation();

        let newTicketTitle: string = this.ticketTitleInput.current.value,
            oldTicketTitle: string = this.ticketTitleInput.current.defaultValue,
            newTicketDescription: string = this.ticketDescriptionInput.current.value,
            oldTicketDescription: string = this.ticketDescriptionInput.current.defaultValue,
            newTicketColor: string = this.newTicketColorSelect.current.value;

        if (
            (newTicketTitle === oldTicketTitle || isValidTicketTitle(newTicketTitle)) &&
            (newTicketDescription === oldTicketDescription || isValidTicketDescription(newTicketDescription))
        ) {
            updateBoardColumnTicketData(
                this.props.boardId,
                this.props.columnId,
                this.props.ticketId,
                newTicketTitle,
                newTicketDescription,
                newTicketColor
            );
            this.setState({ticketEditing: false});
        }
    }

    makeSelectedTicket() {
        let selectedTicket = {
            column: this.props.columnId,
            ticket: this.props.ticketId,
        };

        ReactDOM.render(<Board boardId={this.props.boardId} selectedTicket={selectedTicket}/>, document.getElementById("content"));
    }

    handleKeyPress(e: KeyboardEvent) {
        if (e.keyCode === 38) {
            moveUp(this.props.boardId, this.props.columnId, this.props.ticketId);
        } else if (e.keyCode === 40) {
            moveDown(this.props.boardId, this.props.columnId, this.props.ticketId);
        } else if (e.keyCode === 37) {
            moveLeft(this.props.boardId, this.props.columnId, this.props.ticketId);
        } else if (e.keyCode === 39) {
            moveRight(this.props.boardId, this.props.columnId, this.props.ticketId);
        } else if (e.keyCode === 13) {
            this.setState({ticketEditing: true});
        }
    }
}