import * as React from "react";
import {ColorDataType} from "./TypesHelper";

const colorsData = [
    {
        handle: "none",
        title: "No color",
    },
    {
        handle: "red",
        title: "Red",
    },
    {
        handle: "green",
        title: "Green",
    },
    {
        handle: "blue",
        title: "Blue",
    },
    {
        handle: "purple",
        title: "Purple",
    },
    {
        handle: "yellow",
        title: "Yellow",
    },
    {
        handle: "orange",
        title: "Orange",
    },
];

export const ticketTitleMaxLength = 50;
export const columnNameMaxLength = 45;
export const collapsedTicketDescriptionLength = 350;

export function getColorSelect(currentColor: string, ref: React.RefObject<HTMLSelectElement>): React.ReactNode {
    const selectOptions: JSX.Element[] = [];

    currentColor = currentColor === "" ? "none" : currentColor;

    colorsData.forEach((color: ColorDataType, index: number) => {
        selectOptions.push(<option key={index} value={color.handle} >{color.title}</option>);
    });

    return (
        <select ref={ref} defaultValue={currentColor} className="flex-input-small">
            {selectOptions}
        </select>
    );
}
