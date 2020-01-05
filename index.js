const express = require('express')
const fs = require('fs')
const app = express()
const port = 3000

const xlsx = require('node-xlsx').default;

const workSheetsFromFile = xlsx.parse(`${__dirname}/vocabs.xlsx`);

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`, workSheetsFromFile[0].data))