import db from "./dbManager/index.js";
import utils from "./utils.js";

export function login(req, res) {
  try {
    db.getUserByEmail(req.body['email']).then((value) => {
      if (value) {
        const password = req.body['password'];
        const salt = value.salt;
        const hash = utils.getHashFromSaltPassword(password, salt);
        if (hash === value.hash) {
          req.session.isAuthorized = true;
          res.cookie('isAuthorized', 'true');
          res.cookie('firstName', value.first_name);
          res.cookie('lastName', value.last_name);
          res.cookie('email', value.email);
          res.sendStatus(200);
        } else {
          res.json({ hasError: true, errorMessage: 'Wrong password' });
        }
      } else {
        res.json({ hasError: true, errorMessage: 'Email not found' });
      }
    }).catch((err) => {
      res.json({ hasError: true, errorMessage: 'Database is not available' });
    });
  } catch (err) {
    res.json({ hasError: true, errorMessage: 'Database is not available' });
  }
}

export async function register(req, res) {
  try {
    let user = await db.getUserByEmail(req.body['email']);
    if (user) {
      res.json({ hasError: true, errorMessage: 'Email already registered' });
      return;
    }
    const password = req.body['password'];
    const { hash, salt } = utils.hashPassword(password);
    user = {
      firstName: req.body['firstName'],
      lastName: req.body['lastName'],
      email: req.body['email'],
      hash,
      salt,
      regDate: utils.getDatetimeFromTimestamp(Date.now())
    }
    db.insertUser(user).then((value) => {
      req.session.isAuthorized = true;
      res.cookie('isAuthorized', 'true');
      res.cookie('firstName', user.firstName);
      res.cookie('lastName', user.lastName);
      res.cookie('email', user.email);
      res.sendStatus(200);
    }).catch((err) => {
      res.json({ hasError: true, errorMessage: 'Database is not available' });
    });
  } catch (err) {
    res.json({ hasError: true, errorMessage: 'Database is not available' });
  }
}

export function logout(req, res) {
  req.session.destroy();
  res.cookie('isAuthorized', 'false');
  res.sendStatus(200);
}

export function getTopPlaces(req, res) {
  db.getPlaces(null, 'rating', 'DESC', 3).then(async (places) => {
    await new Promise(async (resolve, reject) => {
      for (let place of places) {
        try {
          const images = await db.getImagesByPlaceId(place.id);
          place.images = images;
        } catch (err) {
          console.log(err.message);
          const index = places.indexOf(place);
          if (index > -1) {
            places.splice(index, 1);
          }
        }
      }
      resolve();
    });
    res.json(places);
  }).catch((err) => {
      console.log(err.message);
      res.sendStatus(500);
  });
};

export function getAllPlaces(req, res) {
  db.getAllPlaces().then(async (places) => {
    await new Promise(async (resolve, reject) => {
      for (let place of places) {
        try {
          const images = await db.getImagesByPlaceId(place.id);
          place.images = images;
        } catch (err) {
          console.log(err.message);
          const index = places.indexOf(place);
          if (index > -1) {
            places.splice(index, 1);
          }
        }
      }
      resolve();
    });
    res.json(places);
  }).catch((err) => {
      console.log(err.message);
      res.sendStatus(404);
  });
};

export default {
  getTopPlaces,
  getAllPlaces,
  login,
  logout,
  register,
}