import {setBoardData} from './LocalStorageHelper'

var historyData = null;

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
    if (historyData && historyData.historyStep < historyData.history.length - 1) {
        ++historyData.historyStep;
        setBoardData(historyData.boardId, historyData.history[historyData.historyStep]);
    }
}

export function stepBackward() {
    if (historyData && historyData.historyStep > 0) {
        --historyData.historyStep;
        setBoardData(historyData.boardId, historyData.history[historyData.historyStep]);
    }
}