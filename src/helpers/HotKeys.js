import store from "./../store/index";
import router from "./../router/index";
import Auth from "./Auth";

const SEARCH_CODE       = 'KeyF';
const PROFILE_CODE      = 'KeyS';
const DASHBOARD_CODE    = 'KeyD';
const SIDEBAR_CODE      = 'KeyE';
const LRION_CODE      = 'KeyW';

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

        case SIDEBAR_CODE:
            toggleSidebar();
            break;

        case LRION_CODE:
            alert('לירון ההומו')
            break;
    
        default:
            break;
    }
}

function activateSearch() {
    store.dispatch('AppState/updateGlobalSearchState', true)
}

function toggleSidebar() {
    store.dispatch('AppState/updateSidebarState', !store.getters['AppState/sidebarState'])
}

function goTo(path) {
    router.push(path)
}