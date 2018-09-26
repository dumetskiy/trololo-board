export type TicketType = {
    title: string;
    description: string;
    color: string;
}

export type ColumnType = {
    title: string;
    tickets: TicketType[];
}

export type BoardType = {
    title: string;
    cols: ColumnType[];
}

export type BoardsDataType = {
    boards: BoardType[];
}

export type SelectedTicketDataType = {
    column: number;
    ticket: number;
}

export type ColorDataType = {
    handle: string;
    title: string;
}

export type HistoryDataType = {
    boardId: number,
    history: BoardType[],
    historyStep: number,
}