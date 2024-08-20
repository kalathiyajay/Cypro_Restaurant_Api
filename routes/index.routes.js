const express = require('express');
const upload = require('../helper/imageUplode');
const { createNewUser, getAllUsers, getUserById, updateUser, removeUser, sentInvitaionLinkToAdmin, sentInvitationLinkToWaiter, generateUserReport, getUserOrders, getUserOrderById, dashBoard, updateUserStatus } = require('../controller/user.controller');
const { userLogin, setPassword } = require('../auth/auth');
const { createTable, getAllTables, getTablesById, updateTables, deleteTables } = require('../controller/tables.controller');
const { createSector, getAllSector, getSectorById, updateSector, deleteSector, addtable, getTableStats, getSectorWithTable } = require('../controller/sector.controller');
const { createFamilies, getAllFamilies, getFamilies, updateFamilies, deleteFamilies } = require('../controller/familiesController');
const { createSubFamilies, allSubFamilies, getSubFamilies, updateSubFamilies, deleteSubFamilies, getMultipleSubFamily, getSubFamiliesWiseItem } = require('../controller/subFamiliesController');
const { createProdutionCenter, getAllProductionCenter, getProductionCenter, updateProdutionCenter, deleteProductionCenter, addProductionCenterProduct, getAllProductionCenterProduct, deleteProductionCenterProduct, getProducts } = require('../controller/productionCenter.controller');
const { createArtical, getAllArticals, getArticals, updateArticals, deleteArticals, saleReport } = require('../controller/articalController');
const { createDigitalMenu, getAllDigitalMenu, getDigitalMenu, updateDigitalMenu, deleteDigitalMenu, addProduct, getAllDigitalMenuProduct, deleteProduct, getMenu } = require('../controller/digitalMenuController');
const { createBox, getAllBox, openBoxUpdate, closeBoxUpdate, getBoxById, deleteBox, updateBoxData, genreteBoxReport } = require('../controller/boxController');
const { createOrder, getAllOrders, getOrders, updateOrderStatus, updateOrderData, removeItems, deleteOrder, getStatusWiseData, createTipAmount, totalIncome, createNote } = require('../controller/orderController');
const { createGroupForChat, getAllGroupForChat, updateGroupForChat, deleteGropuForChat, addUser, deleteUser, getMyGroup, getGroupChat } = require('../controller/groupController');
const { addGroupChat, makeNewChat, getAllChats, getSpecificUserChat } = require('../controller/chat.controller');
const { createWallet, getAllWallet, getWallet, updateWallet, deleteWallet } = require('../controller/walletController');
const { createWalletLog, getallWalletLog, getWalletLog, updateWalletLog, deleteWalletLog, getUserWalletLog } = require('../controller/walletLogController');

const indexRouter = express.Router();

// Auth Routes

indexRouter.post('/login', userLogin);
indexRouter.post('/set-password/:token', setPassword);

// SentLink Routes

indexRouter.post('/sentLinkAdmin', sentInvitaionLinkToAdmin);
indexRouter.post('/senntLinkWaiter', sentInvitationLinkToWaiter);

// User Routes

indexRouter.post('/createUser', createNewUser);
indexRouter.get('/AllUsers', getAllUsers);
indexRouter.get('/getUser/:id', getUserById);
indexRouter.put('/updateUser/:id', updateUser);
indexRouter.put('/updateUserStaus/:id', updateUserStatus);
indexRouter.delete('/deleteUser/:id', removeUser)
indexRouter.get('/searchUserMonths', generateUserReport);
indexRouter.get('/getUserOrder/:id', getUserOrderById);
indexRouter.get('/dashBoard', dashBoard)

// Sector Routes

indexRouter.post('/createSector', createSector);
indexRouter.get('/AllSectors', getAllSector);
indexRouter.get('/getSector/:id', getSectorById);
indexRouter.put('/updateSector/:id', updateSector);
indexRouter.delete('/deleteSector/:id', deleteSector);
indexRouter.get('/getStats/:id', getTableStats);
indexRouter.get('/getSectorWithTable', getSectorWithTable);

// Table Routes

indexRouter.post('/createTable', createTable);
indexRouter.get('/AllTables', getAllTables);
indexRouter.get('/getTable/:id', getTablesById);
indexRouter.put('/updateTable/:id', updateTables);
indexRouter.delete('/deleteTable/:id', deleteTables);
indexRouter.post('/addTable/:id', addtable);

//Families Routes

indexRouter.post('/createFamiles', createFamilies);
indexRouter.get('/allFamilies', getAllFamilies);
indexRouter.get('/getFamilies/:id', getFamilies);
indexRouter.put('/updateFamilies/:id', updateFamilies);
indexRouter.delete('/deleteFamilies/:id', deleteFamilies);

// SubFamilies Routes 

indexRouter.post('/createSubFamilies', createSubFamilies);
indexRouter.get('/allSubFamilies', allSubFamilies);
indexRouter.get('/getSubFamilies/:id', getSubFamilies);
indexRouter.put('/updateSubFamilier/:id', updateSubFamilies);
indexRouter.delete('/deleteSubFamilier/:id', deleteSubFamilies);
indexRouter.get('/getMultipleSubFamilies', getMultipleSubFamily);
indexRouter.get('/getSubFamiliesWiseItem', getSubFamiliesWiseItem);

// Production Center Routes

indexRouter.post('/createProdutionCenter', createProdutionCenter);
indexRouter.get('/allProductionCenter', getAllProductionCenter);
indexRouter.get('/getProductionCenter/:id', getProductionCenter);
indexRouter.put('/updateProductionCenter/:id', updateProdutionCenter);
indexRouter.delete('/deleteProductionCenter/:id', deleteProductionCenter);
indexRouter.get('/getProduct', getProducts);

// Production Center Product Routes

indexRouter.post('/addProduct', addProductionCenterProduct);
indexRouter.get('/getAllProductionCenterProducts', getAllProductionCenterProduct)
indexRouter.delete('/deleteProduct/:id', deleteProductionCenterProduct);

// Artical Routes

indexRouter.post('/createArtical', upload.single('productImage'), createArtical);
indexRouter.get('/allArtical', getAllArticals);
indexRouter.get('/getArtical/:id', getArticals);
indexRouter.put('/updateArtical/:id', upload.single('productImage'), updateArticals);
indexRouter.delete('/deleteArtical/:id', deleteArticals);
indexRouter.get('/saleReport/:id', saleReport);

// Digital Menu Routes

indexRouter.post('/createDigitalMenu', createDigitalMenu);
indexRouter.get('/allDigitaMenu', getAllDigitalMenu);
indexRouter.get('/getDigitalMenu/:id', getDigitalMenu);
indexRouter.put('/updateDigitalMenu/:id', updateDigitalMenu);
indexRouter.delete('/deleteDigitalMenu/:id', deleteDigitalMenu);
indexRouter.get('/getMenu', getMenu);

// DigitalMenuProduct Routes

indexRouter.post('/addProduct', addProduct);
indexRouter.get('/getAllProducts', getAllDigitalMenuProduct)
indexRouter.delete('/deleteDigitalMenuProduct/:id', deleteProduct);

// box Routes 

indexRouter.post('/createBox', createBox);
indexRouter.get('/getAllBox', getAllBox);
indexRouter.get('/getBox/:id', getBoxById);
indexRouter.put('/updateBox/:id', updateBoxData);
indexRouter.put('/updateBoxe/:id/open', openBoxUpdate);
indexRouter.put('/updateBox/:id/closed', closeBoxUpdate);
indexRouter.delete('/deleteBox/:id', deleteBox);
indexRouter.get("/generateBoxReport", genreteBoxReport);

// Order routes  

indexRouter.post('/createOrder', createOrder);
indexRouter.get('/getAllOrdes', getAllOrders);
indexRouter.get('/getOrders/:id', getOrders);
indexRouter.put('/updateStatus/:id', updateOrderStatus);
indexRouter.put('/addItems/:id', updateOrderData);
indexRouter.delete('/deleteItems/:id', removeItems);
indexRouter.delete('/deleteOrder/:id', deleteOrder);
indexRouter.get('/orderStatus', getStatusWiseData);
indexRouter.get('/totalIncome', totalIncome)
indexRouter.post('/createNote/:id', createNote);

// Tip Amount Routes

indexRouter.post('/tipAmount/:id', createTipAmount);

// Group Routes

indexRouter.post('/createGroupForChat', upload.single('photo'), createGroupForChat);
indexRouter.get('/getAllGroupForChat', getAllGroupForChat);
indexRouter.get('/getGroupChat/:id', getGroupChat);
indexRouter.put('/updateGroupForChat/:id', upload.single('photo'), updateGroupForChat);
indexRouter.delete('/deleteGroupForChate/:id', deleteGropuForChat)
indexRouter.post('/addUser', addUser);
indexRouter.delete('/deleteUser', deleteUser);
indexRouter.get('/getMyGroup/:id', getMyGroup);

// Chat Routes

indexRouter.post('/startChat/:id', addGroupChat);
indexRouter.post('/makeChat/:id', makeNewChat);
indexRouter.get('/getAllChats', getAllChats);
indexRouter.get('/getSpecificChat/:id', getSpecificUserChat);

// Wallet Routes

indexRouter.post('/createWallet', createWallet);
indexRouter.get('/Allwallets', getAllWallet);
indexRouter.get('/getWallet/:id', getWallet);
indexRouter.put('/updateWallet/:id', updateWallet);
indexRouter.delete('/deleteWallet/:id', deleteWallet);

// Wallet Log

indexRouter.post('/createWalletLog', createWalletLog);
indexRouter.get('/allWalletLogs', getallWalletLog);
indexRouter.get('/getWalletLog/:id', getWalletLog);
indexRouter.put('/updateWalletLog/:id', updateWalletLog);
indexRouter.delete('/deleteWalletLog/:id', deleteWalletLog);
indexRouter.get('/getUserWalletLog/:id', getUserWalletLog)

module.exports = indexRouter;