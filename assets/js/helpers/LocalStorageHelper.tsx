import * as React from "react";
import {BoardsDataType, BoardType} from "./TypesHelper";

const localStorageVarName = "trololo-data";

export function get(): BoardsDataType {
    let boardsData: BoardsDataType = JSON.parse(localStorage.getItem(localStorageVarName));

    if (!boardsData) {
        initBoardsData();
        boardsData = JSON.parse(localStorage.getItem(localStorageVarName));
    }

    boardsData.boards = boardsData.boards.filter((e: BoardType) => e);

    return boardsData;
}

export function set(boardsData: BoardsDataType) {
    localStorage.setItem(localStorageVarName, JSON.stringify(boardsData));
}

function initBoardsData() {
    set({
        boards: [],
    });
}
