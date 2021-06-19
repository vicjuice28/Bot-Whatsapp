const qrcode = require('qrcode-terminal');
const { Client, MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');
// Path where the session data will be stored
const SESSION_FILE_PATH = './session.json';
let sessionData;

// SI EXISTE SESIÓN INICIA EN ELLA
const withSession = () => {
    // Si exsite cargamos el archivo con las credenciales

    sessionData = require(SESSION_FILE_PATH);

    client = new Client({
        session: sessionData
    });

    client.on('ready', () => {
        console.log('Cliente listo!');


        listenMessage();



    });



    client.on('auth_failure', () => {

        console.log('** Error de autentificacion vuelve a generar el QRCODE (Borrar el archivo session.json) **');
    })


    client.initialize();
}


const withOutSession = () => {
    console.log('No tenemos session guardada');
    client = new Client();
    client.on('qr', qr => {
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log('Servidor listo!');

    });

    client.on('auth_failure', () => {
        console.log('** Error de autentificacion vuelve a generar el QRCODE **');
    })


    client.on('authenticated', (session) => {
        // Guardamos credenciales de de session para usar luego
        sessionData = session;
        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
            if (err) {
                console.log(err);
            }
        });
    });

    client.initialize();
}

(fs.existsSync(SESSION_FILE_PATH)) ? withSession() : withOutSession();


//Constantes


//Variables
let isChoosing = false;
let isChoosinNhielitos = false;
let nhielitos;
let chooseAgain = false;

let hielito = {
    sabor : "",
    cantidad : 0
}

const hielitos = {
    "1": {
        sabor: "Chocolate 🍫",
        cantidad : 10,
        precio: 10
        
    },

    "2": {
        sabor: "Fresa 🍓",
        cantidad : 10 ,
        precio: 15
    },

    "3": {
        sabor: "Mango 🥭",
        cantidad : 10 ,
        precio: 20
    },
    
    "4":{
        sabor: "Galleta maria 🍪",
        cantidad : 10,
        precio: 20
    }
}

const menu = `👋🏼 Bienvenido a nuestro hogar donde vendemos hielitos 🍧
Estamos abiertos de 1:00 p.m. a 07:00 p.m.🕐

Vendemos hielitos de:

${hielitos[1].sabor}
${hielitos[2].sabor}
${hielitos[3].sabor}
${hielitos[4].sabor}


`
let sabores = "";
for(const key in object){
    sabores += `${key}. ${object[]}`
}


const menuOption = `¿De que hielitos gusta?

1. ${hielitos[1].sabor}
2. ${hielitos[2].sabor}
3. ${hielitos[3].sabor}
4. ${hielitos[4].sabor}
`

//Escucha mensaje
const listenMessage = () => {
    client.on('message', (msg) => {
        const { from, to, body } = msg;

        if (!isChoosing && isChoosinNhielitos) {
            console.log("Cliente esta escogiendo no hielitos")
            nhielitos = body;
            hielito.cantidad = nhielitos;
            console.log(hielito)

            let victor = '5216241689292@c.us'

            sendMessage(victor, `El cliente pidio ${hielito.cantidad} hielitos de ${hielito.sabor}`)
            
            
        }

        if (!isChoosing && !isChoosinNhielitos) {
            if (body === 'Hielitos') {
                console.log("Cliente va a pedir")
                sendMessage(from, menu)
                sendMessage(from, menuOption)

                isChoosing = true;

            }

        }

        if (isChoosing && !isChoosinNhielitos) {
            //body tiene el número de 
            
            
            if (hielitos[body]) {
                sendMessage(from, `¿Cuantos va a querer de ${hielitos[body].sabor}?`)
                hielito.sabor = hielitos[body].sabor;
                isChoosinNhielitos = true;
                isChoosing = false;
            }
        }

        // if (isChoosing && !isChoosinNhielitos) {
        //     switch (body) {
        //         case '1':
        //             sendMessage(from, '¿Cuantos va a querer de Chocolate?')
        //             isChoosinNhielitos = true;
        //             isChoosing = false;
        //             hielito.sabor = "Chocolate";

        //             break
        //         case '2':
        //             sendMessage(from, '¿Cuantos va a querer de Fresa?');
        //             isChoosinNhielitos = true;
        //             isChoosing = false;
        //             hielito.sabor = "Fresa";
        //             break
        //         case '3':
        //             sendMessage(from, '¿Cuantos va a querer de Mango?');
        //             isChoosinNhielitos = true;
        //             isChoosing = false;
        //             hielito.sabor = "Mango";
        //             break

        //     }
        // }





    })




}


const sendMessage = (to, message) => {
    client.sendMessage(to, message)
}
