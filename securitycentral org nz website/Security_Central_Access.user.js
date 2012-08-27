// ==UserScript==
// @name        Security Central Access
// @namespace   britta.nz
// @description Enable inclusive access to www.securitycentral.org.nz for screen readers
// @grant		none
// @include     http://www.securitycentral.org.nz/*
// @version     1
// ==/UserScript==

// This script just tells a screen reader user that the Mouseover Menu avigation "links" are actually onmouseover menus.
// That way a screen reader user can choose to use an emulated on mouse over command. For JAWS 13 this command is Insert+Control+Enter, to activate the menu.
// It would be nicer to just open the onmouseover menu when it receives keyboard focus, 
// but this code simply demos how a screen reader user can be informed (using WAI-ARIA), that a menu is present, 
// and what action is required on the users part, to access those menu components. 

function onLoad(evt) {
	
	var MenuBar = document.getElementById("main-nav");
	
	MenuBar.setAttribute("role", "menubar");
	MenuBar.setAttribute("aria-controls", "mn");	
	
	var Menu1 = document.getElementById("menu-item-297");
	
	Menu1.setAttribute("role", "menu");
	Menu1.setAttribute("aria-expanded", false);	
	Menu1.setAttribute("aria-haspopup", true);	
	Menu1.setAttribute("aria-label", "onMouseover menu. ");
	
	var Menu2 = document.getElementById("menu-item-218");
	
	Menu2.setAttribute("role", "menu");
	Menu2.setAttribute("aria-expanded", false);	
	Menu2.setAttribute("aria-haspopup", true);	
	Menu2.setAttribute("aria-label", "onMouseover menu. ");
	
	var Menu3 = document.getElementById("menu-item-225");
	
	Menu3.setAttribute("role", "menu");
	Menu3.setAttribute("aria-expanded", false);	
	Menu3.setAttribute("aria-haspopup", true);	
	Menu3.setAttribute("aria-label", "onMouseover menu. ");
	
	var Menu4 = document.getElementById("menu-item-242");
		
	Menu4.setAttribute("role", "menu");
	Menu4.setAttribute("aria-expanded", false);	
	Menu4.setAttribute("aria-haspopup", true);	
	Menu4.setAttribute("aria-label", "onMouseover menu. ");
	
	var Menu5 = document.getElementById("menu-item-210");
	
	Menu5.setAttribute("role", "menu");
	Menu5.setAttribute("aria-expanded", false);	
	Menu5.setAttribute("aria-haspopup", true);	
	Menu5.setAttribute("aria-label", "onMouseover menu.");
	
	var Menu6 = document.getElementById("menu-item-219");
	
	Menu6.setAttribute("role", "menu");
	Menu6.setAttribute("aria-expanded", false);	
	Menu6.setAttribute("aria-haspopup", true);	
	Menu6.setAttribute("aria-label", "onMouseover menu.");


}

window.addEventListener("load", onLoad);
document.addEventListener("focus", onFocus, true);