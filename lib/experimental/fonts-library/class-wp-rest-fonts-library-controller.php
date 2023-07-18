<?php
/**
 * Rest Fonts Library Controller.
 *
 * This file contains the class for the REST API Fonts Library Controller.
 *
 * @package    Gutenberg
 * @subpackage Fonts Library
 * @since      X.X.X
 */

/**
 * Include admin functions.
 */
include( ABSPATH . 'wp-admin/includes/admin.php' );

/**
 * Fonts Library Controller class.
 */
class WP_REST_Fonts_Library_Controller extends WP_REST_Controller {

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->rest_base = 'fonts_library';
		$this->namespace = 'wp/v2';
	}

	/**
	 * Registers the routes for the objects of the controller.
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'install_fonts' ),
					'permission_callback' => array( $this, 'update_fonts_library_permissions_check' ),
				),
			)
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'uninstall_font_family' ),
					'permission_callback' => array( $this, 'update_fonts_library_permissions_check' ),
				),
			)
		);
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/google_fonts',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_google_fonts' ),
					'permission_callback' => array( $this, 'read_fonts_library_permissions_check' ),
				),
			)
		);

	}

	/**
	 * Removes a font family from the fonts library and all their assets.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	function uninstall_font_family( $request ) {
		$data = array(
			'slug' => $request['slug'],
		);
		$font = new WP_Font_Family( $data );
		return new WP_REST_Response( $font->uninstall() );
	}

	/**
	 * Check if user has permissions to update the fonts library.
	 *
	 * @return true|WP_Error True if the request has write access for the item, WP_Error object otherwise.
	 */
	function update_fonts_library_permissions_check() {
		if ( ! current_user_can( 'edit_theme_options' ) ) {
			return new WP_Error(
				'rest_cannot_update_fonts_library',
				__( 'Sorry, you are not allowed to update the fonts library on this site.', 'gutenberg' ),
				array(
					'status' => rest_authorization_required_code(),
				)
			);
		}

		// Create fonts directory if it doesn't exist.
		wp_mkdir_p( WP_FONTS_DIR );

		// The update endpoints requires write access to the temp and the fonts directories.
		$temp_dir = get_temp_dir();
		if ( ! is_writable( $temp_dir ) || ! wp_is_writable( WP_FONTS_DIR ) ) {
			return new WP_Error(
				'rest_cannot_write_fonts_folder',
				__( 'Error: WordPress does not have permission to write the fonts folder on your server.', 'gutenberg' ),
				array(
					'status' => 500,
				)
			);
		}

		return true;
	}

	/**
	 * Check if user has permissions to read the fonts library.
	 *
	 * @return true|WP_Error True if the request has read access for the item, WP_Error object otherwise.
	 */
	function read_fonts_library_permissions_check() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return new WP_Error(
				'rest_cannot_read_fonts_library',
				__( 'Sorry, you are not allowed to read the fonts library on this site.', 'gutenberg' ),
				array(
					'status' => rest_authorization_required_code(),
				)
			);
		}

		return true;
	}

	/**
	 * Fetches the Google Fonts JSON file.
	 *
	 * Reads the "google-fonts.json" file from the file system and returns its content.
	 *
	 * @return WP_REST_Response|WP_Error The content of the "google-fonts.json" file wrapped in a WP_REST_Response object.
	 */
	function get_google_fonts() {
		$file = file_get_contents(
			path_join( dirname( __FILE__ ), 'google-fonts.json' )
		);
		if ( $file ) {
			return new WP_REST_Response( json_decode( $file ) );
		}
		return new WP_Error(
			'rest_cant_read_google_fonts',
			__( 'Error reading Google Fonts JSON file.', 'gutenberg' ),
			array( 'status' => 500 )
		);
	}

	/**
	 * Installs new fonts.
	 *
	 * Takes a request containing new fonts to install, downloads their assets, and adds them to the fonts library.
	 *
	 * @param WP_REST_Request $request The request object containing the new fonts to install in the request parameters.
	 * @return WP_REST_Response|WP_Error The updated fonts library post content.
	 */
	function install_fonts( $request ) {
		// Get new fonts to install.
		$fonts_to_install = $request->get_param( 'fontFamilies' );

		// As we are receiving form data, the font families are encoded as a string.
		// We are using form data because local fonts need to use that format to attach the files in the request.
		$fonts_to_install = json_decode( $fonts_to_install, true );

		if ( empty( $fonts_to_install ) ) {
			return new WP_Error( 'no_fonts_to_install', __( 'No fonts to install', 'gutenberg' ), array( 'status' => 400 ) );
		}

		// Get uploaded files (used when installing local fonts).
		$files = $request->get_file_params();

		// iterates the fonts data received and creates a new WP_Font_Family object for each one.
		$fonts_installed = array();
		foreach ( $fonts_to_install as $font_data ) {
			$font = new WP_Font_Family( $font_data );
			$font->install( $files );
			$fonts_installed[] = $font;
		}

		$response = array();
		if ( ! empty( $fonts_installed ) ) {
			foreach ( $fonts_installed as $font ) {
				$response[] = $font->get_data();
			}
			return new WP_REST_Response( $response );
		}

		return new WP_Error( 'error_installing_fonts', __( 'Error installing fonts. No font was installed.', 'gutenberg' ), array( 'status' => 500 ) );
	}

	/**
	 * Registers the fonts library post type.
	 */
	function register_post_type() {
		$args = array(
			'public'       => true,
			'label'        => 'Font Library',
			'show_in_rest' => true,
		);
		register_post_type( 'wp_fonts_library', $args );
	}

}

/**
 * Registers the routes for the objects of the controller.
 */
function fonts_library_register_routes() {
	$fonts_library = new WP_REST_Fonts_Library_Controller();
	$fonts_library->register_routes();
	$fonts_library->register_post_type();
}

add_action( 'rest_api_init', 'fonts_library_register_routes' );
