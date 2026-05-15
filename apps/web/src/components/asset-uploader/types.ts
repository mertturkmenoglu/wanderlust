import type * as fileUpload from '@zag-js/file-upload';

type Dict<T = any> = Record<string, T>;

type PropTypes<T = Dict> = Record<
	| 'button'
	| 'label'
	| 'input'
	| 'textarea'
	| 'img'
	| 'output'
	| 'element'
	| 'select'
	| 'rect'
	| 'style'
	| 'circle'
	| 'svg'
	| 'path',
	T
>;

export type TUploader = fileUpload.Api<PropTypes>;

export type Props = {
	uploader: TUploader;
	className?: string;
};
