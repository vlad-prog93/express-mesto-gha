const router = require('express').Router()
const express = require('express')
const { getCards, deleteCard, createCard } = require('../controllers/cards')

router.delete('/:cardId', deleteCard)
router.get('/', getCards)
router.post('/', express.json(), createCard)
router.put('/:cardId/likes', likeCard)
router.delete('/:cardId/likes', dislikeCard)

module.exports = router