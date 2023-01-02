export { buildClient } from './Client';
export { wrapFetch } from './facades/HttpGet';

export const defaultTimeProvider = () => new Date().getTime() / 1000;
