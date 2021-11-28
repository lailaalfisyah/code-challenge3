const express = require('express');
const router = express.Router();
let users = require('./data/users.json');
let admin = require('./data/admin.json');
const { UserGame, UserGameBiodata } = require('./models')

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Landing Page'
    })
})

router.get('/login', (req, res) => {
    res.status(200).json(users);
})

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const name = users[0].name;
    const matchUser = users.find(data => data.username === username);
    const matchPass = users.find(data => data.password === password);

    if (!matchUser && !matchPass) {
        res.send('Hmm ... username dan password kamu salah nih')
    } else if (matchUser) {
        if (matchPass) {
            console.log(`Hai, ${name}! Kamu telah berhasil login.`)
            res.redirect('/suit-game')
        } else {
            res.send(`Ups! Salah password, silakan coba lagi ya.`);
            
        }
    } else {
        res.send('Ups! Username yang kamu masukkan salah.');
    }  
})

router.get('/suit-game', (req, res) => {
    res.render('suit-game', {
        title: 'Suit'
    })
})

// DASHBOARD ADMIN

router.get('/admin-login', (req, res) => {
    res.render('admin/form-login', {
        title: 'Login Admin'
    })
})

router.post('/admin-login', (req, res) => {
    const { username, password } = req.body;
    const matchUserAdmin = admin.find(data => data.username === username);
    const matchPassAdmin = admin.find(data => data.password === password);

    if (!matchUserAdmin && !matchPassAdmin) {
        res.redirect('/admin-login')
        console.log('username dan password salah')
        console.log(req.body)
    } else if (matchUserAdmin) {
        if (matchPassAdmin) {
            res.redirect('/admin-dashboard')
            console.log('berhasil')
        } else {
            res.redirect('/admin-login')
            console.log('password salah')    
        }
    } else {
        res.redirect('/admin-login')
        console.log('username salah');
    }  
})

router.get('/admin-dashboard', (req, res) => {
    UserGame.findAll().then(usergames => {
        res.render('admin/dashboard', {
            title: 'Dashboard Admin',
            usergames
        })
    })  
})


router.get('/biodata/:id', (req, res) => {
    UserGame.findOne({
        where: {id: req.params.id}
    })

    UserGameBiodata.findOne({
        where: {id: req.params.id-6}
    })
    .then(usergame => {
        res.redirect('/detail-data')
    }) 
})

router.get('/create', (req, res) => {
    res.render('admin/tambah-data', {
        title: 'Tambah Data'
    })
})

router.post('/create', (req, res) => {
    UserGame.create({
        username: req.body.username
    })

    UserGameBiodata.create({
        // userID: req.params.userID,
        fullName: req.body.fullName,
        gender: req.body.gender
    })
    .then(usergame => {
        res.redirect('/admin-dashboard')
    })
})

router.get('/edit-data', (req, res) => {
    res.render('admin/edit-data')
})

router.get('/update/:id', (req, res) => {
    UserGame.findOne({
        where: {id: req.params.id}
    })

    UserGameBiodata.findOne({
        where: {id: req.params.id-6}
    })
    .then(usergame => {
        res.redirect('/edit-data', {
            title: 'Edit Data User'
        })
    })
})

router.post('/update/:id', (req, res) => {
    UserGame.update({
        username: req.body.username
    }, {
        where: {id: req.params.id}
    })

    UserGameBiodata.update({
        fullName: req.body.fullName,
        gender: req.body.gender
    }, {
        where: {id: req.params.id-6}
    })
    .then(usergame => {
        res.redirect('admin-dashboard')
    })
})

router.get('/delete/:id', (req, res) => {
    UserGame.destroy({
        where: {id: req.params.id}
    })

    UserGameBiodata.destroy({
        where: {id: req.params.id-6}
    })
    .then(usergame => {
        res.redirect('/admin-dashboard')
    })
})

module.exports = router;