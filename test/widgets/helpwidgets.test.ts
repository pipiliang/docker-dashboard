import * as chai from 'chai';
import * as mocha from 'mocha';
import { Layout } from '../../src/api/dashboard';
import { HelpWidget } from '../../src/widgets/helpwidget';

const expect = chai.expect;
describe('Help Widget Test', () => {

    // const helpWidget = new HelpWidget(new LayoutTest());

    // it('1. should return Help when get command name.', () => {
    //     expect(helpWidget.getCommandName()).to.equal('help');
    // });

});

class LayoutTest implements Layout {

    getBox() {
        throw new Error("Method not implemented.");
    }

    active(element: import("../../src/api/element").Element) {
        throw new Error("Method not implemented.");
    }

    onResize(callback: Function) {
        throw new Error("Method not implemented.");
    }

    render(): void {
        throw new Error("Method not implemented.");
    }

}