import '@testing-library/jest-dom';
import { server } from './mocks/server';

// jsdom does not implement the native <dialog> API used by ConfirmDialog and SelectField.
// These polyfills simulate showModal/close by toggling the `open` attribute.
HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute('open', '');
};
HTMLDialogElement.prototype.close = function () {
  this.removeAttribute('open');
};

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
