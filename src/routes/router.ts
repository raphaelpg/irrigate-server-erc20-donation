import { Router } from 'express';
import associationController from '../controllers/association.controller';
import userController from '../controllers/user.controller';
import messageController from '../controllers/contactMessage.controller';
import checkAuth from '../middlewares/checkAuth';
import checkRequestFields from '../middlewares/checkRequestFields';
import { rateLimiterSpam10, rateLimiterSpam40 } from '../middlewares/rateLimiter';

let router: Router = Router();

router.get('/api/associations', rateLimiterSpam40, associationController.getAssociations);
router.post('/api/association/add', rateLimiterSpam10, checkRequestFields("name", "description", "category", "continent", "country", "contactName", "contactEmail"), associationController.addAssociation);
router.delete('/api/association/delete', rateLimiterSpam10, checkRequestFields("name"), associationController.deleteAssociation);
router.patch('/api/association/update', rateLimiterSpam10, checkRequestFields(""), associationController.updateAssociation);
router.get('/api/user', rateLimiterSpam10, checkRequestFields(""), userController.getUser);
router.post('/api/user/add', rateLimiterSpam10, checkRequestFields(""), userController.register);
router.post('/api/user/login', rateLimiterSpam10, checkRequestFields(""), userController.login);
router.patch('/api/user/updateSubscriptions', rateLimiterSpam10, checkAuth, userController.updateUserAssociations);
router.delete('/api/user/delete', checkAuth, rateLimiterSpam10, checkRequestFields(""), userController.deleteUser);
router.post('/api/message/add', rateLimiterSpam10, checkRequestFields(""), messageController.sendMessage);

export = router;