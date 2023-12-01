<?php

/**
 * Plugin Name: CORDS
 * Description: Plugin for implementing CORDS in your WordPress site. Includes indexing and widget support.
 * Version: 0.0.1
 * Author: Billy
 * Author URI: billyhawkes.com
 */


add_action('admin_menu', 'cords_init_menu');

/**
 * Init Admin Menu.
 *
 * @return void
 */
function cords_init_menu()
{
	add_menu_page('CORDS', 'CORDS', 'manage_options', 'cords', 'cords_admin_page', 'dashicons-admin-post', '2.1');
}

/**
 * Init Admin Page.
 *
 * @return void
 */
function cords_admin_page()
{
	require_once plugin_dir_path(__FILE__) . 'entry.php';
}

add_action('admin_enqueue_scripts', 'cords_admin_enqueue_scripts');

/**
 * Enqueue scripts and styles.
 *
 * @return void
 */
function cords_admin_enqueue_scripts()
{
	wp_enqueue_style('cords-style', plugin_dir_url(__FILE__) . 'menu/dist/assets/index.css');
	wp_enqueue_script('cords-script', plugin_dir_url(__FILE__) . 'menu/dist/assets/index.js', array('wp-element'), '1.0.0', true);
}
