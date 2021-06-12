import * as API from './api';
import * as Handlers from './state/Handlers';

// Command Types
export const FIND = 'FIND';
export const UPDATE = 'UPDATE';
export const CONTENTS = 'CONTENTS';

// Voice Component States
export const STATE_READY = 'READY';
export const STATE_PENDING_SELECTION = 'PENDING_SELECTION';
export const STATE_PENDING_CONFIRMATION = 'PENDING_CONFIRMATION';

// Update Types
export const TYPE_INCREMENT = 'INCREMENT';
export const TYPE_DECREMENT = 'DECREMENT';

// List of valid responses
export const YES_RESPONSES = ['yes', 'sure', 'yup', 'continue'];
export const NO_RESPONSES = ['no', 'nope', 'stop'];
export const CANCEL_RESPONSES = ['cancel'];

/**
 * Handle start commands where we match the command and item information
 * @param {*} commandType FIND | UPDATE
 * @param {*} data Data about the item {'item': name} provided by user
 * @param {*} dispatch
 * @param {*} resetTranscript
 */
export async function handleVoiceCommand(commandType, data, dispatch, resetTranscript) {
    Handlers.setMessage(`Looking through my brain...`, dispatch);
    Handlers.setErrorMessage('', dispatch);
    if (commandType === FIND) {
        findCommand(data, dispatch);
    } else if (commandType === UPDATE) {
        updateCommand(data, dispatch, resetTranscript);
    } else if (commandType === CONTENTS) {
        findContents(data, dispatch);
    } else {
        Handlers.setMessage(`Sorry, I cannot handle that request yet!`, dispatch);
    }
};

/**
 * Handle voice reponses regarding confirmation and selection and unknown input
 * @param {*} response Response the user provided
 * @param {*} state State of the voice handling
 * @param {*} dispatch
 * @param {*} resetTranscript
 */
export async function handleVoiceResponses(response, state, dispatch, resetTranscript) {
    Handlers.setErrorMessage('', dispatch);
    if (state.voiceState === STATE_READY) {
        return;
    } else if (state.voiceState === STATE_PENDING_SELECTION) {
        if (CANCEL_RESPONSES.includes(response)) {
            resetConversation('Conversation reset, feel free to send me a brand new command!', dispatch, resetTranscript);
            return;
        }

        // Generate the command based on the selected item
        if (state.userChoice.includes(response)) {
            // Find the details for item that was selected
            let part = [];
            if (/^\d+$/.test(response)) {
                // Response is a number, just use the number as the array index
                part = state.options[response];
            } else {
                part = state.options.find((item) => item.partName.toLowerCase() === response);
            }

            // Grab quantity from state and add here
            const command = state.command;
            command['partID'] = part.partID;
            command['containerID'] = part.containerID;

            let confirmationMessage = '';

            // Handle modifiers such as incrementing and decrementing here
            if (command.modifier) {
                const selectedPart = await API.getContainedByIDs(command.partID, command.containerID);
                const currentQuantity = selectedPart.quantity;
                const commandQuantity = command['quantity'];

                if (command.modifier === TYPE_DECREMENT) {
                    command['quantity'] = currentQuantity - parseInt(commandQuantity);
                    confirmationMessage = `Are you sure you would like to decrement ${part.partName} by ${commandQuantity}? The new total will be ${command['quantity']}.`;
                } else if (command.modifier === TYPE_INCREMENT) {
                    command['quantity'] = currentQuantity + parseInt(commandQuantity);
                    confirmationMessage = `Are you sure you would like to increment ${part.partName} by ${commandQuantity}? The new total will be ${command['quantity']}.`;
                }
            } else {
                confirmationMessage = `Are you sure you would like to update ${part.partName} to ${command.quantity}?`;
            }

            // Call requestConfirmation with new command
            requestConfirmation(confirmationMessage, command, dispatch, resetTranscript);
        } else {
            Handlers.setErrorMessage(`Not a valid selection! Try again or say 'Cancel'.`, dispatch);
        }
    } else if (state.voiceState === STATE_PENDING_CONFIRMATION) {
        if (CANCEL_RESPONSES.includes(response)) {
            resetConversation('Conversation reset, feel free to send me a brand new command!', dispatch, resetTranscript);
            return;
        }

        if (YES_RESPONSES.includes(response)) {
            // Perform API command based on command type
            if (state.command.type === UPDATE) {
                const response = await API.updateContainedBy({
                    'partID': state.command.partID,
                    'containerID': state.command.containerID,
                    'quantity': state.command.quantity,
                });

                // Hack to see if it was successful
                if (response.containerID) {
                    resetConversation('Part successfully updated!', dispatch, resetTranscript);
                }
            }
        } else if (NO_RESPONSES.includes(response)) {
            resetConversation('Update cancelled!', dispatch, resetTranscript);
        }
    }
};

/**
 * Helper function to set voice handler to request confirmation from the user
 * @param {string} message Message to show to the user
 * @param {JSON} command Update command information
 * @param {function} dispatch
 * @param {function} resetTranscript
 */
function requestConfirmation(message, command, dispatch, resetTranscript) {
    Handlers.setMessage(message, dispatch);
    Handlers.setCommand(command, dispatch);
    Handlers.setErrorMessage('', dispatch);
    Handlers.setVoiceState(STATE_PENDING_CONFIRMATION, dispatch);
    resetTranscript();
}

/**
 * Helper function to reset voice handler state
 * @param {*} message Message to show to the user
 * @param {function} dispatch
 * @param {function} resetTranscript
 */
function resetConversation(message, dispatch, resetTranscript) {
    // Update our global state with new details
    Handlers.setUserChoice([], dispatch);
    Handlers.setOptions([], dispatch);
    Handlers.setMessage(message, dispatch);
    Handlers.setErrorMessage('', dispatch);
    Handlers.setVoiceState(STATE_READY, dispatch);
    resetTranscript();
}

/**
 * Function to have the user select from a list of options
 * @param {array} options Array of options that user can select
 * @param {function} dispatch
 * @param {function} resetTranscript
 */
function requestSelection(options, dispatch, resetTranscript) {
    // What the user will be able to say
    const userOptions = [];

    // What the user will see as a prompt
    let outputMessage = 'It looks like there are multiple items to select from.  Please choose one: \n';

    // Generate the options from the list of items
    for (let i = 0; i < options.length; i++) {
        const partName = options[i].partName;
        const containerName = options[i].containerName;
        userOptions.push(`${i}`);
        userOptions.push(partName.toLowerCase());
        outputMessage += `${i}: ${partName} in the ${containerName}\n`;
    }

    outputMessage += `Please say the item name or the number corresponding to it or use the buttons to select an item.`;

    // Update our global state with new details
    Handlers.setUserChoice(userOptions, dispatch);
    Handlers.setOptions(options, dispatch);
    Handlers.setMessage(outputMessage, dispatch);
    Handlers.setVoiceState(STATE_PENDING_SELECTION, dispatch);
}

/**
 * Function for handling FIND command
 * @param {JSON} data JSON passed through command
 * @param {function} dispatch
 */
async function findCommand(data, dispatch) {
    // Required parameters to perform lookup
    if (!data.item) {
        Handlers.setErrorMessage(`Data parameter is missing item!`, dispatch);
        return;
    }

    const result = await API.getParts(data.item);
    if (!result || result.length < 1) {
        Handlers.setErrorMessage(`Sorry, I wasn't able to find any instances of ${data.item}.`, dispatch);
        return;
    }

    // Group the items by name
    let message = '';
    const grouped = _.groupBy(result, 'partName');

    // Count number of returned items (unique item names)
    if (Object.keys(grouped).length > 1) {
        message += `I was able to find ${Object.keys(grouped).length} items that include ${data.item}.\n\n`;
    }

    // Loop through the grouped items and create message details
    Object.entries(grouped).forEach((item) => {
        const itemName = item[0];
        const itemOccurances = item[1].length;
        message += `You have ${itemOccurances} location(s) where ${itemName} exists.\n`;

        item[1].forEach((detail) => {
            const containerName = detail.containerName;
            const containerLocation = detail.location;
            message += `${detail.quantity} in the ${containerName}${containerLocation ?
                ` located in the ${containerLocation}.` :
                '.'}\n`;
        });
        message += '\n';
    });
    Handlers.setMessage(message, dispatch);
}

async function findContents(data, dispatch) {
    if (!data.container) {
        Handlers.setErrorMessage(`Data parameter is missing item!`, dispatch);
        return;
    }

    const result = await API.getContainers(data.container);
    if (!result || result.length < 1) {
        Handlers.setErrorMessage(`Sorry, I wasn't able to find any instances of ${data.container}.`, dispatch);
        return;
    }

    const containedResults = await API.getContainedBy(data.container);

    // Group the items by name
    let message = '';
    const grouped = _.groupBy(containedResults, 'containerName');

    // Count number of returned items (unique item names)
    if (Object.keys(grouped).length > 1) {
        message += `I was able to find ${Object.keys(grouped).length} containers that include the name ${data.container}.\n\n`;
    }

    // Loop through the grouped items and create message details
    Object.entries(grouped).forEach((item, index) => {
        const itemName = item[0];
        const itemOccurances = item[1].length;
        message += `You have ${itemOccurances} item(s) inside the ${itemName} located in the ${result[index].location}\n`;

        item[1].forEach((detail) => {
            const partName = detail.partName;
            const partQuantity = detail.quantity;
            message += `${partName} - Quantity: ${partQuantity}\n`;
        });
        message += '\n';
    });
    Handlers.setMessage(message, dispatch);
}

/**
 * Function for handling UPDATE command
 * @param {JSON} data JSON passed through command
 * @param {function} dispatch
 * @param {function} resetTranscript
 */
async function updateCommand(data, dispatch, resetTranscript) {
    if (!data.item || !data.quantity) {
        Handlers.setMessage(`Missing data parameters!`, dispatch);
        return false;
    }

    const result = await API.getParts(data.item);
    if (!result || result.length < 1) {
        Handlers.setMessage(`Sorry, I wasn't able to find any instances of ${data.item}.`, dispatch);
        return false;
    }

    const command = {'type': UPDATE, 'quantity': data.quantity};

    // If the update command is a 'Decrement' or 'Increment' command
    if (data.type) {
        command['modifier'] = data.type;
    }

    // Only a single result, store necessary update data in command and prompt for confirmation
    if (result.length == 1) {
        const part = result[0];
        command['partID'] = part.partID;
        command['containerID'] = part.containerID;

        const existingQuantity = part.quantity;
        let message = '';

        if (data.type && (data.type === TYPE_INCREMENT || data.type === TYPE_DECREMENT)) {
            const isIncrement = data.type === TYPE_INCREMENT;
            message = `Are you sure you would like to ${isIncrement ? 'increment' : 'decremenet'} quantity of ${part.partName} by ${data.quantity}?`;
            command['quantity'] = isIncrement ? existingQuantity + data.quantity : existingQuantity - data.quantity;
        } else {
            message = `Are you sure you would like to update ${part.partName} to ${data.quantity}?`;
            command['quantity'] = data.quantity;
        }

        requestConfirmation(message, command, dispatch, resetTranscript);
    } else {
        Handlers.setCommand(command, dispatch);
        requestSelection(result, dispatch, resetTranscript);
    }

    return true;
};

/**
 * Function to generate data for voice buttons
 * @param {array} state Global state of voice function
 * @return {array} Array of data for generated buttons, text and data
 */
export function generateVoiceButtons(state) {
    const voiceButtonData = [];
    if (state.voiceState === STATE_PENDING_CONFIRMATION) {
        voiceButtonData.push({'buttonText': 'Yes', 'data': 'yes'});
        voiceButtonData.push({'buttonText': 'No', 'data': 'no'});
    }

    // Present the multiple options
    if (state.voiceState === STATE_PENDING_SELECTION && state.options.length > 0) {
        state.options.map((data, index) => {
            voiceButtonData.push({'buttonText': data.partName + ' inside the ' + data.containerName, 'data': index});
        });
    }

    return voiceButtonData;
}
