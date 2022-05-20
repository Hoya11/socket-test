const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')

const { } = require('../controllers/likeController')

// 좋아요
router.post('/:familyId/:photoId', authMiddleware)

module.exports = router
