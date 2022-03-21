import mongoose from 'mongoose';
export const mockUser: any = {
  _id: new mongoose.Types.ObjectId(),
  username: 'neo',
  name: 'Keanu Reeves',
  bio: 'I am the one',
  birthday: '1990-01-01',
  headerImage: 'imagestring',
  profilePhoto: 'profilephotostring',
  accountType: 'Personal',
  followerCount: 0,
  followeeCount: 0,
  accountStatus: 'ACTIVE',
};

export const mockUsers: any = [
  {
    _id: new mongoose.Types.ObjectId(),
    username: 'neoIamTheOne',
    name: 'Keanu',

    password: 'IAmTheOne123!',
    email: 'neo@matrix.com',
    bio: 'I am the one',
    birthday: '1990-01-01',
    headerImage: 'imagestring',
    profilePhoto: 'profilephotostring',
    accountType: 'PERSONAL',
  },

  {
    _id: new mongoose.Types.ObjectId(),
    username: 'iambatman',
    name: 'Bruce',

    password: 'IAmBatman123!',
    email: 'batman@batman.com',
    bio: 'I am the one',
    birthday: '1980-01-01',
    headerImage: 'imagestring',
    profilePhoto: 'profilephotostring',
    accountType: 'PROFESSIONAL',
  },
];
