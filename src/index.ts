export { buildClient } from './Client';

export const defaultTimeProvider = () => new Date().getTime() / 1000;
