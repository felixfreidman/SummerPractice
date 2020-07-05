// Andrew's code 
let elem = document.getElementById("board1");

function contextMenuListener(elem) {
	document.addEventListener("contextmenu", function(event) {
		if (clickInsideElement(event, "board1")){
			event.preventDefault();
			toggleMenuOn();
			positionMenu(event);
		} else {
			clickListener();
			keyUpListener();
			toggleMenuOff();
		}
	});	
}
let menuState = 0;
let menu = document.getElementById("context_menu");

function clickInsideElement(elem, className) { //проверка, в каком элементе сделан клик
	let el = elem.srcElement || elem.target;
	if (el.classList.contains(className)) {
		return el;
	} else {
		while (el = el.parentNode) {
      		if (el.classList && el.classList.contains(className)) {
        		return el;
      		}
		}
	}
	return false;
}

function toggleMenuOn() { //включение меню
	if (menuState !== 1) {
		menuState = 1;
		menu.classList.add("context_menu_active");
	}
}

function toggleMenuOff() { //выключение меню
	if (menuState !== 0) {
		menuState = 0;
		menu.classList.remove("context_menu_active");
	}
}

function clickListener() {
	document.addEventListener('click', function(event){
		let button = event.which || event.button;
		if (button == 1) {
			toggleMenuOff();
		}
	});
}

function keyUpListener() {
	window.onkeyup = function(event) {
		if (event.code == 27) {
			toggleMenuOff();
		}
	}
}

function getPosition(event) {
	let posx = 0;
	let posy = 0;

	if (!event) {
		let event = window.event;
	}

	if (event.pageX || event.pageY) {
	    posx = event.pageX;
	    posy = event.pageY;
 	} else if (event.clientX || event.clientY) {
	    posx = event.clientX + document.body.scrollLeft + 
	                       document.documentElement.scrollLeft;
	    posy = event.clientY + document.body.scrollTop + 
                       document.documentElement.scrollTop;
  	}
 
  	return {
    	x: posx, y: posy
  	}
}

let menuPosition;
let menuPositionX;
let menuPositionY;

function positionMenu(event) {
	menuPosition = getPosition(event);
	console.log(menuPosition);
	menuPositionX = menuPosition.x + "px";
  	menuPositionY = menuPosition.y + "px";
  	menu.style.left = menuPositionX;
  	menu.style.top = menuPositionY;
}


let canvasOutput = document.querySelector("#output");
function onMenuItemClick() {
	let items = document.getElementsByClassName("first_list_item");
	for (var i = 0; i < items.length; i++) {
		items[i].addEventListener("click", function(event) {
			switch(event.target.id) {
				case "transform":
				enterParams();
				toggleMenuOff();
				break;
				case "cancel":
                canvasOutput.style.transform = "none";
				toggleMenuOff();
				break;
				default:
					alert("oops!");
			}
		}); 
	}
}

function isEmpty(str) {
    return !str.trim().length;
}

function enterParams() {
	let elem  = document.getElementsByTagName("dialog");
	elem[0].style.display = "block";
	let button = document.getElementsByClassName("button");
	let transform_string = "";
	button[0].addEventListener("click", function(event) {
		let inputs = document.getElementsByClassName("digit_input");
		for (var i = 0; i < inputs.length; i++) {
			if (isEmpty(inputs[i].value)) {
				inputs[i].value = 0;
			}
		}	
		transform_string = "matrix(" + inputs[0].value + ", " + inputs[2].value + ", " 
		+ inputs[4].value + ", " + inputs[1].value + ", " + inputs[3].value + ", " 
		+ inputs[5].value + ")";
		// console.log(transform_string);
		// console.log(cameraView.lastChild);
        elem[0].style.display = "none";
		cameraView.lastChild.style.transform = transform_string;
	});
}

contextMenuListener(elem);
onMenuItemClick();

// end