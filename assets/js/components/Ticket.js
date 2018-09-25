import React, {Component} from 'react'
import {getTicketForBoardColumn, removeBoardColumnTicket} from '../helpers/LocalStorageHelper';

export default class Ticket extends Component {
    constructor() {
        super();

        this.state = {
            ticketEditing: false,
        };
        this.deleteTicket = this.deleteTicket.bind(this);
    }

    render() {
        var ticketData = getTicketForBoardColumn(this.props.boardid, this.props.columnid, this.props.ticketid);

        return (
            <div className="col-item">
                <div className="item-header">
                    <div className="item-title">{ticketData.title}</div>
                    <div className="item-tools">
                        <div className="tool-item edit">&nbsp;</div>
                        <div className="tool-item delete" onClick={this.deleteTicket}>&nbsp;</div>
                    </div>
                </div>
                <div className="item-description">
                    {ticketData.description}
                </div>
            </div>
        );
    }

    deleteTicket() {
        removeBoardColumnTicket(this.props.boardid, this.props.columnid, this.props.ticketid);
        this.props.updateAction();
    }
}