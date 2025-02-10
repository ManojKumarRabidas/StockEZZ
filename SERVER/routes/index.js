const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const adminController = require("../controllers/adminController");
const { authorizeRole } = require('../middleware/authMiddleware');

router.post('/login', userController.userLogin);
router.post('/logout', userController.userLogout);
router.get("/auth/user", userController.getUser);

router.get("/support-admin-list", authorizeRole(['ADMIN']), adminController.supportAdminList);
router.post("/support-admin-create", authorizeRole(['ADMIN']), adminController.supportAdminCreate);
router.get("/support-admin-details/:id", authorizeRole(['ADMIN']), adminController.supportAdminDetails);
router.patch("/support-admin-update/:id", authorizeRole(['ADMIN']), adminController.supportAdminUpdate);
router.delete("/support-admin-delete/:id", authorizeRole(['ADMIN']), adminController.supportAdminDelete);
router.put("/support-admin-update-active/:id", authorizeRole(['ADMIN']), adminController.supportAdminUpdateActive);

router.get("/company-list", authorizeRole(['ADMIN', 'SUPPORTADMIN']), adminController.companyList);
router.post("/company-create", authorizeRole(['ADMIN', 'SUPPORTADMIN']), adminController.companyCreate);
router.get("/company-details/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN']), adminController.companyDetails);
router.patch("/company-update/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN']), adminController.companyUpdate);
router.delete("/company-delete/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN']), adminController.companyDelete);
router.put("/company-update-active/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN']), adminController.companyUpdateActive);

module.exports = router;