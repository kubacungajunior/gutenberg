/**
 * External dependencies
 */
import type { ComponentMeta, ComponentStory } from '@storybook/react';

/**
 * Internal dependencies
 */
import { ProgressBar } from '..';

const meta: ComponentMeta< typeof ProgressBar > = {
	component: ProgressBar,
	title: 'Components/ProgressBar',
	parameters: {
		controls: {
			expanded: true,
		},
		docs: { source: { state: 'open' } },
	},
};
export default meta;

const Template: ComponentStory< typeof ProgressBar > = ( { ...args } ) => {
	return <ProgressBar { ...args } />;
};

export const Default: ComponentStory< typeof ProgressBar > = Template.bind(
	{}
);
Default.args = {};
