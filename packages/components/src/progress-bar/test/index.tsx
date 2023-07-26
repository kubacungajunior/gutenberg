/**
 * External dependencies
 */
import { render, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import ProgressBar from '..';

describe( 'FormToggle', () => {
	describe( 'basic rendering', () => {
		it( 'should render a progress bar element', () => {
			render( <ProgressBar mode="determinate" value={ 123 } /> );

			expect( screen.getByRole( 'progressbar' ) ).toBeVisible();
		} );
	} );
} );
