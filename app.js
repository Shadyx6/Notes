var express = require('express')
var path = require('path')
const fs = require('fs')
var app = express()

// view engine setup

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res, next) {
    let arr = []
    fs.readdir('./files', function(err,files) {
    files.forEach(function(file) {
        let data = fs.readFileSync(`./files/${file}`, 'utf8')
        console.log(data)
        arr.push({name: file, details: data })
    })
    res.render('index', {files: arr})

    })
})
app.post('/create', function (req, res) {
    let fn = req.body.title.split(' ').join('') + '.txt'
    fs.writeFile(`./files/${fn}`, req.body.details, function (err,data) {
        if (err) return res.status(500).send(err)
        else res.redirect('/')
    })
    })
app.get('/delete/:name', function (req, res) {
    let fn = req.params.name.split(' ').join('')
    fs.unlink(`./files/${fn}`, function (err,data) {
        if (err) return res.status(500).send(err)
        else res.redirect('/')
    })
    
})
app.get('/edit/:file', function(req,res){
    let fn = req.params.file.split(' ').join('')
    fs.readFile(`./files/${fn}`, 'utf8', function(err,data){
        if (err) return res.status(500).send(err)
        else res.render('edit', {file: fn, details: data})
    })

    
})

app.post('/update/:name', function (req, res){
    let fn = req.params.name.split(' ').join('')
    fs.writeFile(`./files/${fn}`, req.body.details, function (err,data) {
        if (err) return res.status(500).send(err)
        else res.redirect('/')
    })
})
app.get('/read/:name', function (req, res){
    let fn = req.params.name.split(' ').join('')
    fs.readFile(`./files/${fn}`, 'utf8', function(err,data){
        if (err) return res.status(500).send(err)
        else res.render('read', {file: fn, details: data})
    })
})
app.listen(3000)