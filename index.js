"use strict"

let imgLabel = '<img class="image" src=image/img$n.png />'

let board1 = document.querySelector(".board1");
let board2 = document.querySelector(".board2");
let board3 = document.querySelector(".board3");


setSquares(board1, '1.');
setSquares(board2, '2.');
// setSquares(board3, '3.');

setLabels();

setDraggable();
setDroppable();

html2canvas(document.querySelector(".board2")).then(canvas => {
    canvas.id = "output";
    document.querySelector("#cameraView").appendChild(canvas);
});


let mode = false;

document.querySelector("#waves").addEventListener("click", (event)=> {
    mode = event.target.checked;

    properties();
})



// fetch('https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits')
//   .then(response => response.json())
//   .then(commits => alert(commits[0].author.login));

// let response = await fetch('https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits');

// // получить один заголовок
// alert(response.headers.get('Content-Type')); // application/json; charset=utf-8

// // перебрать все заголовки
// for (let [key, value] of response.headers) {
//   alert(`${key} = ${value}`);
// }


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

    properties();
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

    properties();
    
}


function showLabelAt(coord, label) {
    document.getElementById(coord).innerHTML = label;

    // async function send() {

    //     let figure = {
    //         "img": label,
    //         "position": coord 
    //     } 
    //     // position = куда, img - id картинки
        
    //     // случайный url
    //     let url = 'https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits';
    
    //     let response = await fetch(url, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json;charset=utf-8'
    //           },
    //         body: JSON.stringify(figure)
    //     });
    
    //     if (response.ok) { // если HTTP-статус в диапазоне 200-299
    //     // получаем тело ответа (см. про этот метод ниже)
    //         let result = await response.json();
    //         alert(result.message);
    //     } else {
    //         alert("Ошибка HTTP: " + response.status);
    //     }
    
    // }
    
    // send();
}


function mirror(toCoord, file) {
    let position = +(toCoord.substring(2));
    position = 8*(Math.trunc(position / 8) + 1) - 1 - position % 8;

    document.getElementById(`2.${position}`).innerHTML = file;
}


function waves(canvas) {
    let ca = document.getElementById('output');
    let ctx = ca.getContext('2d');

    ca.width = canvas.width;
    ca.height = canvas.height;

    let params = {
        AMP: 20,
        FREQ: 0.03,
    };

    ctx.clearRect(0, 0, ca.width, ca.height);
    for (var i = 0; i < canvas.height; i++) {
        let ofs = params.AMP * Math.sin(i * params.FREQ);
        ctx.drawImage(canvas,
                0, i, canvas.width, 1,
                0 + ofs, i, canvas.width, 1);
    }
}

function getBack(canvas) {
    let parent = document.querySelector("#cameraView");
    parent.removeChild(parent.lastChild);

    canvas.id = "output";
    parent.appendChild(canvas);
}

function properties() {
    html2canvas(document.querySelector(".board2")).then(canvas => {
        if (mode)
            waves(canvas);
        else {
            getBack(canvas);
        }
    });
}
