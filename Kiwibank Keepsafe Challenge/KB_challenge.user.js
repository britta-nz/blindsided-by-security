// ==UserScript==
// @name        KB Challenge
// @namespace   britta.nz
// @grant		none
// @include     https://www.ib.kiwibank.co.nz/keepsafe/challenge/
// @version     1
// ==/UserScript==

//Code for NVDA 2012.2.1, JAWS 13, ORCA 3.4.2 screen readers. (see notes on ORCA 3.4.2 linux GUI screen reader differences.)

//aria-live = polite would not work, so aria-assertive AND role = alert had to be used (which causes double speaking in NVDA 2012.2.1).
//aria-label would not work on input letter links.

//*******************************************
//Code for ORCA Gnome GUI screen reader demo.

// 1. Orca does not have links list, so user has to be told to Tab to the input letter, to activate it. <- review
// 2. aria-live = polite works (whereas NVDA 2012.2.1, and JAWS 13 didn't), so role = alert, aria-live = assertive, can be changed.
// 3. Orca needed onkeypress attribute specified, for spacebar and Enter keys to work on the input letters.
// 4. Keyboard error message had to be removed, as this message makes Orca speak regardless of aria-live = off. IE solution would be coded differently.
// 5. aria-label did not work when set on the input letters (just like it didn't with the windows screen readers).

// Bug with either Orca or Firefox. Orca Structural navigation mode gets disabled and there is no way to enable it again. Intermittent issue. 
// Restarting the computer works to regain access to Structural navigation in ORCA. :-p.
//*******************************************


//No refactoring done on this code whatsoever.

var quTextDiv = document.getElementById("question").getElementsByClassName("question")[0]; 
var quText = quTextDiv.innerHTML;

function onFocus(evt) {
		var target = evt.target;
		var tag = target.tagName;
		
		var reqAriaLabel = target.getAttribute("aria-label");
		var reqTilePosition = 0;
		var tilePosition = 0;
		var tileNumber = 0;
		var id = "";
		var idTextParts = "";
		var labelReqTileAlert = "";
		
		if (tag == "A") {
			if (reqAriaLabel){
		// Need to state if any more required letters are needing to be entered.
				var answerTextDiv = document.getElementById("answer");

				if (!answerTextDiv.hasChildNodes()) 
					return;
				
				var id = "";
				var answerTiles = answerTextDiv.childNodes;
				//loop through childNodes and make sure they are element nodes
				for (var i=0; i < answerTiles.length; ++i) {
					if (answerTiles[i].nodeType==Node.ELEMENT_NODE) {
						var tilePosition = ++tileNumber; 					
						var answerTileClass = answerTiles[i].getAttribute("class");

						if (answerTileClass == "required_active") {	
	
							var id = answerTiles[i].getAttribute("id");
							var idTextParts = id.split("_");
								// Label the required Tile. They are keyboard accessible once they have input in them.		
								var reqTilePosition = tilePosition -1;
								var labelReqTileAlert = " Please note: Letter " + idTextParts[0] +" letter "+idTextParts[1] + " at letter position "+reqTilePosition + " still needs to be entered.";					
						}
						
					}
					
				}	
			
				
			var helpText = reqAriaLabel+" Press spacebar if you want to wipe this letter and re enter it."+labelReqTileAlert;
			var quTextDiv = document.getElementById("question").getElementsByClassName("question")[0]; 
			
			var descQu1 = document.createElement("div");
			// give it an id attribute called 'describedQuestion'
			descQu1.setAttribute("class", "question");
			//This is not how you are supposed to use an alert, but aria-live assertive just will not work by itself.
			descQu1.setAttribute("role", "alert");
			descQu1.setAttribute("aria-live", "assertive");
			descQu1.setAttribute("aria-relevant", "text");
			descQu1.setAttribute("aria-atomic", "true");
			
			var descQu1_content = document.createTextNode(helpText);
			// apply that content to the new element
			descQu1.appendChild(descQu1_content);
			// replace existing node descQu2 with the new div element descQu1. 
			quTextDiv.parentNode.replaceChild(descQu1, quTextDiv);	
		}
	}			
}

function onFormNodeInserted(evt) {
	var target = evt.target;
	if (target.nodeType != Node.ELEMENT_NODE)
		return;
	if (target.tagName != "A")
		return;

	var answerTextDiv = document.getElementById("answer");

	if (!answerTextDiv.hasChildNodes()) 
		return;
	
	var tileNumber = 0;
	var tilePosition = 0;
	var reqTotal = 0;
	var linkCount =0;
	var id = "";
	var idTextParts = "";

	var answerTiles = answerTextDiv.childNodes;
	//loop through childNodes and make sure they are element nodes
	for (var i=0; i < answerTiles.length; ++i) {
		if (answerTiles[i].nodeType==Node.ELEMENT_NODE) {
			var tilePosition = ++tileNumber; 					
			var answerTileClass = answerTiles[i].getAttribute("class");
			//	var answerTileId = answerTile.getAttribute("id");
			if (answerTileClass == "required") {
				var reqTotal = ++reqTotal;					
			} 
				else if (answerTileClass == "required_active") {	
					var id = answerTiles[i].getAttribute("id");
					var idTextParts = id.split("_");
					// Label the required Tile. They are keyboard accessible once they have input in them, so when user arrows onto them, they should know they are on an actual Tile, not the hyperlink keyboard letter.		
					var reqTilePosition = tilePosition -1;
					
					var labelReqTile = "You are focused on " + idTextParts[0] + " letter "+idTextParts[1] +", at letter position "+reqTilePosition + " in the security answer word.";
					target.setAttribute("aria-label", labelReqTile);
					var reqTotal = ++reqTotal;						
			}
			
		}
		
	}

	var linksKB = document.getElementsByTagName("A");
	for (var i=0; i < linksKB.length; ++i) {
		if (linksKB[i].getAttribute("href") == "#"){
			var linkCount = ++linkCount;
			
		}
	}
	
	//Take away the number of alphabet links to get required letters filled out.
	var reqCount = linkCount - 28;

	if (reqCount == reqTotal){
		
		var helpText = "You have entered all the required answer letters. To submit your answer, navigate to the Proceed button and press Enter. If you want to review your entries, navigate to main landmark, and Tab to each of your letter entries, to review or change them.";

		var quTextDiv = document.getElementById("question").getElementsByClassName("question")[0]; 		
		var descQu1 = document.createElement("div");
		// give it an id attribute called 'describedQuestion'
		descQu1.setAttribute("class", "question");
		//This is not how you are supposed to use an accessible notice, but aria-live assertive just will not work by itself...
		//Or maybe it's just my brain won't work by itself... not sure which option is True in this case.
		descQu1.setAttribute("role", "alert");
		descQu1.setAttribute("aria-live", "assertive");
		descQu1.setAttribute("aria-relevant", "text");
		descQu1.setAttribute("aria-atomic", "true");
		
		var descQu1_content = document.createTextNode(helpText);
		// apply that content to the new element
		descQu1.appendChild(descQu1_content);
		// replace existing node descQu2 with the new div element descQu1. 
		quTextDiv.parentNode.replaceChild(descQu1, quTextDiv);	
	}
		
}


function onAttrModified(evt) {
var attrName = evt.attrName;
if (attrName != "class")
	return;
var target = evt.target;
var classes = target.getAttribute("class");
if (!classes)
	return;

var tileNumber = 0;
var reqTotal = 0;
var reqCount = 0;
var inputTileCount = 0;
var id = "";
var helpText = "";

if (classes == "required_active") {
	
	
	var answerTextDiv = document.getElementById("answer");

		if (!answerTextDiv.hasChildNodes()) 
			return;
		
		var answerTiles = answerTextDiv.childNodes;
		//loop through childNodes and make sure they are element nodes
		for (var i=0; i < answerTiles.length; ++i) {
			if (answerTiles[i].nodeType==Node.ELEMENT_NODE) {
				var tilePosition = ++tileNumber; 					
				var answerTileClass = answerTiles[i].getAttribute("class");

				if (answerTileClass == "required_active") {
							
					var reqTilePosition = tilePosition -1;
					var reqTotal = ++reqTotal;

				} 
				else if (answerTileClass == "required") {	
					var reqTotal = ++reqTotal;						
				}	
				
			}
			
		}

	var tileTotal = tilePosition -1;
	var quTextDiv = document.getElementById("question").getElementsByClassName("question")[0]; 
	
	var helpText = "The Security question is: " + quText + " There are "+ tileTotal+" letters in your answer. The letter you currently have to input is at position "+reqTilePosition+" .";
	// Replace question div innerHTML with more descriptive Text
	// create an empty element node to replace current Security Question node
	var descQu1 = document.createElement("div");
	// give it an id attribute called 'describedQuestion'
	descQu1.setAttribute("class", "question");
	//This is not how yu are supposed to use an alert, but aria-live assertive just will not work by itself.
	descQu1.setAttribute("role", "alert");
	descQu1.setAttribute("aria-live", "assertive");
	descQu1.setAttribute("aria-relevant", "text");
	descQu1.setAttribute("aria-atomic", "true");
	
	var descQu1_content = document.createTextNode(helpText);
	// apply that content to the new element
	descQu1.appendChild(descQu1_content);
	// replace existing node descQu2 with the new div element descQu1. 
	quTextDiv.parentNode.replaceChild(descQu1, quTextDiv);	
	
	} 
}


function onLoad(evt) {

var tileNumber = 0;
var reqTotal = 0;
//**
var id = "";
var helpText = "";

//Create an accessible landmark the user can navigate to easily. Focus control is damned annoying in this web app.
var questionTextDiv = document.getElementById("question");
questionTextDiv.setAttribute("role", "main");

// Security question Answer tiles are not keyboard accessible.
var answerTextDiv = document.getElementById("answer");
if (!answerTextDiv.hasChildNodes()) 
	return;

var answerTiles = answerTextDiv.childNodes;
//loop through childNodes and make sure they are element nodes
for (var i=0; i < answerTiles.length; ++i) {
	if (answerTiles[i].nodeType==Node.ELEMENT_NODE) {
		var tileNumber = ++tileNumber; 
		
		if (answerTiles[i].getAttribute("onmousedown")) {
			var mouseAction = answerTiles[i].getAttribute("onmousedown");
			var keyPressFnc = "var charCode = event.charCode || event.keyCode || event.which; if ((charCode == 13) || (charCode == 32)) "+mouseAction;
			answerTiles[i].setAttribute("onkeypress", keyPressFnc);
		}

		var answerTileClass = answerTiles[i].getAttribute("class");

		if (answerTileClass == "required_active") {	
			var id = answerTiles[i].getAttribute("id");
				
				// Label the required Tile. They are keyboard accessible once they have input in them, so when user arrows/Tabs onto them, they should know they are on an actual Tile, not the hyperlink selection keyboard letter.		
			var reqTilePosition = tileNumber -1;
			var reqTotal = ++reqTotal;
			answerTiles[i].setAttribute("role", "gridcell");					
			
		}	else if (answerTileClass == "required") {	

			var reqTotal = ++reqTotal;
			answerTiles[i].setAttribute("role", "gridcell");
		}		
	}		
}

var tileTotal = tileNumber -1;
var helpText = "The Security question is: " + quText + " There are "+ tileTotal+" letters in your answer. The letter you currently have to input is at position "+reqTilePosition+" . Tab to the letter and press enter, to input the required letter. ";
// Replace question div innerHTML with more descriptive Text
// create an empty element node to replace current Security Question node
var descQu1 = document.createElement("div");
// give it an id attribute called 'describedQuestion'
descQu1.setAttribute("class", "question");
descQu1.setAttribute("role", "alert");
descQu1.setAttribute("aria-live", "assertive");
descQu1.setAttribute("aria-relevant", "text");
descQu1.setAttribute("aria-atomic", "true");
// create some content for the new element.
var descQu1_content = document.createTextNode(helpText);
// apply that content to the new element
descQu1.appendChild(descQu1_content);
// replace existing node descQu2 with the new div element descQu1. 
quTextDiv.parentNode.replaceChild(descQu1, quTextDiv);	

// Put aria role and onkeypress event on the letter selection tiles
// Security question Answer tiles are not keyboard accessible.
var selTextDiv = document.getElementsByClassName("keyboard clearfix");
if (!selTextDiv[0].hasChildNodes()) 
	return;

var selLetters = selTextDiv[0].childNodes;
//loop through childNodes and make sure they are element nodes
for (var i=0; i < selLetters.length; ++i) {
	if (selLetters[i].nodeType==Node.ELEMENT_NODE) {

		//aria-label not read out with ORCA
		//selLetters[i].setAttribute("aria-label", "press enter to select this letter");

		if (selLetters[i].getAttribute("onmousedown")) {
			var mouseSelAction = selLetters[i].getAttribute("onmousedown");
			var keyPressSelFnc = "var charCode = event.charCode || event.keyCode || event.which; if ((charCode == 13) || (charCode == 32)) " +mouseSelAction;
			selLetters[i].setAttribute("onkeypress", keyPressSelFnc);
			
		}					
					
	}		
}


// Remove keyboard error messages as they don't really add correct info for a keyboard user
var keyboardTextDiv = document.getElementById("es_input");
if (!keyboardTextDiv.hasChildNodes()) 
	return;

var kbTextDiv = keyboardTextDiv.childNodes;
//loop through childNodes and make sure they are element nodes
for (var i=0; i < kbTextDiv.length; ++i) {
	if (kbTextDiv[i].nodeType==Node.ELEMENT_NODE) {

		if (kbTextDiv[i].getAttribute("id") == "keyboard_letter_help")
			keyboardTextDiv.removeChild(keyboardTextDiv.childNodes[i]);					
					
	}		
}

}

window.addEventListener("load", onLoad);
document.addEventListener("DOMAttrModified", onAttrModified, false);
document.addEventListener("DOMNodeInserted", onFormNodeInserted, false);
document.addEventListener("focus", onFocus, true);
	
