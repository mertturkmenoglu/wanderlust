import fs from 'node:fs';
import path from 'node:path';
import handlebars from 'handlebars';
import type { ForgotPasswordParams, WelcomeEmailParams } from './types';

function compile<T>(name: string) {
	const templatePath = path.join(import.meta.dirname, '..', '..', 'templates');
	const content = fs.readFileSync(path.join(templatePath, name), 'utf8');
	return handlebars.compile<T>(content);
}

export const templates = {
	forgotPassword: compile<ForgotPasswordParams>('forgot-password.hbs'),
	welcome: compile<WelcomeEmailParams>('welcome-email.hbs'),
} satisfies Record<string, HandlebarsTemplateDelegate>;
