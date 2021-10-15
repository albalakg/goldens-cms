import store from "./../store/index";
import router from "./../router/index";
import Auth from "./Auth";

const SEARCH_CODE       = 'KeyF';
const PROFILE_CODE      = 'KeyS';
const DASHBOARD_CODE    = 'KeyD';

const keysPressed = {};


// Listen to key press and add it
document.addEventListener('keydown', event => {
    keysPressed[event.key] = true;

    if (keysPressed['Alt']) {
        event.preventDefault();
        findAction(event);
    }
})

// Listen to key unpress and remove it
document.addEventListener('keyup', (event) => {
    delete keysPressed[event.key];
});


/**
 * Functions
*/

function findAction(event) {
    switch (event.code) {
        case SEARCH_CODE:
            activateSearch();
            break;

        case PROFILE_CODE:
            goTo('/users/show/' + Auth.id());
            break;
    

        case DASHBOARD_CODE:
            goTo('/');
            break;
    
        default:
            break;
    }
}

function activateSearch() {
    store.dispatch('AppState/updateGlobalSearchState', true)
}

function goTo(path) {
    router.push(path)
}