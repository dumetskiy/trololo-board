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
            }
        });
    } else {
        isValidBoardName = false;
    }

    return isValidBoardName;
}

function initBoardsData() {
    set({
        boards: [],
    });
}

function set(boardsData) {
    localStorage.setItem(LS_VAR_NAME, JSON.stringify(boardsData));
}
