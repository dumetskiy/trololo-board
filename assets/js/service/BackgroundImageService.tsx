import * as React from "react";
import * as ReactDOM from "react-dom";
import Board from "../components/Board";
import {getContentElement} from "../helpers/DomElementsHelper";

const localStorageBackgroundVarName = "background";

export function setBackgroundImage(imgElement: HTMLImageElement): boolean {
    const backgroundImageData = getBase64Image(imgElement);

    try {
        localStorage.setItem(localStorageBackgroundVarName, backgroundImageData);

        return true;
    } catch (e) {
        alert("This image is too big. Please select the another one and try again");

        return false;
    }
}

export function hasBackgroundImage(): boolean {
    return localStorage.getItem(localStorageBackgroundVarName) !== null;
}

export function getBackgroundImage(): string {
    return "data:image/png;base64," + localStorage.getItem(localStorageBackgroundVarName);
}

function getBase64Image(image: HTMLImageElement): string {
    const canvas: HTMLCanvasElement = document.createElement("canvas");

    canvas.width = image.width;
    canvas.height = image.height;

    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);

    const dataURL: string = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}
