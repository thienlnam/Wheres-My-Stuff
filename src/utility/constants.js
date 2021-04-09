export const HEADER_PARTSLIST = 'partsPage';
export const HEADER_CONTAINEDBY = 'containedByPage';
export const HEADER_CONTAINER = 'containerPage';
export const HEADER_DASHBOARD = 'dashboardPage';
export const HEADER_CATEGORY = 'categoryPage';
export const HEADER_PROFILES = 'profilePage';
export const HEADER_FAQ = 'faqPage';

export const DASH_HELP_TITLE = 'Voice Commands Help';
export const DASH_HELP_BODY =
    '<p><b>This page is for using voice commands and exporting/importing inventory information</b></p><br />' +
    '<p>To start the voice command, click the start button and speech your command</p><br />' +
    '<p>To clear the transcript, click the reset button</p><br />' +
    '<p>The export button will save a .csv file with the information of the inventory. This can be used as a backup file</p><br />' +
    '<p>The import button will prompt for a .csv file and attempt to import the data into the inventory</p><br />' +
    '<p>*Note: If voice is not be detected, allow the site to use your microphone by clicking the icon to the left of the URL and allowing microphone use</p><br />' +
    '<p><b>Tip:</b> When naming multiple similar objects use letters instead of numbers i.e. (Screw A, Screw B, Screw H)</p>';

export const DASH_COMMANDS_TITLE = 'Supported Voice Commands';
export const DASH_COMMANDS_BODY =
    '<p><b>These are the supported voice commands</b></p><br />' +
    '<p><b>Find:</b> Find a Part with the below commands:</p>' +
    '<ul>' +
        '<li>Where\'s my/the (Part)?</li>' +
        '<li>Where is my/the (Part)?</li>' +
    '</ul>' +
    '<p><b>Update:</b> Update a Part with the below commands:</p>' +
   '<ul>' +
        '<li>Update (Part) quantity to (Number)</li>' +
    '</ul>';

export const CATEGORY_HELP_TITLE = 'Categories Help';
export const CATEGORY_HELP_BODY =
    '<p><b>This page is for adding/editing/removing part categories</b></p>' +
    '<p>Categories help to group parts into alike categories</p><br />' +
    '<p>Adding a category requires a name</p><br />' +
    '<p>Editing a category allows the name to be changed. This reflects on the Parts page</p><br />' +
    '<p>Removing a category will remove it from all associated parts</p>';

export const CONTAINED_HELP_TITLE = 'Part Locations Help';
export const CONTAINED_HELP_BODY =
    '<p><b>This page is for adding/editing/removing parts to containers in the inventory</b></p><br />' +
    '<p>The part locations show the container a part is in and the quantity</p><br />' +
    '<p>Adding a part to a container requires choosing a part and a container as well as a quantity, optionally add an identifier</p><br />' +
    '<p>Editing a location allows editing of the identifer and quantity</p><br />' +
    '<p>Removing a location does not remove the part and container, only the relationship between them is removed</p>';

export const CONTAINER_HELP_TITLE = 'Container Help';
export const CONTAINER_HELP_BODY =
    '<p><b>This page is for adding/editing/removing containers to the inventory</b></p>' +
    '<p>Containers hold the parts that are stored in the inventory</p><br />' +
    '<p>Adding a container requires a name and a location, and can optionally take a description and size</p><br />' +
    '<p>Editing a container allows changing any of the attributes shown</p><br />' +
    '<p>Removing a container will ask for confirmation before removing it from the inventory</p>';

export const PARTS_HELP_TITLE = 'Parts Help';
export const PARTS_HELP_BODY =
    '<p><b>This page is for adding/editing/removing parts from the inventory</b></p>' +
    '<p>Parts are the components and individual parts in the inventory</p><br />' +
    '<p>Add an item by specifying a name and optionally a category it belongs to</p><br />' +
    '<p>Editing an item will allow the changing of the name or adding/removing categories to the item</p><br />' +
    '<p>Deleting an item will remove it from the inventory and will reflect on the Part Locations page</p><br />';

export const PROFILE_HELP_TITLE = 'Profiles Help';
export const PROFILE_HELP_BODY =
    '<p><b>This page is for viewing profiles</b></p>' +
    '<p>***Features not implemented***</p>' +
    '<p>Modifying aspects of users and permissions</p>' +
    '<p>Restrict access to the system to allowed users</p>';
