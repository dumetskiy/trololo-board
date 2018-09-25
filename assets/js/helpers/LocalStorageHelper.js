const LS_VAR_NAME = 'trololo-data';

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
        cols: [],
    };

    boardsData.boards[Object.keys(boardsData.boards).length] = board;
    set(boardsData);
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
            console.log(column);
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
}

export function getColumnForBoard(boardId, columnId) {
    return get().boards[boardId].cols[columnId];
}

export function updateBoardColumnName(boardId, columnId, newTitle) {
    var boardsData = get();

    boardsData.boards[boardId].cols[columnId].title = newTitle;
    set(boardsData);
}

export function removeBoardColumn(boardId, columnId) {
    var boardsData = get();

    delete boardsData.boards[boardId].cols[columnId];
    boardsData.boards[boardId].cols = boardsData.boards[boardId].cols.filter(function(e){return e});
    set(boardsData);
}

export function getTicketForBoardColumn(boardId, columnId, ticketId) {
    return get().boards[boardId].cols[columnId].tickets[ticketId];
}

export function addTicketToBoardColumn(boardId, columnId, ticketTitle, ticketDescription) {
    var boardsData = get();

    boardsData.boards[boardId].cols[columnId].tickets[Object.keys(boardsData.boards[boardId].cols[columnId].tickets).length] = {
        title: ticketTitle,
        description: ticketDescription,
    };
    set(boardsData);
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
}

export function updateBoardColumnTicketData(boardId, columnId, ticketId, newTitle, newDescription) {
    var boardsData = get();

    boardsData.boards[boardId].cols[columnId].tickets[ticketId] = {
        title: newTitle,
        description: newDescription,
    };
    set(boardsData);
}

function initBoardsData() {
    set({
        boards: [],
    });
}

function set(boardsData) {
    localStorage.setItem(LS_VAR_NAME, JSON.stringify(boardsData));
}
