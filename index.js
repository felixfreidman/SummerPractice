"use strict"

let imgLabel = '<img class="image" src=image/img$n.png />'

let board1 = document.querySelector(".board1");
let board2 = document.querySelector(".board2");

setSquares(board1, '1.');
setSquares(board2, '2.');

setLabels();

setDraggable();
setDroppable();


let xhr = new XMLHttpRequest();

let url = new URL('https://google.com/search');
url.searchParams.set('q', 'test me!');

xhr.open('GET', '/article/xmlhttprequest/example/json');

xhr.responseType = 'json';

xhr.send();

// тело ответа {"сообщение": "Привет, мир!"}
xhr.onload = function() {
  //let responseObj = xhr.response;
  alert(xhr.status);
  //alert(responseObj.message); // Привет, мир!
};
  
xhr.onprogress = function(event) {
    if (event.lengthComputable) {
      alert(`Получено ${event.loaded} из ${event.total} байт`);
    } else {
      alert(`Получено ${event.loaded} байт`); // если в ответе нет заголовка Content-Length
    }
  
  };
  
xhr.onerror = function() {
    alert("Запрос не удался");
  };


document.ondblclick = (event)=> {
    if (event.path[1].id.includes('1.')) {
        let position = +event.path[1].id.substring(2);

        let newPos = 8*(Math.trunc(position / 8) + 1) - 1 - position % 8;

        document.getElementById(`1.${position}`).innerHTML = "";
        document.getElementById(`2.${newPos}`).innerHTML = "";
    }
}

document.onclick = event=> {
    if (event.path[1].id.includes('1.')) {
        let deg = 0;

        let position = +(event.path[1].id.substring(2));
        position = 8*(Math.trunc(position / 8) + 1) - 1 - position % 8;

        if (!event.target.style.transform) {
            deg = -90;
        } else {
            deg = event.target.style.transform;
            deg = deg.substring(7);
            deg = +deg.substring(0, deg.indexOf("deg") )
            deg -= 90;
        }

        let devi = Math.random() * 3;

        deg += ( (Math.random() < 0.5) ? devi : -devi);

        console.log(deg);

        event.target.style.transform = `rotate(${deg}deg)`;
        document.getElementById(`2.${position}`).children[0].style.transform = `rotate(${-deg}deg)`;
    }
}

function setDraggable() {
    $('.image').draggable({ revert: true });
}

function setDroppable() {
    $(".square").droppable({
        drop: (event, ui)=> {
            let from = ui.draggable.context.id;
            let to = event.target.id;

            if (!to.includes('2.')) moveLabel(from, to, from);
        }
    });
}

function setSquares(parent, board) {
    for (let coord = 0; coord < 80; coord++) {
        let div = document.createElement("div");
        div.className = "square";
        div.id = board + coord;

        parent.append(div);
    }
}

function setLabels() {
    let bar = document.querySelector(".bar");

    for (let n=1; n <=12; n++) {
        let div = document.createElement("div");
        div.id = "label" + n;
        div.className = "label";
        div.style.backgroundImage = `url(image/img${n}.png`;

        div.innerHTML = `<img class="image" id=img${n} src=image/img${n}.png data-key=svg/img${n}.svg />`;

        bar.append(div);
    }
}

function moveLabel(fromCoord, toCoord, label) {
    let figure = `<img class="image" src=image/${label}.png data-key=svg/${label}.svg />`;

    showLabelAt(fromCoord, "");
    showLabelAt(toCoord, figure);

    let svg = `<img class="image" src=svg/${label}.svg />`;

    mirror(toCoord, svg);
}


function showLabelAt(coord, label) {
    document.getElementById(coord).innerHTML = label;
}


function mirror(toCoord, file) {
    let position = +(toCoord.substring(2));
    position = 8*(Math.trunc(position / 8) + 1) - 1 - position % 8;

    document.getElementById(`2.${position}`).innerHTML = file;
}
