/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import type { ProgressBarProps } from './types';
import type { WordPressComponentProps } from '../ui/context';

export function ProgressBar(
	props: WordPressComponentProps< ProgressBarProps, 'div', false >
) {
	const { className, max = 100, mode = 'indeterminate', value } = props;
	const wrapperClasses = classnames(
		'components-progress-bar',
		className,
		`is-${ mode }`
	);

	return (
		<div className={ wrapperClasses }>
			<progress max={ max } value={ value } />
		</div>
	);
}

export default ProgressBar;
