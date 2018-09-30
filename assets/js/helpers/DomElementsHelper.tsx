import * as React from 'react'
import {RefObject} from 'react';
import {ColorDataType} from './TypesHelper';

const colorsData = [
    {
        handle: 'none',
        title: 'No color',
    },
    {
        handle: 'red',
        title: 'Red',
    },
    {
        handle: 'green',
        title: 'Green',
    },
    {
        handle: 'blue',
        title: 'Blue',
    },
    {
        handle: 'purple',
        title: 'Purple',
    },
    {
        handle: 'yellow',
        title: 'Yellow',
    },
    {
        handle: 'orange',
        title: 'Orange',
    },
];

export function getColorSelect(currentColor: string, ref: RefObject<HTMLSelectElement>): React.ReactNode {
    let selectOptions: JSX.Element[] = [];

    currentColor = currentColor === '' ? 'none' : currentColor;

    colorsData.forEach(function(color: ColorDataType, index: number) {
        selectOptions.push(<option key={index} value={color.handle} >{color.title}</option>);
    });

    return (
        <select ref={ref} defaultValue={currentColor} className="flex-input-small">
            {selectOptions}
        </select>
    );
}