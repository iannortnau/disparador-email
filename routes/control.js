const express = require('express');
const multer = require('multer');
const axios = require("axios");
const e = require("express");
const router = express.Router();

const url = "http://82.180.160.211:3000";
const token = "a405f178-aacc-4973-a8a6-c29298140381";
/* GET users listing. */
router.post('/', multer().none(), async function (req, res, next) {
    const comand = req.body.subject.toLowerCase().replaceAll(" ", "");
    let from = req.body.from;

    let email = getEmail(from);

    console.log("Comando: "+comand);
    console.log("Email de Origem: "+email);

    if (comand === "criachave") {
        console.log("criando chave");

        try{
            const response = await axios.post(url + "/validation",{},{headers:{token:token}});

            console.log(response.data);


            if(response.status === 200){
                console.log("Chave Criada");
            }
        }catch (e) {
            console.log(e.response.data);
        }

    }
    if (comand === "listachaves") {
        console.log("listando chaves");
    }
    if (comand === "registraemail") {

    }
    if (comand === "deletaemail") {

    }
    res.send('server');
});

function getEmail(from){
    let email = "";
    let ativa = 0;
    for (let i = 0; i < from.length; i++) {
        if (from[i] === "<") {
            ativa = 1;
        }
        if (from[i] === ">") {
            break;
        }
        if (ativa === 1 && from[i] !== "<") {
            email += from[i];
        }
    }
    return email;
}

module.exports = router;
