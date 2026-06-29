export function getVariables(featureName: string) {
	return {
		feature: `${featureName}s`, // Example: "users"
		featureSingle: featureName, // Example: "user"
		Feature: `${featureName[0]?.toUpperCase()}${featureName.slice(1)}s`, // Example: "Users"
		FeatureSingle: `${featureName[0]?.toUpperCase()}${featureName.slice(1)}`, // Example: "User"
	};
}
