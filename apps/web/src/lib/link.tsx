import { createLink, type LinkComponent } from '@tanstack/react-router';
import React from 'react';

export type CreateLinkProps<T extends object> =
	React.AnchorHTMLAttributes<HTMLAnchorElement> & T;

export type CreateLinkComponentRenderer<Props> = React.ForwardRefRenderFunction<
	HTMLAnchorElement,
	React.PropsWithoutRef<Props>
>;

export function createLinkComponent<Props>(
	render: CreateLinkComponentRenderer<Props>,
) {
	const Component = React.forwardRef<HTMLAnchorElement, Props>(render);

	const CreatedLinkComponent = createLink(Component);

	const NewLink: LinkComponent<typeof Component> = (props) => {
		return <CreatedLinkComponent {...props} />;
	};

	return NewLink;
}
