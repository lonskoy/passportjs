const express = require('express')
const router = express.Router()
const fs = require('fs/promises')

router.post('/:bookId/incr', async(req, res) => {
    const id = req.params.bookId
    const db = JSON.parse(await fs.readFile('db.json', 'utf-8'))
    const findIndex = db.findIndex((item) => item.id === id)
    if (findIndex !== -1) {
        const updateObj = {
            ...db[findIndex],
            counter: ++db[findIndex].counter
        }
        db.splice(findIndex, 1);
        db.push(updateObj);
        await fs.writeFile('db.json', JSON.stringify(db))
        res.json(db[findIndex].counter)  
    }
    else {
        const newObj = {
            id: id,
            counter: 1
        }
        db.push(newObj);
        await fs.writeFile('db.json', JSON.stringify(db))
        res.json(newObj.counter)
    }
})

router.get('/:bookId', async(req, res) => {
    const id = req.params.bookId;
    const db = fs.readFile('db.json', 'utf-8')
    const findIndex = db.findIndex((item) => item.id === id)
    if (findIndex !== -1) {
        res.json(db[findIndex.counter])
    }
    else {
        res.json(0)
    }
})

module.exports = router
