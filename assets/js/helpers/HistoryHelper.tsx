import {setBoardData} from './LocalStorageHelper'
import {BoardType, HistoryDataType} from './TypesHelper';

let historyData: HistoryDataType  = {
    boardId: -1,
    history: [],
    historyStep: 0,
};

export function startBoardHistory(boardId: number, boardState: BoardType) {
    historyData = {
        boardId: boardId,
        history: [boardState],
        historyStep: 0,
    }
}

export function addHistoryStep(boardState: BoardType) {
    ++historyData.historyStep;
    historyData.history.length = historyData.historyStep + 1;
    historyData.history[historyData.historyStep] = boardState;
}

export function stepForward() {
    if (historyData.boardId !== -1 && historyData.historyStep < historyData.history.length - 1) {
        ++historyData.historyStep;
        setBoardData(historyData.boardId, historyData.history[historyData.historyStep]);
    }
}

export function stepBackward() {
    if (historyData.boardId !== -1 && historyData.historyStep > 0) {
        --historyData.historyStep;
        setBoardData(historyData.boardId, historyData.history[historyData.historyStep]);
    }
}