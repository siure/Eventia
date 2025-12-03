import express from 'express';
import { 
    registerForEvent,
    getMyRegistrations,
    getEventRegistrations,
    cancelRegistration 
} from '../controller/registrationController.js'; 
import { protect } from '../middleware/auth.js'; 

const router = express.Router();
// POST /api/events/:eventId/register
router.post('/events/:eventId/register', protect, registerForEvent);

// Liste des inscriptions de l'utilisateur
// GET /api/my-registrations
router.get('/my-registrations', protect, getMyRegistrations);

// Liste des inscriptions pour un événement (Organisateur seulement, vérification dans le contrôleur)
// GET /api/events/:eventId/registrations
router.get('/events/:eventId/registrations', protect, getEventRegistrations);

// Annulation d'une inscription
// DELETE /api/registrations/:id
router.delete('/registrations/:id', protect, cancelRegistration);

export default router;