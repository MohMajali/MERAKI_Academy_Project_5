const { throwError } = require("../middlewares/throwError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../models/DB");
// const salt = parseInt(process.env.SALT);
exports.register = async (req, res, next) => {
  let {
    region_id,
    role_id,
    firt_name,
    last_name,
    nick_name,
    email,
    password,
    image,
  } = req.body;

  try {
    password = await bcrypt.hash(password, 10);
  } catch (error) {
    throw error;
  }

  const query = `INSERT INTO users (region_id, role_id, firt_name, last_name, nick_name, email, password, image ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
  const data = [
    region_id,
    role_id,
    firt_name,
    last_name,
    nick_name,
    email.toLowerCase(),
    password,
    image,
  ];
  pool
    .query(query, data)
    .then((result) => {
      if (result.command === "INSERT") {
        return res.status(200).json({
          error: true,
          message: "Account created successfully",
        });
      }
      return throwError(400, "Something went wrong");
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  let { email, password } = req.body;

  const query1 = `SELECT users.id, users.region_id, users.role_id, users.firt_name, users.last_name, users.nick_name, users.email, users.password,
   users.active, users.is_deleted, users.longtitude, users.langtitude, users.image, users.created_at,

  regions.region
  FROM users
  
  INNER JOIN regions ON regions.id = users.region_id

  WHERE email = $1`;

  const data = [email.toLowerCase()];
  let user = {};
  let token = "";
  pool
    .query(query1, data)
    .then(async (result) => {
      if (result.rows.length !== 0) {
        try {
          const isValid = await bcrypt.compare(
            password,
            result.rows[0].password
          );
          if (!isValid) {
            return throwError(404, "Email or Password is incorrect");
          }
        } catch (error) {
          throw error;
        }
        user = result.rows[0];
        return pool.query(
          `SELECT permission FROM permissions WHERE role_id = $1`,
          [result.rows[0].role_id]
        );
      }
      return throwError(404, "Email or Password is incorrect");
    })
    .then((result2) => {
      if (result2.command === "SELECT") {
        user.permissions = result2.rows.map(
          (permission) => permission.permission
        );

        const payLoad = {
          user,
        };

        const options = {
          expiresIn: "7d",
        };
        // const secret = process.env.SECRET;
        token = jwt.sign(payLoad, "tintin", options);

        console.log("TOKEN ====> ", token);

        return res.status(200).json({
          error: false,
          token,
        });
      }
      return throwError(404, "Something went wrong");
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// ------------our team this is the function to get all info for all users to shared with website Admin
// if you wanna to remove some info lets discuss about it
exports.getAllUsers = async (req, res, next) => {
  const query = `SELECT
  users.id AS user_id,
  regions.region AS user_region,
  roles.role AS user_role,
  users.firt_name,
  users.last_name,
  users.nick_name,
  users.email,
  users.active,
  users.is_deleted,
  users.longtitude,
  users.langtitude,
  users.image,
  users.created_at
FROM
  users
INNER JOIN
  regions ON users.region_id = regions.id
INNER JOIN
  roles ON users.role_id = roles.id;
`;
  try {
    const response = await pool.query(query);
    console.log(response.rows);
    res.status(200).json({
      error: false,
      message: "All Users",
      Users: response.rows,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

//--------------------------------------------- This Function To Get User By Id
exports.getUserById = async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  const value = [id];
  const query = `SELECT
  users.id AS user_id,
  regions.region AS user_region,
  users.firt_name,
  users.last_name,
  users.nick_name,
  users.email,
  users.active,
  users.image,
  users.created_at
FROM
  users
INNER JOIN
  regions ON users.region_id = regions.id
INNER JOIN
  roles ON users.role_id = roles.id
WHERE
  users.id =$1;
`;
  try {
    const response = await pool.query(query, value);
    if (response.command === "SELECT") {
      if (response.rows[0]) {
        return res.status(200).json({
          error: false,
          user: response.rows[0],
        });
      }
      return throwError(400, "something went rowing");
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// this fun allow the user delete his account from website
// note admin cant delete the user account in my opinion this is wrong option in our project
// instead of this the admin can ban or block the user  if he breaks the laws
// as you can see in the next function
// i think we need to discuss this !
exports.deleteUserById = (req, res, next) => {
  const { id } = req.token.user;
  const query = `UPDATE users SET is_deleted= 1 WHERE id = $1;`;
  const data = [id];
  pool
    .query(query, data)
    .then((result) => {
      if (result.rowCount !== 0) {
        return res.status(200).json({
          error: false,
          message: `your account deleted successfully`,
        });
      }
      return throwError(400, "something went rowing");
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// This function allows Admin to ban the account
exports.BanUserById = (req, res, next) => {
  const { id } = req.params;
  const { active } = req.body;
  const query = `UPDATE users
  SET active = $1
  WHERE id=$2;`;
  const data = [active, id];
  pool
    .query(query, data)
    .then((result) => {
      if (result.rowCount !== 0) {
        return res.status(200).json({
          error: false,
          message:
            active === 0
              ? `Account Blocked successfully`
              : `Account Un-Blocked successfully`,
        });
      }
      return throwError(400, "something went rowing");
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
// this function allow user to update his account
exports.updateUserById = async (req, res, next) => {
  try {
    const { first_name, last_name, nick_name, email, image } = req.body;
    const { id } = req.params;

    const values = [
      first_name || null,
      last_name || null,
      nick_name || null,
      email || null,
      image || null,
      id,
    ];

    const query = `UPDATE users
    SET
    
    first_name = COALESCE($1,first_name),
    last_name = COALESCE($2,last_name),
    nick_name = COALESCE($3,nick_name),
    email = COALESCE( $4,email),
    image = COALESCE($5,image)
    WHERE
        id =$6;
     RETURNING *;`;

    const response = await pool.query(query, values);

    if (response.rowCount) {
      res.status(200).json({
        success: true,
        message: "your Account updated successfully",
        response: response.rows,
      });
    }
    return throwError(400, "something went rowing");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
