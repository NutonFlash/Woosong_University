import mysql from "mysql2";
import place from './place.js';
import image from './image.js';
import user from "./user.js";

export let connection = null;

export function init(options) {
  connection = mysql.createConnection(options);

  connection.connect(function (err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      connection = null;
      return;
    }
    console.log("connected as id " + connection.threadId);
  });

  return connection;
}

export function destroy() {
  if (connection) {
    connection.end(function (err) {
      // The connection is terminated now
      console.error("error in connection ending: " + err.stack);
    });
  }
}

export default {
  init,
  destroy,
  ...place,
  ...image,
  ...user,
};
