import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import Board from './Board';
import {getTicketForBoardColumn,
        removeBoardColumnTicket,
        pdateBoardColumnTicketData,
        isValidTicketTitle,
        isValidTicketDescription,
        updateBoardColumnTicketData,
        getColorsData,
        moveLeft,
        moveRight,
        moveUp,
        moveDown} from '../helpers/LocalStorageHelper';

export default class Ticket extends Component {
    constructor() {
        super();

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

    getTicketColorSelect(ticket) {
        var ticketColor = ticket ? ticket.color : 'none',
            selectOptions = [];

        getColorsData().forEach(function(color, index, arr) {
            selectOptions.push(<option key={index} value={color.handle}>{color.title}</option>);
        });

        return (
            <select ref={this.newTicketColorSelect} defaultValue={ticketColor} className="flex-input-small">
                {selectOptions}
            </select>
        );
    }

    render() {
        var ticketData = getTicketForBoardColumn(this.props.boardid, this.props.columnid, this.props.ticketid),
            itemContent = '',
            isSelectedTicket = this.isSelectedTicket();

        this.ticketTitleInput = React.createRef();
        this.ticketDescriptionInput = React.createRef();
        this.newTicketColorSelect = React.createRef();

        if (isSelectedTicket) {
            document.onkeydown = this.handleKeyPress;
        }

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
                        className="flex-input-small flex-full-row"></textarea>
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

    isSelectedTicket() {
        var selectedTicket = this.props.selectedTicket;

        return selectedTicket &&
            selectedTicket.column === this.props.columnid &&
            selectedTicket.ticket === this.props.ticketid;
    }

    deleteTicket(e) {
        e.stopPropagation();
        removeBoardColumnTicket(this.props.boardid, this.props.columnid, this.props.ticketid);
        this.props.updateAction();
    }

    toggleUpdateTicket(e) {
        e.stopPropagation();
        this.setState({ticketEditing: true});
    }

    updateTicket(e) {
        e.stopPropagation();
        var newTicketTitle = this.ticketTitleInput.current.value,
            oldTicketTitle = this.ticketTitleInput.current.defaultValue,
            newTicketDescription = this.ticketDescriptionInput.current.value,
            oldTicketDescription = this.ticketDescriptionInput.current.defaultValue,
            newTicketColor = this.newTicketColorSelect.current.value;

        if (
            (newTicketTitle === oldTicketTitle || isValidTicketTitle(newTicketTitle)) &&
            (newTicketDescription === oldTicketDescription || isValidTicketDescription(newTicketDescription))
        ) {
            updateBoardColumnTicketData(
                this.props.boardid,
                this.props.columnid,
                this.props.ticketid,
                newTicketTitle,
                newTicketDescription,
                newTicketColor
            );
            this.setState({ticketEditing: false});
        }
    }

    makeSelectedTicket() {
        var selectedTicket = {
            column: this.props.columnid,
            ticket: this.props.ticketid,
        };

        ReactDOM.render(<Board boardid={this.props.boardid} selectedTicket={selectedTicket}/>, document.getElementById("content"));
    }

    handleKeyPress(e) {
        if (e.keyCode === 38) {
            moveUp(this.props.boardid, this.props.columnid, this.props.ticketid);
        } else if (e.keyCode === 40) {
            moveDown(this.props.boardid, this.props.columnid, this.props.ticketid);
        } else if (e.keyCode === 37) {
            moveLeft(this.props.boardid, this.props.columnid, this.props.ticketid);
        } else if (e.keyCode === 39) {
            moveRight(this.props.boardid, this.props.columnid, this.props.ticketid);
        } else if (e.keyCode === 13) {
            this.toggleUpdateTicket(e);
        }
    }
}