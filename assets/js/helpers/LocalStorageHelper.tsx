import * as React from 'react'
import * as ReactDOM from 'react-dom';
import Board from '../components/Board';
import {addHistoryStep} from './HistoryHelper'
import {TicketType, ColumnType, BoardType, BoardsDataType, SelectedTicketDataType} from './TypesHelper';
import {ticketTitleMaxLength, columnNameMaxLength} from './DomElementsHelper';

const localStorageVarName = 'trololo-data';
const localStorageBackgroundVarName = 'background';
const defaultColumnName = 'New Tasks';

export function get(): BoardsDataType
{
    let boardsData: BoardsDataType = JSON.parse(localStorage.getItem(localStorageVarName));

    if (!boardsData) {
        initBoardsData();
        boardsData = JSON.parse(localStorage.getItem(localStorageVarName));
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
    let boardsData: BoardsDataType = get();

    boardsData.boards[Object.keys(boardsData.boards).length] =  {
        title: title,
        cols: [
            {
                title: defaultColumnName,
                tickets: [],
            }
        ],
    };
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
    ReactDOM.render(<Board boardId={boardId} selectedTicket={selectedTicket}/>, document.getElementById('content'));
}

export function setNameForBoardById(boardId: number, name: string) {
    let boardsData: BoardsDataType = get();

    boardsData.boards[boardId].title = name;
    set(boardsData);
}

export function isValidBoardName(boardName: string): boolean {
    let isValidBoardName: boolean = true;

    if (boardName.length) {
        get().boards.forEach(function(board: BoardType) {
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
    if (columnName.length) {
        if (columnName.length <= columnNameMaxLength) {
            get().boards[boardId].cols.forEach(function(column: ColumnType) {
                if (column.title.toLowerCase() === columnName.toLowerCase()) {
                    alert('Column with the same name already exists!');

                    return false;
                }
            });
        } else {
            alert('Maximum column name length exceeded!');

            return false;
        }
    } else {
        alert('Empty column name provided!');

        return false;
    }

    return true;
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
        if (ticketTitle.length <= ticketTitleMaxLength) {
            return true;
        } else {
            alert('Maximum ticket title length exceeded!');

            return false;
        }
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
            newTicketId: number = newColumn.tickets.length > ticketId ? ticketId : newColumn.tickets.length;

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

        boardsData.boards[boardId].cols[columnId].tickets[ticketId] = secondTicketData;
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

        boardsData.boards[boardId].cols[columnId].tickets[ticketId] = secondTicketData;
        boardsData.boards[boardId].cols[columnId].tickets[ticketId + 1] = ticketData;
        set(boardsData);
        addHistoryStep(boardsData.boards[boardId]);
        updateCurrentState(boardId, columnId, ticketId + 1);
    }
}

function updateCurrentState(boardId: number, columnId: number, ticketId: number) {
    let selectedTicket = {
        column: columnId,
        ticket: ticketId,
    };

    ReactDOM.render(<Board boardId={boardId} selectedTicket={selectedTicket}/>, document.getElementById('content'));
}

export function setBackgroundImage(imgElement: HTMLImageElement): boolean {
    let backgroundImageData = getBase64Image(imgElement);

    try {
        localStorage.setItem(localStorageBackgroundVarName, backgroundImageData);

        return true;
    }
    catch (e) {
        alert("This image is too big. Please select the another one and try again");

        return false;
    }
}

export function hasBackgroundImage(): boolean {
    return localStorage.getItem(localStorageBackgroundVarName) !== null;
}

export function getBackgroundImage(): string {
    return "data:image/png;base64," + localStorage.getItem(localStorageBackgroundVarName);
}

function getBase64Image(image: HTMLImageElement): string {
    let canvas: HTMLCanvasElement = document.createElement("canvas");

    canvas.width = image.width;
    canvas.height = image.height;

    let ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);

    let dataURL: string = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function initBoardsData() {
    set({
        boards: [],
    });
}

function set(boardsData: BoardsDataType) {
    localStorage.setItem(localStorageVarName, JSON.stringify(boardsData));
}
