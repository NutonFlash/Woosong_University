import { connection } from "./index.js";

export function getUserById(id) {
    if (connection) {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT * FROM `users` WHERE `id` = ?", [id],
                function (error, results) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results[0]);
                    }
                });
        });
    } else {
        throw Error('Database connection is lost');
    }
}

export function getUserByEmail(email) {
    if (connection) {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT * FROM `users` WHERE `email` = ?", [email],
                function (error, results) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results[0]);
                    }
                });
        });
    } else {
        throw Error('Database connection is lost');
    }
}

export function insertUser(user) {
    if (connection) {
        return new Promise((resolve, reject) => {
            connection.query(
                "INSERT INTO `users` (email, hash, salt, reg_date, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?)", [user.email, user.hash, user.salt, user.regDate, user.firstName, user.lastName],
                function (error, results) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
        });
    } else {
        throw Error('Database connection is lost');
    }
}

export default {
    getUserById,
    getUserByEmail,
    insertUser,
}