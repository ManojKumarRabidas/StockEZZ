const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const adminController = require("../controllers/adminController");
const utilController = require("../controllers/utilController");
const companyController = require("../controllers/companyController");
const operatorController = require("../controllers/operatorController");
const { authorizeRole } = require('../middleware/authMiddleware');

router.post('/login', userController.userLogin);
router.post('/logout', userController.userLogout);
router.get("/auth/user", userController.getUser);
router.get("/get-profile-details",authorizeRole(['SUPPORTADMIN', 'COMPANY', 'OPERATOR']), userController.profileDetails);

router.post("/change-password", authorizeRole(['ADMIN', 'SUPPORTADMIN', 'COMPANY', 'OPERATOR']), userController.changePassword);
router.post("/forgot-password-send-otp", authorizeRole(['ADMIN', 'SUPPORTADMIN', 'COMPANY', 'OPERATOR']), userController.forgotPasswordSendOtp);
router.post("/forgot-password-check-otp", authorizeRole(['ADMIN', 'SUPPORTADMIN', 'COMPANY', 'OPERATOR']), userController.forgotPasswordCheckOtp);
router.post("/forgot-password-change-password", authorizeRole(['ADMIN', 'SUPPORTADMIN', 'COMPANY', 'OPERATOR']), userController.forgotPasswordChangePassword);

// router.post("/outer-forgot-password-send-otp", userController.outerForgotPasswordSendOtp);

router.get("/get-companies",utilController.getCompanyNames);

router.get("/support-admin-list", authorizeRole(['ADMIN']), adminController.supportAdminList);
router.post("/support-admin-create", authorizeRole(['ADMIN']), adminController.supportAdminCreate);
router.get("/support-admin-details/:id", authorizeRole(['ADMIN']), adminController.supportAdminDetails);
router.patch("/support-admin-update/:id", authorizeRole(['ADMIN']), adminController.supportAdminUpdate);
router.delete("/support-admin-delete/:id", authorizeRole(['ADMIN']), adminController.supportAdminDelete);
router.put("/support-admin-update-active/:id", authorizeRole(['ADMIN']), adminController.supportAdminUpdateActive);

router.get("/company-list", authorizeRole(['ADMIN', 'SUPPORTADMIN', 'COMPANY']), adminController.companyList);
router.post("/company-create", authorizeRole(['ADMIN', 'SUPPORTADMIN']), adminController.companyCreate);
router.get("/company-details/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN']), adminController.companyDetails);
router.patch("/company-update/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN']), adminController.companyUpdate);
router.delete("/company-delete/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN']), adminController.companyDelete);
router.put("/company-update-active/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN']), adminController.companyUpdateActive);

router.get("/category-list", authorizeRole(['ADMIN', 'SUPPORTADMIN','COMPANY', 'OPERATOR']), adminController.categoryList);
router.post("/category-create", authorizeRole(['ADMIN', 'SUPPORTADMIN']), adminController.categoryCreate);
router.get("/category-details/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN']), adminController.categoryDetails);
router.patch("/category-update/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN']), adminController.categoryUpdate);
router.delete("/category-delete/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN']), adminController.categoryDelete);
router.put("/category-update-active/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN']), adminController.categoryUpdateActive);

router.get("/item-list", authorizeRole(['ADMIN', 'SUPPORTADMIN', 'COMPANY', 'OPERATOR']), utilController.itemList);
router.post("/item-create", authorizeRole(['ADMIN', 'SUPPORTADMIN', 'COMPANY', 'OPERATOR']), utilController.itemCreate);
router.get("/item-details/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN', 'COMPANY', 'OPERATOR']), utilController.itemDetails);
router.patch("/item-update/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN', 'COMPANY', 'OPERATOR']), utilController.itemUpdate);
router.delete("/item-delete/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN', 'COMPANY', 'OPERATOR']), utilController.itemDelete);
router.put("/item-update-active/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN', 'COMPANY', 'OPERATOR']), utilController.itemUpdateActive);

router.get("/operator-list", authorizeRole(['ADMIN', 'SUPPORTADMIN', 'COMPANY']), utilController.operatorList);
router.post("/operator-create", authorizeRole(['ADMIN', 'SUPPORTADMIN', 'COMPANY']), utilController.operatorCreate);
router.get("/operator-details/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN', 'COMPANY']), utilController.operatorDetails);
router.patch("/operator-update/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN', 'COMPANY']), utilController.operatorUpdate);
router.delete("/operator-delete/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN', 'COMPANY']), utilController.operatorDelete);
router.put("/operator-update-active/:id", authorizeRole(['ADMIN', 'SUPPORTADMIN', 'COMPANY']), utilController.operatorUpdateActive);

router.get("/buyer-list", authorizeRole(['OPERATOR', 'COMPANY']), utilController.buyerList);
router.post("/buyer-create", authorizeRole(['OPERATOR', 'COMPANY']), utilController.buyerCreate);
router.get("/buyer-details/:id", authorizeRole(['OPERATOR', 'COMPANY']), utilController.buyerDetails);
router.patch("/buyer-update/:id", authorizeRole(['OPERATOR', 'COMPANY']), utilController.buyerUpdate);
router.delete("/buyer-delete/:id", authorizeRole(['OPERATOR', 'COMPANY']), utilController.buyerDelete);
router.put("/buyer-update-active/:id", authorizeRole(['OPERATOR', 'COMPANY']), utilController.buyerUpdateActive);

router.get("/seller-list", authorizeRole(['OPERATOR', 'COMPANY']), utilController.sellerList);
router.post("/seller-create", authorizeRole(['OPERATOR', 'COMPANY']), utilController.sellerCreate);
router.get("/seller-details/:id", authorizeRole(['OPERATOR', 'COMPANY']), utilController.sellerDetails);
router.patch("/seller-update/:id", authorizeRole(['OPERATOR', 'COMPANY']), utilController.sellerUpdate);
router.delete("/seller-delete/:id", authorizeRole(['OPERATOR', 'COMPANY']), utilController.sellerDelete);
router.put("/seller-update-active/:id", authorizeRole(['OPERATOR', 'COMPANY']), utilController.sellerUpdateActive);

router.patch("/brand-list", authorizeRole(['COMPANY', 'OPERATOR']), utilController.brandList);
router.patch("/customize-add-stock-details", authorizeRole(['COMPANY', 'OPERATOR']), utilController.getCustomizeAddStockDetails);
router.post("/save-customize-add-stock-details", authorizeRole(['COMPANY', 'OPERATOR']), utilController.saveCustomizeAddStockDetails);
router.get("/stock-list", authorizeRole(['COMPANY', 'OPERATOR']), utilController.stockList);
router.get("/get-company-details", authorizeRole(['COMPANY','OPERATOR']), utilController.fetchCompanyDetails);

router.post("/save-stock-details", authorizeRole(['OPERATOR']), operatorController.saveStockDetails);
router.patch("/stock-bulk-update", authorizeRole(['OPERATOR']), operatorController.stockBulkUpdate);

router.post("/bill-create", authorizeRole(['OPERATOR']), operatorController.billCreate);
router.patch("/bill-update/:id", authorizeRole(['OPERATOR']), operatorController.billUpdate);
router.post("/generate-bill-pdf/:id", authorizeRole(['OPERATOR']), operatorController.generateBillPdf);

router.get("/bill-list", authorizeRole(['COMPANY','OPERATOR']), utilController.billList);
router.get("/bill-details/:id", authorizeRole(['COMPANY','OPERATOR']), utilController.billDetails);

router.get("/financials", authorizeRole(['COMPANY','OPERATOR']), utilController.dashboardFinancials);
router.get("/metrics", authorizeRole(['COMPANY','OPERATOR']), utilController.dashboardMetrics);
router.get("/stock/low", authorizeRole(['COMPANY','OPERATOR']), utilController.dashboardLowStock);

module.exports = router;