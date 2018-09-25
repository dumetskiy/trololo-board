import {setBoardData} from './LocalStorageHelper'

var historyData = {};

export function startBoardHistory(boardId, boardState) {
    historyData = {
        boardId: boardId,
        history: [boardState],
        historyStep: 0,
    }
}

export function addHistoryStep(boardState) {
    ++historyData.historyStep;
    historyData.history.length = historyData.historyStep + 1;
    historyData.history[historyData.historyStep] = boardState;
}

export function stepForward() {
    if (historyData.historyStep < historyData.history.length - 1) {
        ++historyData.historyStep;
        setBoardData(historyData.boardId, historyData.history[historyData.historyStep]);
    }
}

export function stepBackward() {
    if (historyData.historyStep > 0) {
        --historyData.historyStep;
        setBoardData(historyData.boardId, historyData.history[historyData.historyStep]);
    }
}

export function hasStepForward() {
    return !(historyData.history.length - 1 === historyData.historyStep);
}

export function hasStepBackward() {
    return historyData.historyStep > 0;
}