/**
 * WordPress dependencies
 */
import { createBlock, switchToBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { name as listItemName } from './block.json';
import { name as listName } from '../list/block.json';
import { name as paragraphName } from '../paragraph/block.json';

export function createListItem( listItemAttributes, listAttributes, children ) {
	return createBlock(
		listItemName,
		listItemAttributes,
		! children?.length
			? []
			: [ createBlock( listName, listAttributes, children ) ]
	);
}

async function convertBlockToList( block ) {
	const list = await switchToBlockType( block, listName );
	if ( list ) {
		return list;
	}
	const paragraph = await switchToBlockType( block, paragraphName );
	if ( paragraph ) {
		return await switchToBlockType( paragraph, listName );
	}
	return null;
}

export async function convertToListItems( blocks ) {
	const listItems = [];

	for ( let block of blocks ) {
		if ( block.name === listItemName ) {
			listItems.push( block );
		} else if ( block.name === listName ) {
			listItems.push( ...block.innerBlocks );
		} else if ( ( block = await convertBlockToList( block ) ) ) {
			for ( const { innerBlocks } of block ) {
				listItems.push( ...innerBlocks );
			}
		}
	}

	return listItems;
}
