import { Element } from "./element";

export interface renderable {

    render(): void;

}

export interface Layout extends renderable {

    getBox(): any;

    active(element: Element);

    onResize(callback: Function);

}


export interface Setup extends renderable {

    setMenu(commands: { [key: string]: any }): void;

    asDefault(element: Element): void;

}