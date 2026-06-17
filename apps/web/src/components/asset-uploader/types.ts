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
	classNames?: Partial<{
		root: string;
		selector: Partial<{
			root: string;
			dropzone: string;
			trigger: string;
		}>;
		grid: Partial<{
			root: string;
			item: string;
			image: string;
			title: string;
			description: string;
			delete: string;
		}>;
	}>;
};

export type AssetUploaderClassNames = Props['classNames'];
