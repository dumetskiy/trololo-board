export function isLeftToggled(e: KeyboardEvent) {
    return e.keyCode === 37;
}

export function isRightToggled(e: KeyboardEvent) {
    return e.keyCode === 39;
}

export function isUpToggled(e: KeyboardEvent) {
    return e.keyCode === 38;
}

export function isDownToggled(e: KeyboardEvent) {
    return e.keyCode === 40;
}

export function isEditToggled(e: KeyboardEvent) {
    return e.keyCode === 13;
}

export function isStepBackToggled(e: KeyboardEvent) {
    return e.keyCode === 90 && e.ctrlKey;
}

export function isStepForwardToggled(e: KeyboardEvent) {
    return e.keyCode === 89 && e.ctrlKey;
}
