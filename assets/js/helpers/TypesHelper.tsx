export interface TicketType {
    title: string;
    description: string;
    color: string;
}

export interface ColumnType {
    title: string;
    tickets: TicketType[];
}

export interface BoardType {
    title: string;
    cols: ColumnType[];
}

export interface BoardsDataType {
    boards: BoardType[];
}

export interface SelectedTicketDataType {
    column: number;
    ticket: number;
}

export interface ColorDataType {
    handle: string;
    title: string;
}

export interface HistoryDataType {
    boardId: number;
    history: BoardType[];
    historyStep: number;
}

export interface BoardsStateType {
    title: string;
    boardId: number;
    selectedTicket: SelectedTicketDataType;
    isUpdated: boolean;
}
