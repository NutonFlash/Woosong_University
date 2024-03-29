import { connection } from "./index.js";

export function getImageById(id) {
    if (connection) {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT * FROM `images` WHERE `id` = ?", [id],
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

export function getImagesByPlaceId(place_id) {
    if (connection) {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT * FROM `images` WHERE `place_id` = ?", [place_id],
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
    getImageById,
    getImagesByPlaceId,
}