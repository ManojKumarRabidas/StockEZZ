const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const adminController = require("../controllers/adminController");
const utilController = require("../controllers/utilController");
const companyController = require("../controllers/companyController");
const { authorizeRole } = require('../middleware/authMiddleware');

router.post('/login', userController.userLogin);
router.post('/logout', userController.userLogout);
router.get("/auth/user", userController.getUser);

router.get("/get-companies",utilController.getCompanyNames);

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

router.get("/category-list", authorizeRole(['ADMIN', 'SUPPORTADMIN']), adminController.categoryList);
router.post("/category-create", authorizeRole(['ADMIN', 'SUPPORTADMIN']), adminController.categoryCreate);
router.get("/category-details/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN']), adminController.categoryDetails);
router.patch("/category-update/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN']), adminController.categoryUpdate);
router.delete("/category-delete/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN']), adminController.categoryDelete);
router.put("/category-update-active/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN']), adminController.categoryUpdateActive);

router.get("/item-list", authorizeRole(['ADMIN', 'SUPPORTADMIN', 'COMPANY', 'OPERATOR']), adminController.itemList);
router.post("/item-create", authorizeRole(['ADMIN', 'SUPPORTADMIN', 'COMPANY', 'OPERATOR']), adminController.itemCreate);
router.get("/item-details/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN', 'COMPANY', 'OPERATOR']), adminController.itemDetails);
router.patch("/item-update/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN', 'COMPANY', 'OPERATOR']), adminController.itemUpdate);
router.delete("/item-delete/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN', 'COMPANY', 'OPERATOR']), adminController.itemDelete);
router.put("/item-update-active/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN', 'COMPANY', 'OPERATOR']), adminController.itemUpdateActive);

router.get("/operator-list", authorizeRole(['ADMIN', 'SUPPORTADMIN', 'COMPANY']), utilController.operatorList);
router.post("/operator-create", authorizeRole(['ADMIN', 'SUPPORTADMIN', 'COMPANY']), utilController.operatorCreate);
router.get("/operator-details/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN', 'COMPANY']), utilController.operatorDetails);
router.patch("/operator-update/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN', 'COMPANY']), utilController.operatorUpdate);
router.delete("/operator-delete/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN', 'COMPANY']), utilController.operatorDelete);
router.put("/operator-update-active/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN', 'COMPANY']), utilController.operatorUpdateActive);

router.get("/customize-add-stock-details", authorizeRole(['COMPANY']), companyController.getCustomizeAddStockDetails);
router.post("/save-customize-add-stock-details", authorizeRole(['COMPANY']), companyController.saveCustomizeAddStockDetails);

module.exports = router;