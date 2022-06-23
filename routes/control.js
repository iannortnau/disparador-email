const express = require('express');
const multer = require('multer');
const axios = require("axios");
const router = express.Router();
const nodemailer = require("nodemailer");
const momentOrigin = require('moment');

function moment(){
    return momentOrigin().add(-3,'h');
}


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "controle.disparador@gmail.com",
        pass: "kbxtymclrkzmarkd"
    }
});


const url = "http://82.180.160.211:3000";
const token = "a405f178-aacc-4973-a8a6-c29298140381";
/* GET users listing. */
router.post('/', multer().none(), async function (req, res, next) {
    const comand = req.body.subject.toLowerCase().replaceAll(" ", "");
    let from = req.body.from;
    let email = getEmail(from);

    if(!await validateEmail(email)){
        if(email !== "controle.disparador@gmail.com"){
            return res.status(503).send();
        }
    }

    console.log("Entrada: "+ moment().format("DD/MM/YYYY|HH:mm:ss"));
    console.log("Comando: "+comand);
    console.log("Email de Origem: "+email);

    if (comand === "criachave") {
        console.log("criando chave");

        try{
            const response = await axios.post(url + "/validation",{},{headers:{token:token}});

            console.log("Chave Criada: "+moment().format('DD/MM/YYYY|HH:mm:SS'));
            const emailResponce = await transporter.sendMail({
                to: email,
                subject: "NOVA CHAVE CRIADA",
                text: "Chave Criada:\n   id:" + response.data.id + "\n   " + "key:" + response.data.key
            });
            console.log(emailResponce);
        }catch (e) {
            console.log("Erro: "+ moment().format("DD/MM/YYYY|HH:mm:ss"));
            console.log(e.response.message);
        }

    }
    if (comand === "listachaves") {
        console.log("listando chaves");

        try{
            const response = await axios.get(url + "/validation",{headers:{token:token}});

            let keys = "";
            for (let i = 0; i < response.data.length; i++) {
                const key = response.data[i];
                console.log(key);
                const createDate = key.createdAt
                const endDate = moment(key.createdAt).add(30, 'd').format('DD/MM/YYYY');
                const restOfValidDays = moment(key.createdAt).diff(moment(key.createdAt).add(30, 'd'),  'd');

                keys += `
                    Chave: ${key.key}
                    Id: ${key.id}
                    Data de Criação: ${createDate}
                `
            }

            console.log("Chaves Listadas: "+moment().format('DD/MM/YYYY|HH:mm:SS'));
            const emailResponce = await transporter.sendMail({
                to: email,
                subject: "LISTA DE CHAVES EXISTENTES",
                text: keys
            });
            if(emailResponce.response.indexOf('OK')){
                console.log("Email enviado para: ", email);
                console.log("As: "+moment().format('DD/MM/YYYY|HH:mm:SS'));
            }
        }catch (e) {
            console.log("Erro: "+ moment().format("DD/MM/YYYY|HH:mm:ss"));
            console.log(e.response.message);
        }

    }
    if (comand === "registraemail") {
        console.log("registrando email");

        const registerEmail = req.body.body.toLowerCase();

        try{
            const response = await axios.post(url + "/email",{email: registerEmail},{headers:{token:token}});

            console.log("Email Registado: "+ moment().format('DD/MM/YYYY|HH:mm:SS'));
            const emailResponce = await transporter.sendMail({
                to: email,
                subject: "EMAIL REGISTRADO",
                text: response.data.email
            });
            if(emailResponce.response.indexOf('OK')){
                console.log("Email enviado para: ", email);
                console.log("As: "+moment().format('DD/MM/YYYY|HH:mm:SS'));
            }
        }catch (e) {
            console.log("Erro: "+ moment().format("DD/MM/YYYY|HH:mm:ss"));
            console.log(e.response.data.message);

            const emailResponce = await transporter.sendMail({
                to: email,
                subject: "EMAIL JÁ REGISTRADO",
                text: "Mande \"Listar Emails\" no assunto do email para \"controle.disparador@system.email2http.net\" para listar todos os emails já registrados"
            });
            if(emailResponce.response.indexOf('OK')){
                console.log("Email enviado para: ", email);
                console.log("As: "+moment().format('DD/MM/YYYY|HH:mm:SS'));
            }
        }
    }
    if (comand === "listaemails") {
        console.log("listando emails");

        try{
            const response = await axios.get(url + "/email",{headers:{token:token}});

            console.log("Emails Listados: "+ moment().format('DD/MM/YYYY|HH:mm:SS'));
            let emails = "";
            for (let i = 0; i < response.data.length; i++) {
                const auxEmail = response.data[i];

                emails+= auxEmail.email+ "\n";
            }
            const emailResponce = await transporter.sendMail({
                to: email,
                subject: "EMAILS REGISTRADOS",
                text: emails
            });
            if(emailResponce.response.indexOf('OK')){
                console.log("Email enviado para: ", email);
                console.log("As: "+moment().format('DD/MM/YYYY|HH:mm:SS'));
            }
        }catch (e) {
            console.log("Erro: "+ moment().format("DD/MM/YYYY|HH:mm:ss"));
            console.log(e.response.data.message);
        }
    }
    if (comand === "deletaemail") {
        console.log("deletando email");

        const removeEmail = req.body.body.toLowerCase();

        try{
            const response = await axios.delete(url + "/email/" + removeEmail,{headers:{token:token}});

            console.log("Email Removido: "+ moment().format('DD/MM/YYYY|HH:mm:SS'));
            const emailResponce = await transporter.sendMail({
                to: email,
                subject: "EMAIL REMOVIDO",
                text: response.data.email
            });
            if(emailResponce.response.indexOf('OK')){
                console.log("Email enviado para: ", email);
                console.log("As: "+moment().format('DD/MM/YYYY|HH:mm:SS'));
            }
        }catch (e) {
            console.log("Erro: "+ moment().format("DD/MM/YYYY|HH:mm:ss"));
            console.log(e.response.data.message);

            const emailResponce = await transporter.sendMail({
                to: email,
                subject: "EMAIL NÃO REGISTRADO",
                text: "Mande \"Listar Emails\" no assunto do email para \"controle.disparador@system.email2http.net\" para listar todos os emails já registrados"
            });
            if(emailResponce.response.indexOf('OK')){
                console.log("Email enviado para: ", email);
                console.log("As: "+moment().format('DD/MM/YYYY|HH:mm:SS'));
            }
        }
    }
    res.send('Ok');
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

async function validateEmail(email){
    try {
        const response = await axios.get(url + "/email/" + email,{headers:{token:token}});

        if(response.status === 200){
            return true;
        }
    }catch (e) {
        return false;
    }
}

module.exports = router;
