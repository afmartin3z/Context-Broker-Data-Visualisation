Object.defineProperty(window, 'CSS', { value: null });
Object.defineProperty(document, 'doctype', {
    value: '<!DOCTYPE html>',
});
Object.defineProperty(window, 'getComputedStyle', {
    value: (): any => {
        return {
            display: 'none',
            appearance: ['-webkit-appearance'],
        };
    },
});
/**
 * ISSUE: https://github.com/angular/material2/issues/7101
 * Workaround for JSDOM missing transform property
 */
Object.defineProperty(document.body.style, 'transform', {
    value: (): any => {
        return {
            enumerable: true,
            configurable: true,
        };
    },
});
