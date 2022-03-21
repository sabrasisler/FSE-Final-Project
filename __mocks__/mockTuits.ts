import mongoose from 'mongoose';
import { mockUser } from './mockUsers';

export const mockTuits = [
  {
    tuit: 'hello world!',
    author: mockUser._id,
  },
  {
    tuit: 'goodbye, world...',
    author: mockUser._id,
  },
];
