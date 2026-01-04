/**
 * Burger Menu Module
 * Handles the toggle functionality for the burger menu using CSS classes
 */

/**
 * Initialize the burger menu by attaching event listeners to the toggle buttons
 * @function initBurgerMenu
 * @returns {void}
 */
function initBurgerMenu() {
    const burgerMenu = document.getElementById('burger-menu');
    const buttonOpen = document.querySelector('.burger-menu-button-off');
    const buttonClose = document.querySelector('.burger-menu-button-on');

    openBurgerMenu(burgerMenu, buttonOpen);
    closeBurgerMenu(burgerMenu, buttonClose);
}

/**
 * Attach click event listener to open the burger menu
 * @function openBurgerMenu
 * @param {HTMLElement} burgerMenu - The burger menu container element
 * @param {HTMLElement} buttonOpen - The hamburger icon button element
 * @returns {void}
 */
function openBurgerMenu(burgerMenu, buttonOpen) {
    buttonOpen.addEventListener('click', (e) => {
        e.stopPropagation();
        burgerMenu.classList.add('menu-open');
    });
}

/**
 * Attach click event listener to close the burger menu
 * @function closeBurgerMenu
 * @param {HTMLElement} burgerMenu - The burger menu container element
 * @param {HTMLElement} buttonClose - The cancel icon button element
 * @returns {void}
 */
function closeBurgerMenu(burgerMenu, buttonClose) {
    buttonClose.addEventListener('click', (e) => {
        e.stopPropagation();
        burgerMenu.classList.remove('menu-open');
    });
}

/**
 * Wait for DOM to be ready before initializing the menu
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBurgerMenu);
} else {
    initBurgerMenu();
}
