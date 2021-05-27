/**
 * External dependencies
 */
import { cx } from 'emotion';

/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { contextConnect, useContextSystem } from '../ui/context';
import { Scrollable } from '../scrollable';
import { View } from '../view';
import * as styles from './styles';

/**
 * @param {import('../ui/context').PolymorphicComponentProps<import('./types').CardBodyProps, 'div'>} props
 * @param {import('react').Ref<any>} forwardedRef
 */
function CardBody( props, forwardedRef ) {
	const {
		className,
		scrollable = true,
		isShady = false,
		size = 'medium',
		...otherProps
	} = useContextSystem( props, 'CardBody' );

	const classes = useMemo(
		() =>
			cx(
				styles.Body,
				styles.borderRadius,
				styles.cardPaddings[ size ],
				isShady && styles.shady,
				className
			),
		[ className ]
	);

	if ( scrollable ) {
		return (
			<Scrollable
				{ ...otherProps }
				className={ classes }
				ref={ forwardedRef }
			/>
		);
	}

	return (
		<View { ...otherProps } className={ classes } ref={ forwardedRef } />
	);
}

/**
 * `CardBody` is a layout component, rendering the contents of a `Card`.
 * Multiple `CardBody` components can be used within `Card` if needed.
 *
 * @example
 * ```jsx
 * import { Card, CardBody } from `@wordpress/components/ui`;
 *
 * <Card>
 * 	<CardBody>
 * 		...
 * 	</CardBody>
 * </Card>
 * ```
 */
const ConnectedCardBody = contextConnect( CardBody, 'CardBody' );

export default ConnectedCardBody;
