/**
 * Dependency injection symbol record.
 */
export const Tokens = {
	Database: Symbol.for('Database'),
	Config: Symbol.for('Config'),
	Redis: Symbol.for('Redis'),
	Cache: Symbol.for('Cache'),
	Jobs: Symbol.for('Jobs'),
	Storage: Symbol.for('Storage'),
	Email: Symbol.for('Email'),
	Auth: Symbol.for('Auth'),
	Search: Symbol.for('Search'),
	Activities: Symbol.for('Activities'),
	Logger: Symbol.for('Logger'),
};
