import React from 'react';

/**
 * Converts newline characters in a string to <br /> elements for rendering in React.
 *
 * @param text The input string containing newline characters.
 * @returns An array of React elements with <br /> elements inserted at newline positions.
 * @returns React.JSX.Element[]
 */
export function nl2br(text: string) {
	const parts = text.split('\n');
	return parts.map((part, index) => (
		<React.Fragment key={index}>
			{part}
			{index < parts.length - 1 && <br />}
		</React.Fragment>
	));
}
