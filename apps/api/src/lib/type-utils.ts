// https://github.com/sindresorhus/type-fest/blob/main/source/set-non-nullable.d.ts
export type SetNonNullable<
	BaseType,
	Keys extends keyof BaseType = keyof BaseType,
> = {
	[Key in keyof BaseType]: Key extends Keys
		? NonNullable<BaseType[Key]>
		: BaseType[Key];
};
