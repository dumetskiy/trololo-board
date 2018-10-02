import * as React from "react";
import * as ReactDOM from "react-dom";
import Board from "../components/Board";
import {columnNameMaxLength, getContentElement, ticketTitleMaxLength} from "../helpers/DomElementsHelper";
import {addHistoryStep} from "../helpers/HistoryHelper";
import {get, set} from "../helpers/LocalStorageHelper";
import {BoardsDataType, BoardType, ColumnType, SelectedTicketDataType, TicketType} from "../helpers/TypesHelper";

const defaultColumnName = "New Tasks";

export function getBoards(): BoardType[] {
    return get().boards;
}

export function getBoardById(id: number): BoardType {
    return get().boards[id];
}

export function removeBoardById(id: number) {
    const boardsData: BoardsDataType = get();

    delete boardsData.boards[id];
    set(boardsData);
}

export function createBoard(title: string) {
    const boardsData: BoardsDataType = get();

    boardsData.boards[Object.keys(boardsData.boards).length] =  {
        cols: [
            {
                tickets: [],
                title: defaultColumnName,
            },
        ],
        title,
    };
    set(boardsData);
}

export function setBoardData(boardId: number, boardData: BoardType) {
    const boardsData: BoardsDataType = get(),
        selectedTicket: SelectedTicketDataType = {
            column: -1,
            ticket: -1,
        };

    boardsData.boards[boardId] = boardData;
    set(boardsData);
    ReactDOM.render(
        <Board boardId={boardId} selectedTicket={selectedTicket}/>,
        getContentElement(),
    );
}

export function setNameForBoardById(boardId: number, name: string) {
    const boardsData: BoardsDataType = get();

    boardsData.boards[boardId].title = name;
    set(boardsData);
}

export function isValidBoardName(boardName: string): boolean {
    if (boardName.length) {
        get().boards.forEach((board: BoardType) => {
            if (board.title.toLowerCase() === boardName.toLowerCase()) {
                alert("Board with the same name already exists!");

                return false;
            }
        });
    } else {
        alert("Empty board name provided!");

        return false;
    }

    return true;
}

export function isValidColumnName(boardId: number, columnName: string): boolean {
    if (columnName.length) {
        if (columnName.length <= columnNameMaxLength) {
            get().boards[boardId].cols.forEach((column: ColumnType) => {
                if (column.title.toLowerCase() === columnName.toLowerCase()) {
                    alert("Column with the same name already exists!");

                    return false;
                }
            });
        } else {
            alert("Maximum column name length exceeded!");

            return false;
        }
    } else {
        alert("Empty column name provided!");

        return false;
    }

    return true;
}

export function addColumnToBoard(boardId: number, columnName: string) {
    const boardsData: BoardsDataType = get();

    boardsData.boards[boardId].cols[Object.keys(boardsData.boards[boardId].cols).length] = {
        tickets: [],
        title: columnName,
    };
    set(boardsData);
    addHistoryStep(boardsData.boards[boardId]);
}

export function getColumnForBoard(boardId: number, columnId: number): ColumnType {
    return get().boards[boardId].cols[columnId];
}

export function updateBoardColumnName(boardId: number, columnId: number, newTitle: string) {
    const boardsData: BoardsDataType = get();

    boardsData.boards[boardId].cols[columnId].title = newTitle;
    set(boardsData);
    addHistoryStep(boardsData.boards[boardId]);
}

export function removeBoardColumn(boardId: number, columnId: number) {
    const boardsData: BoardsDataType = get();

    delete boardsData.boards[boardId].cols[columnId];
    boardsData.boards[boardId].cols = boardsData.boards[boardId].cols.filter((e) => e);
    set(boardsData);
    addHistoryStep(boardsData.boards[boardId]);
}

export function getTicketForBoardColumn(boardId: number, columnId: number, ticketId: number): TicketType {
    return get().boards[boardId].cols[columnId].tickets[ticketId];
}

export function addTicketToBoardColumn(boardId: number,
                                       columnId: number,
                                       ticketTitle: string,
                                       ticketDescription: string,
                                       ticketColor: string) {
    const boardsData: BoardsDataType = get();

    boardsData.boards[boardId].cols[columnId].tickets[
        Object.keys(boardsData.boards[boardId].cols[columnId].tickets).length
        ] = {
        color: ticketColor,
        description: ticketDescription,
        title: ticketTitle,
    };
    set(boardsData);
    addHistoryStep(boardsData.boards[boardId]);
}

export function isValidTicketTitle(ticketTitle: string): boolean {
    if (ticketTitle.length) {
        if (ticketTitle.length <= ticketTitleMaxLength) {
            return true;
        } else {
            alert("Maximum ticket title length exceeded!");

            return false;
        }
    } else {
        alert("Empty ticket title provided!");

        return false;
    }
}

export function isValidTicketDescription(ticketDescription: string): boolean {
    if (ticketDescription.length) {
        return true;
    } else {
        alert("Empty ticket description provided!");

        return false;
    }
}

export function removeBoardColumnTicket(boardId: number, columnId: number, ticketId: number) {
    const boardsData: BoardsDataType = get();

    delete boardsData.boards[boardId].cols[columnId].tickets[ticketId];
    boardsData.boards[boardId].cols[columnId].tickets = boardsData.boards[boardId].cols[columnId].tickets.filter(
        (e) => e,
    );
    set(boardsData);
    addHistoryStep(boardsData.boards[boardId]);
}

export function updateBoardColumnTicketData(boardId: number,
                                            columnId: number,
                                            ticketId: number,
                                            newTitle: string,
                                            newDescription: string,
                                            newColor: string) {
    const boardsData: BoardsDataType = get();

    boardsData.boards[boardId].cols[columnId].tickets[ticketId] = {
        color: newColor,
        description: newDescription,
        title: newTitle,
    };
    set(boardsData);
    addHistoryStep(boardsData.boards[boardId]);
}

export function moveLeft(boardId: number, columnId: number, ticketId: number) {
    if (columnId > 0) {
        const boardsData: BoardsDataType = get(),
            ticketData: TicketType = boardsData.boards[boardId].cols[columnId].tickets[ticketId],
            newColumn: ColumnType = boardsData.boards[boardId].cols[columnId - 1],
            newTicketId: number = newColumn.tickets.length > ticketId ? ticketId : newColumn.tickets.length;

        delete boardsData.boards[boardId].cols[columnId].tickets[ticketId];
        boardsData.boards[boardId].cols[columnId].tickets = boardsData.boards[boardId].cols[columnId].tickets.filter(
            (e) => e,
        );
        boardsData.boards[boardId].cols[columnId - 1].tickets.splice(newTicketId, 0, ticketData);
        set(boardsData);
        addHistoryStep(boardsData.boards[boardId]);
        updateCurrentState(boardId, columnId - 1, newTicketId);
    }
}

export function moveRight(boardId: number, columnId: number, ticketId: number) {
    const boardsData: BoardsDataType = get();

    if (columnId + 1 < boardsData.boards[boardId].cols.length) {
        const ticketData: TicketType = boardsData.boards[boardId].cols[columnId].tickets[ticketId],
            newColumn: ColumnType = boardsData.boards[boardId].cols[columnId + 1],
            newTicketId: number = newColumn.tickets.length > ticketId ? ticketId : newColumn.tickets.length;

        delete boardsData.boards[boardId].cols[columnId].tickets[ticketId];
        boardsData.boards[boardId].cols[columnId].tickets = boardsData.boards[boardId].cols[columnId].tickets.filter(
            (e) => e,
        );
        boardsData.boards[boardId].cols[columnId + 1].tickets.splice(newTicketId, 0, ticketData);
        set(boardsData);
        addHistoryStep(boardsData.boards[boardId]);
        updateCurrentState(boardId, columnId + 1, newTicketId);
    }
}

export function moveUp(boardId: number, columnId: number, ticketId: number) {
    const boardsData: BoardsDataType = get();

    if (ticketId > 0) {
        const ticketData: TicketType = boardsData.boards[boardId].cols[columnId].tickets[ticketId],
            secondTicketData: TicketType = boardsData.boards[boardId].cols[columnId].tickets[ticketId - 1];

        boardsData.boards[boardId].cols[columnId].tickets[ticketId] = secondTicketData;
        boardsData.boards[boardId].cols[columnId].tickets[ticketId - 1] = ticketData;
        set(boardsData);
        addHistoryStep(boardsData.boards[boardId]);
        updateCurrentState(boardId, columnId, ticketId - 1);
    }
}

export function moveDown(boardId: number, columnId: number, ticketId: number) {
    const boardsData: BoardsDataType = get();

    if (ticketId + 1 < boardsData.boards[boardId].cols[columnId].tickets.length) {
        const ticketData: TicketType = boardsData.boards[boardId].cols[columnId].tickets[ticketId],
            secondTicketData: TicketType = boardsData.boards[boardId].cols[columnId].tickets[ticketId + 1];

        boardsData.boards[boardId].cols[columnId].tickets[ticketId] = secondTicketData;
        boardsData.boards[boardId].cols[columnId].tickets[ticketId + 1] = ticketData;
        set(boardsData);
        addHistoryStep(boardsData.boards[boardId]);
        updateCurrentState(boardId, columnId, ticketId + 1);
    }
}

function updateCurrentState(boardId: number, columnId: number, ticketId: number) {
    const selectedTicket = {
        column: columnId,
        ticket: ticketId,
    };

    ReactDOM.render(
        <Board boardId={boardId} selectedTicket={selectedTicket}/>,
        getContentElement(),
    );
}
