import express from 'express'
import userController from '../controllers/userController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/signup', userController.signup)
router.post('/login', userController.login)
router.post('/logout', authMiddleware, userController.logout)
router.put('/change-password', authMiddleware, userController.changePassword)
router.post('/forgot-password', userController.forgotPassword)
router.put('/reset-password/:token', userController.resetPassword)



export default router