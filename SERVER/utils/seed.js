// import bcrypt from "bcrypt"
// import fs from "fs"
// import path from "path"
// import { fileURLToPath } from "url"

// const __dirname = path.dirname(fileURLToPath(import.meta.url))

// export async function setupAdminUser(db) {
//     try {
//         const usersCollection = db.collection("users")
//         const adminExists = await usersCollection.findOne({ role: "admin" })

//         if (adminExists) {
//             console.log("✓ Admin account already exists")
//             return
//         }

//         const adminEmail = process.env.ADMIN_EMAIL || "admin@saktibyte.com"
//         let adminPassword = process.env.ADMIN_PASSWORD

//         if (!adminPassword) {
//             adminPassword = generateSecurePassword()
//         }

//         const hashedPassword = await bcrypt.hash(adminPassword, 10)

//         await usersCollection.insertOne({
//             email: adminEmail,
//             password: hashedPassword,
//             role: "admin",
//             createdAt: new Date(),
//             status: "active",
//         })

//         const credentialsPath = path.join(__dirname, "../../admin-credentials.txt")
//         const credentialsContent = `
// === SAKTIBYTE SOLUTIONS - ADMIN CREDENTIALS ===
// Generated on: ${new Date().toISOString()}
// Email: ${adminEmail}
// Password: ${adminPassword}
// ==========================================
// KEEP THIS FILE SECURE AND DELETE AFTER USE.
// Change the admin password after first login.
// ==========================================
//     `

//         fs.writeFileSync(credentialsPath, credentialsContent)

//         console.log("✓ Admin account created")
//         console.log("✓ Admin credentials saved to admin-credentials.txt")
//         console.log("\n" + credentialsContent)
//     } catch (error) {
//         console.error("✗ Admin setup error:", error.message)
//     }
// }

// function generateSecurePassword() {
//     const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%"
//     let password = ""
//     for (let i = 0; i < 16; i++) {
//         password += chars.charAt(Math.floor(Math.random() * chars.length))
//     }
//     return password
// }

const User = require('../models/user');
const bcrypt = require('bcryptjs');

const setupAdminUser = async () => {
    try {
        // Check if admin already exists
        const adminExists = await User.findOne({ code: 'A000001', user_type: 'ADMIN' });

        if (adminExists) {
            console.log('Admin user already exists');
            return;
        }

        // Create admin user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        const adminUser = await User.create({
            code: 'A000001',
            email: 'admin@example.com',
            user_type: 'ADMIN',
            name: 'Admin User',
            phone: 1234567890,
            address: '123 Admin St, City, Country',
            pin: 123456
        });
        if (!adminUser || !adminUser._id) {
            throw new Error('Failed to create admin user');
        }
        const authenticationModel = require('../models/authentication');
        const authentication = await authenticationModel.create({
            user_code: adminUser.code,
            user_id: adminUser._id,
            name: adminUser.name,
            login_id: adminUser.code,
            password: hashedPassword,
            user_type: 'ADMIN',
            active: true,
            first_log_in: true
        });
        if (!authentication) {
            throw new Error('Failed to create admin user credencials');
        }
        console.log('✓ Admin user created successfully');
    } catch (error) {
        console.error('Error creating admin user:', error.message);
    }
};

module.exports = { setupAdminUser };