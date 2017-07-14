import Promise from 'bluebird';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

const saltRounds = 10;

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    lowercase: true,
    required: true
  },
  hashed_password: {
    type: String
  },
  salt: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Virtuals
 */
UserSchema.virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.hashPassword(password, this.salt);
  })
  .get(function () {
    return this._password;
  });
/**
 * Methods
 */
UserSchema.method({
  /**
   * Generate password hash salt
   */
  makeSalt() {
    return bcrypt.genSaltSync(saltRounds);
  },

  /**
   * Hash plain text password
   * @param password
   * @param salt
   */
  hashPassword(password, salt) {
    return bcrypt.hashSync(password, salt);
  }
});
/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
