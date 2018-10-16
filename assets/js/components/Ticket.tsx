import * as React from "react";
import {connect} from "react-redux";
import {collapsedTicketDescriptionLength,
        getColorSelect,
        ticketTitleMaxLength} from "../helpers/DomElementsHelper";
import {isDownToggled, isEditToggled, isLeftToggled, isRightToggled, isUpToggled} from "../helpers/NavigationHelper";
import {SelectedTicketDataType, TicketType} from "../helpers/TypesHelper";
import {getTicketForBoardColumn,
        isValidTicketDescription,
        isValidTicketTitle,
        moveDown,
        moveLeft,
        moveRight,
        moveUp,
        removeBoardColumnTicket,
        updateBoardColumnTicketData} from "../service/BoardDataService";
import {actionTypeSetSelectedTicket} from "./UiContainer";

interface TicketPropsType {
    boardId: number;
    columnId: number;
    ticketId: number;
    updateAction: () => void;
    selectedTicket: SelectedTicketDataType;
    onChangeCurrentTicket: (selectedTicket: SelectedTicketDataType) => void;
}

interface TicketStateType {
    ticketEditing: boolean;
}

class Ticket extends React.PureComponent<TicketPropsType, TicketStateType> {

    private static getTruncatedDescription(description: string): string {
        if (description.length <= collapsedTicketDescriptionLength) {
            return description;
        }

        return description.substr(0, collapsedTicketDescriptionLength) + "...";
    }
    private ticketTitleInput: React.RefObject<HTMLInputElement>;
    private ticketDescriptionInput: React.RefObject<HTMLTextAreaElement>;
    private newTicketColorSelect: React.RefObject<HTMLSelectElement>;

    constructor(props: TicketPropsType, state: TicketStateType) {
        super(props, state);

        this.state = {
            ticketEditing: false,
        };
        this.ticketTitleInput = React.createRef<HTMLInputElement>();
        this.ticketDescriptionInput = React.createRef<HTMLTextAreaElement>();
        this.newTicketColorSelect = React.createRef<HTMLSelectElement>();
        this.deleteTicket = this.deleteTicket.bind(this);
        this.toggleUpdateTicket = this.toggleUpdateTicket.bind(this);
        this.updateTicket = this.updateTicket.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.isSelectedTicket = this.isSelectedTicket.bind(this);
        this.makeSelectedTicket = this.makeSelectedTicket.bind(this);
        this.getTicketEditingTemplate = this.getTicketEditingTemplate.bind(this);
        this.getTicketTemplate = this.getTicketTemplate.bind(this);
        this.getCurrentTicketData = this.getCurrentTicketData.bind(this);
    }

    public render(): React.ReactNode {
        const ticketData: TicketType = getTicketForBoardColumn(
            this.props.boardId,
            this.props.columnId,
            this.props.ticketId,
            ),
            isSelectedTicket: boolean = this.isSelectedTicket(),
            className: string = isSelectedTicket
                ? "col-item current " + ticketData.color
                : "col-item " + ticketData.color;

        if (isSelectedTicket) {
            document.onkeydown = this.handleKeyPress;
        }

        if (this.state.ticketEditing) {
            return this.getTicketEditingTemplate(ticketData, className);
        }

        return this.getTicketTemplate(ticketData, className, isSelectedTicket);
    }

    private getTicketTemplate(ticketData: TicketType, className: string, isSelectedTicket: boolean): JSX.Element {
        const descriptionText: string = isSelectedTicket
                ? ticketData.description
                : Ticket.getTruncatedDescription(ticketData.description);

        return (
            <div
                className={className}
                onClick={this.makeSelectedTicket}
            >
                <div className="col-item-wrap">
                    <div className="item-header">
                        <div className="item-title">{ticketData.title}</div>
                        <div className="item-tools">
                            <div className="tool-item edit" onClick={this.toggleUpdateTicket}>&nbsp;</div>
                            <div className="tool-item delete" onClick={this.deleteTicket}>&nbsp;</div>
                        </div>
                    </div>
                    <div className="item-description">
                        {descriptionText}
                    </div>
                </div>
            </div>
        );
    }

    private getTicketEditingTemplate(ticketData: TicketType, className: string): JSX.Element {
        return (
            <div
                className={className}
                onClick={this.makeSelectedTicket}
            >
                <input
                    type="text"
                    maxLength={ticketTitleMaxLength}
                    ref={this.ticketTitleInput}
                    defaultValue={ticketData.title}
                    className="flex-input-small flex-full-row"
                    placeholder="Ticket title..."
                />
                {getColorSelect(ticketData.color, this.newTicketColorSelect)}
                <textarea
                    ref={this.ticketDescriptionInput}
                    placeholder="Ticket description..."
                    defaultValue={ticketData.description}
                    className="flex-input-small flex-full-row"
                />
                <button
                    onClick={this.updateTicket}
                    className="flex-button-small flex-full-row"
                >
                    Update ticket
                </button>
            </div>
        );
    }

    private isSelectedTicket(): boolean {
        const selectedTicket: SelectedTicketDataType = this.props.selectedTicket;

        return selectedTicket &&
            selectedTicket.column === this.props.columnId &&
            selectedTicket.ticket === this.props.ticketId;
    }

    private deleteTicket(e: React.MouseEvent) {
        e.stopPropagation();
        removeBoardColumnTicket(this.props.boardId, this.props.columnId, this.props.ticketId);
        this.props.updateAction();
    }

    private toggleUpdateTicket(e: React.MouseEvent) {
        e.stopPropagation();
        this.setState({ticketEditing: true});
    }

    private updateTicket(e: React.MouseEvent) {
        e.stopPropagation();

        const newTicketTitle: string = this.ticketTitleInput.current.value,
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
                newTicketColor,
            );
            this.setState({ticketEditing: false});
        }
    }

    private makeSelectedTicket() {
        const selectedTicket: SelectedTicketDataType = this.getCurrentTicketData();

        this.props.onChangeCurrentTicket(selectedTicket);
    }

    private getCurrentTicketData(): SelectedTicketDataType {
        return {
            column: this.props.columnId,
            ticket: this.props.ticketId,
        };
    }

    private handleKeyPress(e: KeyboardEvent) {
        let selectedTicketUpdatedData: SelectedTicketDataType = this.getCurrentTicketData();

        if (isUpToggled(e)) {
            selectedTicketUpdatedData = moveUp(this.props.boardId, this.props.columnId, this.props.ticketId);
        } else if (isDownToggled(e)) {
            selectedTicketUpdatedData = moveDown(this.props.boardId, this.props.columnId, this.props.ticketId);
        } else if (isLeftToggled(e)) {
            selectedTicketUpdatedData = moveLeft(this.props.boardId, this.props.columnId, this.props.ticketId);
        } else if (isRightToggled(e)) {
            selectedTicketUpdatedData = moveRight(this.props.boardId, this.props.columnId, this.props.ticketId);
        } else if (isEditToggled(e)) {
            this.setState({ticketEditing: true});
        }

        if (this.getCurrentTicketData() !== selectedTicketUpdatedData) {
            this.props.onChangeCurrentTicket(selectedTicketUpdatedData);
        }
    }
}

export default connect(
    (state) => ({}),
    (dispatch) => ({
        onChangeCurrentTicket: (selectedTicket: SelectedTicketDataType) => {
            dispatch(
                {
                    selectedTicket,
                    type: actionTypeSetSelectedTicket,
                });
        },
    }),
)(Ticket);
