import * as React from 'react'
import * as ReactDOM from 'react-dom';
import Board from '../components/Board';
import {addHistoryStep} from './HistoryHelper'
import {TicketType, ColumnType, BoardType, BoardsDataType, SelectedTicketDataType} from './TypesHelper';

const LS_VAR_NAME = 'trololo-data';
const AUTO_COLUMN_NAME = 'New Tasks';
const COLORS_DATA = [
    {
        handle: 'none',
        title: 'No color',
    },
    {
        handle: 'red',
        title: 'Red',
    },
    {
        handle: 'green',
        title: 'Green',
    },
    {
        handle: 'blue',
        title: 'Blue',
    },
    {
        handle: 'purple',
        title: 'Purple',
    },
    {
        handle: 'yellow',
        title: 'Yellow',
    },
    {
        handle: 'orange',
        title: 'Orange',
    },
];

export function getColorsData() {
    return COLORS_DATA;
}

export function get(): BoardsDataType
{
    let boardsData: any = JSON.parse(localStorage.getItem(LS_VAR_NAME));

    if (!boardsData) {
        initBoardsData();
        boardsData = JSON.parse(localStorage.getItem(LS_VAR_NAME));
    }

    boardsData.boards = boardsData.boards.filter(function(e: BoardType){return e});

    return boardsData;
}

export function getBoardById(id: number): BoardType
{
    return get().boards[id];
}

export function removeBoardById(id: number)
{
    let boardsData: BoardsDataType = get();

    delete boardsData.boards[id];
    set(boardsData);
}

export function createBoard(title: string)
{
    let boardsData: BoardsDataType = get(),
        board: BoardType = {
            title: title,
            cols: [
                {
                    title: AUTO_COLUMN_NAME,
                    tickets: [],
                }
            ],
    };

    boardsData.boards[Object.keys(boardsData.boards).length] = board;
    set(boardsData);
}

export function setBoardData(boardId: number, boardData: BoardType) {
    let boardsData: BoardsDataType = get(),
        selectedTicket: SelectedTicketDataType = {
            column: -1,
            ticket: -1,
        };

    boardsData.boards[boardId] = boardData;
    set(boardsData);
    ReactDOM.render(<Board boardId={boardId} selectedTicket={selectedTicket}/>, document.getElementById("content"));
}

export function setNameForBoardById(boardId: number, name: string) {
    let boardsData: BoardsDataType = get();

    boardsData.boards[boardId].title = name;
    set(boardsData);
}

export function isValidBoardName(boardName: string): boolean {
    let isValidBoardName: boolean = true;

    if (boardName.length) {
        get().boards.forEach(function(board: BoardType, index: number) {
            if (board.title.toLowerCase() === boardName.toLowerCase()) {
                isValidBoardName = false;
                alert('Board with the same name already exists!');
            }
        });
    } else {
        isValidBoardName = false;
        alert('Empty board name provided!');
    }

    return isValidBoardName;
}

export function isValidColumnName(boardId: number, columnName: string): boolean {
    let isValidBoardName: boolean = true;

    if (columnName.length) {
        get().boards[boardId].cols.forEach(function(column: ColumnType, index: number) {
            if (column.title.toLowerCase() === columnName.toLowerCase()) {
                isValidBoardName = false;
                alert('Column with the same name already exists!');
            }
        });
    } else {
        isValidBoardName = false;
        alert('Empty column name provided!');
    }

    return isValidBoardName;
}

export function addColumnToBoard(boardId: number, columnName: string) {
    let boardsData: BoardsDataType = get();

    boardsData.boards[boardId].cols[Object.keys(boardsData.boards[boardId].cols).length] = {
        title: columnName,
        tickets: [],
    };
    set(boardsData);
    addHistoryStep(boardsData.boards[boardId]);
}

export function getColumnForBoard(boardId: number, columnId: number): ColumnType {
    return get().boards[boardId].cols[columnId];
}

export function updateBoardColumnName(boardId: number, columnId: number, newTitle: string) {
    let boardsData: BoardsDataType = get();

    boardsData.boards[boardId].cols[columnId].title = newTitle;
    set(boardsData);
    addHistoryStep(boardsData.boards[boardId]);
}

export function removeBoardColumn(boardId: number, columnId: number) {
    let boardsData: BoardsDataType = get();

    delete boardsData.boards[boardId].cols[columnId];
    boardsData.boards[boardId].cols = boardsData.boards[boardId].cols.filter(function(e){return e});
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
    let boardsData: BoardsDataType = get();

    boardsData.boards[boardId].cols[columnId].tickets[Object.keys(boardsData.boards[boardId].cols[columnId].tickets).length] = {
        title: ticketTitle,
        description: ticketDescription,
        color: ticketColor,
    };
    set(boardsData);
    addHistoryStep(boardsData.boards[boardId]);
}

export function isValidTicketTitle(ticketTitle: string): boolean {
    if (ticketTitle.length) {
        return true;
    } else {
        alert('Empty ticket title provided!');

        return false;
    }
}

export function isValidTicketDescription(ticketDescription: string): boolean {
    if (ticketDescription.length) {
        return true;
    } else {
        alert('Empty ticket description provided!');

        return false;
    }
}

export function removeBoardColumnTicket(boardId: number, columnId: number, ticketId: number) {
    let boardsData: BoardsDataType = get();

    delete boardsData.boards[boardId].cols[columnId].tickets[ticketId];
    boardsData.boards[boardId].cols[columnId].tickets = boardsData.boards[boardId].cols[columnId].tickets.filter(function(e){return e});
    set(boardsData);
    addHistoryStep(boardsData.boards[boardId]);
}

export function updateBoardColumnTicketData(boardId: number,
                                            columnId: number,
                                            ticketId: number,
                                            newTitle: string,
                                            newDescription: string,
                                            newColor: string) {
    let boardsData: BoardsDataType = get();

    boardsData.boards[boardId].cols[columnId].tickets[ticketId] = {
        title: newTitle,
        description: newDescription,
        color: newColor,
    };
    set(boardsData);
    addHistoryStep(boardsData.boards[boardId]);
}

export function moveLeft(boardId: number, columnId: number, ticketId: number) {
    if (columnId > 0) {
        let boardsData: BoardsDataType = get(),
            ticketData: TicketType = boardsData.boards[boardId].cols[columnId].tickets[ticketId],
            newColumn: ColumnType = boardsData.boards[boardId].cols[columnId - 1],
            newTicketId: number = newColumn.tickets.length - 1 > ticketId ? ticketId : newColumn.tickets.length - 1;

        delete boardsData.boards[boardId].cols[columnId].tickets[ticketId];
        boardsData.boards[boardId].cols[columnId].tickets = boardsData.boards[boardId].cols[columnId].tickets.filter(function(e){return e});
        boardsData.boards[boardId].cols[columnId - 1].tickets.splice(newTicketId, 0, ticketData);
        set(boardsData);
        addHistoryStep(boardsData.boards[boardId]);
        updateCurrentState(boardId, columnId - 1, newTicketId);
    }
}

export function moveRight(boardId: number, columnId: number, ticketId: number) {
    let boardsData: BoardsDataType = get();

    if (columnId + 1 < boardsData.boards[boardId].cols.length) {
        let ticketData: TicketType = boardsData.boards[boardId].cols[columnId].tickets[ticketId],
            newColumn: ColumnType = boardsData.boards[boardId].cols[columnId + 1],
            newTicketId: number = newColumn.tickets.length > ticketId ? ticketId : newColumn.tickets.length;

        delete boardsData.boards[boardId].cols[columnId].tickets[ticketId];
        boardsData.boards[boardId].cols[columnId].tickets = boardsData.boards[boardId].cols[columnId].tickets.filter(function(e){return e});
        boardsData.boards[boardId].cols[columnId + 1].tickets.splice(newTicketId, 0, ticketData);
        set(boardsData);
        addHistoryStep(boardsData.boards[boardId]);
        updateCurrentState(boardId, columnId + 1, newTicketId);
    }
}

export function moveUp(boardId: number, columnId: number, ticketId: number) {
    let boardsData: BoardsDataType = get();
    
    if (ticketId > 0) {
        let ticketData: TicketType = boardsData.boards[boardId].cols[columnId].tickets[ticketId],
            secondTicketData: TicketType = boardsData.boards[boardId].cols[columnId].tickets[ticketId - 1];

        boardsData.boards[boardId].cols[columnId].tickets[ticketId] = secondTicketData,
        boardsData.boards[boardId].cols[columnId].tickets[ticketId - 1] = ticketData;
        set(boardsData);
        addHistoryStep(boardsData.boards[boardId]);
        updateCurrentState(boardId, columnId, ticketId - 1);
    }
}

export function moveDown(boardId: number, columnId: number, ticketId: number) {
    let boardsData: BoardsDataType = get();
    
    if (ticketId + 1 < boardsData.boards[boardId].cols[columnId].tickets.length) {
        let ticketData: TicketType = boardsData.boards[boardId].cols[columnId].tickets[ticketId],
            secondTicketData: TicketType = boardsData.boards[boardId].cols[columnId].tickets[ticketId + 1];

        boardsData.boards[boardId].cols[columnId].tickets[ticketId] = secondTicketData,
        boardsData.boards[boardId].cols[columnId].tickets[ticketId + 1] = ticketData;
        set(boardsData);
        addHistoryStep(boardsData.boards[boardId]);
        updateCurrentState(boardId, columnId, ticketId + 1);
    }
}

function updateCurrentState(boardId: number, columnid: number, ticketid: number) {
    let selectedTicket = {
        column: columnid,
        ticket: ticketid,
    };

    ReactDOM.render(<Board boardId={boardId} selectedTicket={selectedTicket}/>, document.getElementById("content"));
}

function initBoardsData() {
    set({
        boards: [],
    });
}

function set(boardsData: BoardsDataType) {
    localStorage.setItem(LS_VAR_NAME, JSON.stringify(boardsData));
}
