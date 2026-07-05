import { Container } from 'inversify';

export const TYPES = {
	Logger: Symbol.for('Logger'),
};

export const container = new Container({
	autobind: true,
});
