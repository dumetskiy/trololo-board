import {addHistoryStep} from './HistoryHelper'
import ReactDOM from "react-dom";
import React from "react";
import Board from '../components/Board';

const LS_VAR_NAME = 'trololo-data';
const AUTO_COLUMN_NAME = 'New Tasks'
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

export function get()
{
    var boardsData = JSON.parse(localStorage.getItem(LS_VAR_NAME));

    if (!boardsData) {
        initBoardsData();
        boardsData = JSON.parse(localStorage.getItem(LS_VAR_NAME));
    }

    boardsData.boards = boardsData.boards.filter(function(e){return e});

    return boardsData;
}

export function getBoardById(id)
{
    return get().boards[id];
}

export function removeBoardById(id)
{
    var boardsData = get();

    delete boardsData.boards[id];
    set(boardsData);
}

export function createBoard(title)
{
    var boardsData = get(),
        board = {
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

export function setBoardData(boardId, boardData) {
    var boardsData = get();

    boardsData.boards[boardId] = boardData;
    set(boardsData);
    ReactDOM.render(<Board boardid={boardId}/>, document.getElementById("content"));
}

export function setNameForBoardById(boardId, name) {
    var boardsData = get();

    boardsData.boards[boardId].title = name;
    set(boardsData);
}

export function isValidBoardName(boardName)
{
    var isValidBoardName = true;
    if (boardName.length) {
        get().boards.forEach(function(board, index, arr) {
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

export function isValidColumnName(boardId, columnName) {
    var isValidBoardName = true;

    if (columnName.length) {
        get().boards[boardId].cols.forEach(function(column, index, arr) {
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

export function addColumnToBoard(boardId, columnName) {
    var boardsData = get();

    boardsData.boards[boardId].cols[Object.keys(boardsData.boards[boardId].cols).length] = {
        title: columnName,
        tickets: [],
    };
    set(boardsData);
    addHistoryStep(boardsData.boards[boardId]);
}

export function getColumnForBoard(boardId, columnId) {
    return get().boards[boardId].cols[columnId];
}

export function updateBoardColumnName(boardId, columnId, newTitle) {
    var boardsData = get();

    boardsData.boards[boardId].cols[columnId].title = newTitle;
    set(boardsData);
    addHistoryStep(boardsData.boards[boardId]);
}

export function removeBoardColumn(boardId, columnId) {
    var boardsData = get();

    delete boardsData.boards[boardId].cols[columnId];
    boardsData.boards[boardId].cols = boardsData.boards[boardId].cols.filter(function(e){return e});
    set(boardsData);
    addHistoryStep(boardsData.boards[boardId]);
}

export function getTicketForBoardColumn(boardId, columnId, ticketId) {
    return get().boards[boardId].cols[columnId].tickets[ticketId];
}

export function addTicketToBoardColumn(boardId, columnId, ticketTitle, ticketDescription, ticketColor) {
    var boardsData = get();

    boardsData.boards[boardId].cols[columnId].tickets[Object.keys(boardsData.boards[boardId].cols[columnId].tickets).length] = {
        title: ticketTitle,
        description: ticketDescription,
        color: ticketColor,
    };
    set(boardsData);
    addHistoryStep(boardsData.boards[boardId]);
}

export function isValidTicketTitle(ticketTitle) {
    if (ticketTitle.length) {
        return true;
    } else {
        alert('Empty ticket title provided!');

        return false;
    }
}

export function isValidTicketDescription(ticketDescription) {
    if (ticketDescription.length) {
        return true;
    } else {
        alert('Empty ticket description provided!');

        return false;
    }
}

export function removeBoardColumnTicket(boardId, columnId, ticketId) {
    var boardsData = get();

    delete boardsData.boards[boardId].cols[columnId].tickets[ticketId];
    boardsData.boards[boardId].cols[columnId].tickets = boardsData.boards[boardId].cols[columnId].tickets.filter(function(e){return e});
    set(boardsData);
    addHistoryStep(boardsData.boards[boardId]);
}

export function updateBoardColumnTicketData(boardId, columnId, ticketId, newTitle, newDescription, newColor) {
    var boardsData = get();

    boardsData.boards[boardId].cols[columnId].tickets[ticketId] = {
        title: newTitle,
        description: newDescription,
        color: newColor,
    };
    set(boardsData);
    addHistoryStep(boardsData.boards[boardId]);
}

export function moveLeft(boardId, columnId, ticketId) {
    if (columnId > 0) {
        var boardsData = get(),
            ticketData = boardsData.boards[boardId].cols[columnId].tickets[ticketId],
            newColumn = boardsData.boards[boardId].cols[columnId - 1],
            newTicketId = newColumn.tickets.length - 1 > ticketId ? ticketId : newColumn.tickets.length - 1;

        delete boardsData.boards[boardId].cols[columnId].tickets[ticketId];
        boardsData.boards[boardId].cols[columnId].tickets = boardsData.boards[boardId].cols[columnId].tickets.filter(function(e){return e});
        boardsData.boards[boardId].cols[columnId - 1].tickets.splice(newTicketId, 0, ticketData);
        set(boardsData);
        addHistoryStep(boardsData.boards[boardId]);
        updateCurrentState(boardId, columnId - 1, newTicketId);
    }
}

export function moveRight(boardId, columnId, ticketId) {
    var boardsData = get();

    if (columnId + 1 < boardsData.boards[boardId].cols.length) {
        var ticketData = boardsData.boards[boardId].cols[columnId].tickets[ticketId],
            newColumn = boardsData.boards[boardId].cols[columnId + 1],
            newTicketId = newColumn.tickets.length > ticketId ? ticketId : newColumn.tickets.length;

        delete boardsData.boards[boardId].cols[columnId].tickets[ticketId];
        boardsData.boards[boardId].cols[columnId].tickets = boardsData.boards[boardId].cols[columnId].tickets.filter(function(e){return e});
        boardsData.boards[boardId].cols[columnId + 1].tickets.splice(newTicketId, 0, ticketData);
        set(boardsData);
        addHistoryStep(boardsData.boards[boardId]);
        updateCurrentState(boardId, columnId + 1, newTicketId);
    }
}

export function moveUp(boardId, columnId, ticketId) {
    var boardsData = get();
    
    if (ticketId > 0) {
        var ticketData = boardsData.boards[boardId].cols[columnId].tickets[ticketId],
            secondTicketData = boardsData.boards[boardId].cols[columnId].tickets[ticketId - 1];

        boardsData.boards[boardId].cols[columnId].tickets[ticketId] = secondTicketData,
        boardsData.boards[boardId].cols[columnId].tickets[ticketId - 1] = ticketData;
        set(boardsData);
        addHistoryStep(boardsData.boards[boardId]);
        updateCurrentState(boardId, columnId, ticketId - 1);
    }
}

export function moveDown(boardId, columnId, ticketId) {
    var boardsData = get();
    
    if (ticketId + 1 < boardsData.boards[boardId].cols[columnId].tickets.length) {
        var ticketData = boardsData.boards[boardId].cols[columnId].tickets[ticketId],
            secondTicketData = boardsData.boards[boardId].cols[columnId].tickets[ticketId + 1];

        boardsData.boards[boardId].cols[columnId].tickets[ticketId] = secondTicketData,
        boardsData.boards[boardId].cols[columnId].tickets[ticketId + 1] = ticketData;
        set(boardsData);
        addHistoryStep(boardsData.boards[boardId]);
        updateCurrentState(boardId, columnId, ticketId + 1);
    }
}

function updateCurrentState(boardId, columnid, ticketid) {
    var selectedTicket = {
        column: columnid,
        ticket: ticketid,
    };

    ReactDOM.render(<Board boardid={boardId} selectedTicket={selectedTicket}/>, document.getElementById("content"));
}

function initBoardsData() {
    set({
        boards: [],
    });
}

function set(boardsData) {
    localStorage.setItem(LS_VAR_NAME, JSON.stringify(boardsData));
}
