
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const fs = require("fs");
const path = require("path")
const { fileURLToPath } = require("url")

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

        const credentialsPath = path.join(__dirname, "../../admin-credentials.txt")
        const credentialsContent = `
=== SAKTIBYTE SOLUTIONS - ADMIN CREDENTIALS ===
Generated on: ${new Date().toISOString()}
Email: ${adminEmail}
Password: ${adminPassword}
==========================================
KEEP THIS FILE SECURE AND DELETE AFTER USE.
Change the admin password after first login.
==========================================
    `

        fs.writeFileSync(credentialsPath, credentialsContent)

        console.log('✓ Admin user created successfully');
    } catch (error) {
        console.error('Error creating admin user:', error.message);
    }
};

module.exports = { setupAdminUser };