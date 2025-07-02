0. Create .env file in both CLIENT and SERVER folder. 
1. Paste the below content. 

    # For .env in SERVER
    MONGO_URL=mongodb+srv://manojkumarrabidas202:LPvzUlrgs4nrPuNI@clusterrabi.1wdlu7a.mongodb.net/StockEZZ
    # MONGO_URL=mongodb://127.0.0.1:27017/stockezz
    SESSION_SECRET=StockEZZSecretKey
    PORT=5001
    JWT_SECRET=StockEZZSecretKey
    # FRONTEND_PORT=*
    FRONTEND_URL=http://localhost:5173
    NODE_ENV=development

    # For .env in CLIENT
    VITE_API_BASE_URL=http://localhost:5001

2. Open new terminal.
3. Switch to cd SERVER.
4. Execute npm start.
5. Open new terminal.
6. Switch to cd CLIENT.
7. Execute npm run dev.
8. Visit the port from CLIENT terminal.

# You can change the existing transaction data for testing puspose but dont change existing 'User' data. For testing create new user and test. 