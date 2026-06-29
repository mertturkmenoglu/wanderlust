import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { command, positional } from '@drizzle-team/brocli';
import consola from 'consola';
import { Project, SyntaxKind } from 'ts-morph';
import { Pipeline } from '@/lib/pipeline';
import { buildTemplate } from './build-template';
import { getPaths } from './paths';
import { template as apiIndexTs } from './templates/api/feature/index';
import { template as apiRepositoryTs } from './templates/api/feature/repository';
import { template as apiServiceTs } from './templates/api/feature/service';
import { template as contractContractTs } from './templates/contract/feature/contract';
import { template as contractDtoTs } from './templates/contract/feature/dto';
import { template as contractIndexTs } from './templates/contract/feature/index';
import { getVariables } from './variables';

export const scaffold = command({
	name: 'scaffold',
	desc: 'Scaffolds a new feature in the application.',
	options: {
		feature: positional('feature')
			.desc(
				'The name of the feature to scaffold. Use a single word in all lowercase letters, do not pluralize. For example, use "user" instead of "users".',
			)
			.required(),
	},
	handler: async (opts) => {
		const paths = getPaths(opts.feature);
		const vars = getVariables(opts.feature);

		const pipeline = new Pipeline({
			values: {},
		})
			.addStep({
				name: 'Creating contract files',
				fn: async () => {
					// Create packages/contract/src/{{feature}} directory
					fs.mkdirSync(paths.contract.feature, {
						recursive: true,
					});

					// Create contract.ts
					fs.writeFileSync(
						path.join(paths.contract.feature, 'contract.ts'),
						buildTemplate(contractContractTs, vars),
					);

					// Create dto.ts
					fs.writeFileSync(
						path.join(paths.contract.feature, 'dto.ts'),
						buildTemplate(contractDtoTs, vars),
					);

					// Create index.ts
					fs.writeFileSync(
						path.join(paths.contract.feature, 'index.ts'),
						buildTemplate(contractIndexTs, vars),
					);

					// Open packages/contract/src/index.ts
					const project = new Project();
					const barrel = project.addSourceFileAtPath(paths.contract.barrel);

					// Update AppRouter type
					const appRouterType = barrel.getTypeAliasOrThrow('AppRouter');
					const typeLiteral = appRouterType
						.getTypeNodeOrThrow()
						.asKindOrThrow(SyntaxKind.TypeLiteral);

					typeLiteral.addProperty({
						name: vars.feature,
						type: `${vars.feature}.Contract`,
					});

					// Add import statement for the new feature
					barrel.addImportDeclaration({
						moduleSpecifier: `./${vars.feature}`,
						namespaceImport: vars.feature,
					});

					// Update export statement
					const exportDeclaration = barrel.getExportDeclarationOrThrow(
						(exp) => {
							return exp.hasNamedExports() && !exp.hasModuleSpecifier();
						},
					);

					exportDeclaration.addNamedExport(vars.feature);

					await barrel.save();

					// Run Biome format to format the updated files
					execSync(`bun biome format --write ${paths.contract.barrel}`, {
						cwd: paths.repo,
						stdio: 'inherit',
					});
				},
			})
			.addStep({
				name: 'Creating API files',
				fn: async () => {
					// Create apps/api/src/routes/{{feature}} directory
					fs.mkdirSync(paths.api.feature, {
						recursive: true,
					});

					// Create index.ts
					fs.writeFileSync(
						path.join(paths.api.feature, 'index.ts'),
						buildTemplate(apiIndexTs, vars),
					);

					// Create service.ts
					fs.writeFileSync(
						path.join(paths.api.feature, 'service.ts'),
						buildTemplate(apiServiceTs, vars),
					);

					// Create repository.ts
					fs.writeFileSync(
						path.join(paths.api.feature, 'repository.ts'),
						buildTemplate(apiRepositoryTs, vars),
					);

					// Open apps/api/src/routes/index.ts
					const project = new Project();
					const barrel = project.addSourceFileAtPath(paths.api.barrel);

					// Update AppRouter type
					const appRouterType = barrel.getTypeAliasOrThrow('AppRouter');
					const typeLiteral = appRouterType
						.getTypeNodeOrThrow()
						.asKindOrThrow(SyntaxKind.TypeLiteral);

					typeLiteral.addProperty({
						name: vars.feature,
						type: `ReturnType<typeof ${vars.feature}.router>`,
					});

					// Add import statement for the new feature
					barrel.addImportDeclaration({
						moduleSpecifier: `./${vars.feature}`,
						namedImports: [
							{
								name: 'module',
								alias: vars.feature,
							},
						],
					});

					// Update getAppRouter function
					const fn = barrel.getFunctionOrThrow('getAppRouter');
					const returnStatement = fn.getStatementByKindOrThrow(
						SyntaxKind.ReturnStatement,
					);
					const objectLiteral = returnStatement
						.getExpressionOrThrow()
						.asKindOrThrow(SyntaxKind.ObjectLiteralExpression);

					objectLiteral.addPropertyAssignment({
						name: vars.feature,
						initializer: `${vars.feature}.router()`,
					});

					// Update "exports" array
					const exportsArrDecl =
						barrel.getVariableDeclarationOrThrow('exports');
					const callExpr = exportsArrDecl.getInitializerIfKindOrThrow(
						SyntaxKind.CallExpression,
					);
					const arrayLiteral = callExpr
						.getExpressionIfKindOrThrow(SyntaxKind.PropertyAccessExpression)
						.getExpressionIfKindOrThrow(SyntaxKind.ArrayLiteralExpression);

					arrayLiteral.addElement(`${vars.feature}.exports`);

					await barrel.save();

					// Run Biome format to format the updated files
					execSync(`bun biome format --write ${paths.api.barrel}`, {
						cwd: paths.repo,
						stdio: 'inherit',
					});
				},
			});

		await pipeline.run();

		consola.success(
			`Scaffolded feature "${opts.feature}" successfully in the application.`,
		);
	},
});
