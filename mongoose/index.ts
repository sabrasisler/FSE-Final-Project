import dotenv from 'dotenv';
import mongoose, { Mongoose } from 'mongoose';
import { exit } from 'process';
import CommonErrorHandler from '../errors/CommonErrorHandler';
dotenv.config();

const db = new Mongoose();

export default db;
