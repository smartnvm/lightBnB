const properties = require('./json/properties.json');
const users = require('./json/users.json');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb',
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  const strQuery =
    `SELECT * FROM users where email = $1`;
  return pool
    .query(strQuery, [email])
    .then(dBres => {
      console.log('========== getUserWithEmail ==============');
      console.log(dBres.rows);
      return dBres.row;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// getUserWithEmail('sebastianguerra@ymail.com');
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  const strQuery =
    `SELECT * FROM users where id = $1`;

  return pool
    .query(strQuery, [id])
    .then(dBres => {
      console.log('========== getUserWithId ==============');
      console.log(dBres.rows);
      return dBres.row;
    })
    .catch((err) => {
      console.log(err.message);
    });

};
// getUserWithId(1);


exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  console.log('========== adding user ==============');
  console.log(user);
  const { name, email, password } = user;
  const salt = bcrypt.genSaltSync(10);

  bcrypt.hash(password, salt)
    .then(function (hash) {
      // Store hash in your password DB.
      const sqlQuery =
        `INSERT INTO
        users (name, email, password)
        VALUES
        ($1, $2, $3)
        RETURNING *`;
      return pool
        .query(sqlQuery, [name, email, hash])
        .then(dBres => {
          console.log(dBres.rows);
          return dBres.rows;
        });
    })
    .catch((err) => {
      console.log(err.message);
    });

};

const name = 'wtf_name';
const email = 'name@name.com';
const password = 'password';
const user = { name, email, password };
//addUser(user);
exports.addUser = addUser;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  const strQuery =
    `SELECT * FROM properties 
    WHERE owner_id = $1
    LIMIT $2;`;
  return pool
    .query(strQuery, [options, limit])
    .then(dbRes => {
      console.log('========== getAllProperties ==============');
      console.log(dbRes.rows);
      return dbRes.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
  // .finally(() => pool.end());

};
// getAllProperties(1, 5);

exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const { owner_id, title, description,
    thumbnail_photo_url, cover_photo_url, cost_per_night,
    parking_spaces, number_of_bathrooms, number_of_bedrooms,
    country, street, city, province, post_code, active } = property;

  const sqlQuery =
    `INSERT INTO
      properties ( owner_id,  title,  description,  
        thumbnail_photo_url,  cover_photo_url,  cost_per_night, 
        parking_spaces,  number_of_bathrooms,  number_of_bedrooms,  
        country,  street,  city,  province,  post_code,  active) 
      VALUES ($1, $2, $3,$4, $5, $6, $7, $8, $9,
              $10, $11, $12, $13, $14, $15)
      RETURNING *;`;

  const values = [owner_id, title, description,
    thumbnail_photo_url, cover_photo_url, cost_per_night,
    parking_spaces, number_of_bathrooms, number_of_bedrooms,
    country, street, city, province, post_code, active];

  return pool
    .query(sqlQuery, values)
    .then(dBres => {
      console.log('========== addProperty ==============');
      console.log(dBres.rows);
      return dBres.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

temp = {
  owner_id: 1,
  title: 'wtf title',
  description: 'wtf description',
  thumbnail_photo_url: 'http://thumbnail',
  cover_photo_url: 'https://cover',
  cost_per_night: 46058,
  parking_spaces: 6,
  number_of_bathrooms: 4,
  number_of_bedrooms: 8,
  country: 'Canada',
  street: '536 Namsub Highway',
  city: 'Sotboske',
  province: 'wtf prov',
  post_code: 28142,
  active: false,
};
// console.log('========== addProperty ==============');
//addProperty(temp);
exports.addProperty = addProperty;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return getAllProperties(guest_id, limit);
};
// console.log('========== getAllReservations ==============');
// getAllReservations(110, 5);
exports.getAllReservations = getAllReservations;
