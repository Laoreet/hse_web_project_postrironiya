import '@testing-library/jest-dom/extend-expect';
import { JSDOM } from 'jsdom';

const jsdom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
const { window } = jsdom;

global.window = window;
global.document = window.document;