/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext, useState } from '@wordpress/element';
import {
	__experimentalHStack as HStack,
	__experimentalSpacer as Spacer,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import TabLayout from './tab-layout';
import { FontLibraryContext } from './context';
import FontsGrid from './fonts-grid';
import LibraryFontDetails from './library-font-details';
import SaveButton from '../../save-button';
import PreviewControls from './preview-controls';
import LibraryFontCard from './library-font-card';

function InstalledFonts() {
	const { themeFonts, libraryFonts, libraryFontSelected, handleSetLibraryFontSelected } = useContext( FontLibraryContext );

	const handleUnselectFont = () => {
		handleSetLibraryFontSelected( null );
	};

	const handleSelectFont = ( font ) => {
		handleSetLibraryFontSelected( font );
	};

	const tabDescription = !! libraryFontSelected
		? __( "Choose font variants. Keep in mind that too many variants could make your site slower." )
		: null;

	return (
		<TabLayout
			title={ libraryFontSelected?.name || '' }
			description={ tabDescription }
			handleBack={ !! libraryFontSelected && handleUnselectFont }
			footer={ <Footer /> }
		>
			{ ! libraryFontSelected && (
				<>
					{/* <PreviewControls /> */}

					{ libraryFonts.length > 0 && (
						<>
							<Spacer margin={ 4 } />
							<FontsGrid>
								{ libraryFonts.map( ( font ) => (
									<LibraryFontCard
										font={ font }
										key={ font.slug }
										onClick={ () => {
											handleSelectFont( font );
										} }
									/>
								) ) }
							</FontsGrid>
						</>
					)}
					
					{ themeFonts.length > 0 && (
						<>
							<Spacer margin={ 10 } />
							<FontsGrid
								title={ __( 'Theme Fonts' ) }
							>
								{ themeFonts.map( ( font ) => (
									<LibraryFontCard
										font={ font }
										key={ font.slug }
										onClick={ () => {
											handleSelectFont( font );
										} }
									/>
								) ) }
							</FontsGrid>
						</>
					)}

				</>
			) }

			{ libraryFontSelected && (
				<LibraryFontDetails
					font={ libraryFontSelected }
					handleUnselectFont={ handleUnselectFont }
					canBeRemoved={ libraryFontSelected?.source !== 'theme' }
				/>
			) }
		</TabLayout>
	);
}

function Footer() {
	return (
		<HStack justify="flex-end">
			<SaveButton
				textForDefaultState={ __( "Update" ) }
				textForIsDirtyState={ __( "Update" ) }
				textForDisabledState={ __( "Update" ) }
			/>
		</HStack>
	);
}

export default InstalledFonts;