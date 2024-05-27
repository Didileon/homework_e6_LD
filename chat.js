let ws = new WebSocket('ws://localhost:8050/ws');
let messages = document.getElementById('messages');
let nick = document.getElementById('nick');
let start = document.getElementById('start');
let exit = document.getElementById('exit');
let topName = document.getElementById('topName');
let userList = document.getElementById("users");
let userMap = new Map ();


let msgToSend = {
    nickName: null,
    body: null,
};

nick.addEventListener('change', function () {
    msgToSend.nickName = nick.value;
});
messages.addEventListener('change', function () {
    msgToSend.body = messages.value;
});
start.addEventListener('click', function (event) {
    topName.innerHTML = nick.value;
    if (msgToSend.nickName == "" || msgToSend.nickName == null) {
        return;

    } else {
        ws.send(JSON.stringify(msgToSend));
        nick.value = null;
    }
    

    topName.style.visibility = 'visible';
    exit.style.visibility = 'visible';
    nick.style.visibility = 'hidden';
    start.style.visibility = 'hidden';
});

document.forms.publish.addEventListener('keydown', function (event) {
    if (event.code == 'Enter' || event.code == 'NumpadEnter') {
        event.preventDefault();
        msgToSend.body = this.elements.message.value; // обращаемся к элементу формы по его имени
        ws.send(JSON.stringify(msgToSend));
        this.elements.message.value = '';
        msgToSend.body = null;
    }
});
ws.onopen = function () {
    ws.send(
        JSON.stringify({
            test: 'hi webS!',
        })
    );
};

ws.onmessage = function (event) {
    console.log(JSON.parse(event.data));
    let incomingMessage = JSON.parse(event.data);

    if (incomingMessage.body == null); {
        addUsers(incomingMessage.nickConteiner);
    }

    showMessage(incomingMessage);
};

function showMessage(message) {
    console.log(message);
    let msgConteiner = document.createElement('div');
    msgConteiner.classlist.add('msgConteinerInChat');
    let userNameInChat = document.createElement('div');
    let msgInChat = document.createElement('div');
    msgInChat = document.createElement('div');
    msgInChat.classList.add('msgInChat');

    userNameInChat.innerHTML = `${message.nickName}: `;
    msgInChat.innerHTML = `${message.body}`;

    //внеш ид для пользователя

    msgConteiner.append(userNameInChat);
    msgConteiner.append(msgInChat);
    message.append(msgConteiner);
}

function addUsers(nick) {
    if (userMap.has(nick) || nick == undefined) {
        return
    } else {
        userMap.set(nick, createUserDiv(nick));
        showUsers(userMap);
    }
}

function createUserDiv(nick) {
    let nickConteiner = document.createElement("div");
    nickConteiner.innerHTML = `${nick}\n`;
    nickConteiner.classList.add("nickInList");
    return nickConteiner;
}

function showMessage(map) {
    userList.innerHTML = "";
    map.forEach((value) => {
        userList.append(value);
    });

    if (map.size > 1) {
        userList.style.height = map.size * getDivHeight(map) + 5 + "px";
    } else {
        userList.style.height = 30 + "px";
    }

    function getDivHeight(map) {
        let divHeight = 0;
        map.forEach((value) => {
            divHeight = value.getBoundingClientRect().height;
        });
        return divHeight  + 5;
    }
}
