import { connection } from "./index.js";

export function getPlaceById(id) {
    if (connection) {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT * FROM `places` WHERE `id` = ?", [id],
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

// order - DECS/ASC
export function getPlaces(condition, orderByColumn, order, limit) {
    let queryStr = 'SELECT * FROM `places`';
    if (condition) queryStr += ` WHERE ${condition}`;
    if (orderByColumn) queryStr += ` ORDER BY ${orderByColumn}`;
    if (orderByColumn && order) {
        queryStr += ` ${order}`;
    } else if (orderByColumn) {
        queryStr += ` DESC`;
    }
    if (limit) queryStr += ` LIMIT ${limit}`;
    if (connection) {
        return new Promise((resolve, reject) => {
            connection.query(
                queryStr,
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

export function getAllPlaces() {
    if (connection) {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT * FROM `places`",
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
    getAllPlaces,
    getPlaceById,
    getPlaces,
}