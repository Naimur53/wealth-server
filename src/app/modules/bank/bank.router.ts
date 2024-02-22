import express from 'express';
        import validateRequest from '../../middlewares/validateRequest';
        import { BankController } from './bank.controller';
        import { BankValidation } from './bank.validation';
        const router = express.Router();
        
        router.get('/', BankController.getAllBank);
        router.get('/:id', BankController.getSingleBank);
        
        router.post(
          '/',
          validateRequest(BankValidation.createValidation),
          BankController.createBank
        );
        
        router.patch(
          '/:id',
          validateRequest(BankValidation.updateValidation),
          BankController.updateBank
        );
        router.delete('/:id', BankController.deleteBank);
        
        export const BankRoutes = router;