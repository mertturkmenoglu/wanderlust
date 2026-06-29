import path from 'node:path';
import { getVariables } from './variables';

export function getPaths(featureName: string) {
	const repoRootPath = path.join(process.cwd(), '..', '..');
	const apiSrcPath = path.join(repoRootPath, 'apps', 'api', 'src');
	const contractsSrcPath = path.join(
		repoRootPath,
		'packages',
		'contract',
		'src',
	);

	const vars = getVariables(featureName);

	return {
		repo: repoRootPath,
		contract: {
			src: contractsSrcPath,
			barrel: path.join(contractsSrcPath, 'index.ts'),
			feature: path.join(contractsSrcPath, vars.feature),
		},
		api: {
			src: apiSrcPath,
			barrel: path.join(apiSrcPath, 'routes', 'index.ts'),
			feature: path.join(apiSrcPath, 'routes', vars.feature),
		},
	};
}
