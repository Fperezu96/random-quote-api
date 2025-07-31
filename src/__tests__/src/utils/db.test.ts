import type mongooseType from 'mongoose';

jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    connect: jest.fn(() => Promise.resolve(actualMongoose)),
    connection: {
      readyState: 1,
      close: jest.fn(() => Promise.resolve()),
    },
    set: actualMongoose.set,
  };
});

describe('connectToDatabase', () => {
  let mongoose: typeof mongooseType;

  beforeEach(async () => {
    jest.resetModules();
    delete global.mongoose;
    process.env.MONGO_URI = 'mongodb://localhost:27017/testdb';
    mongoose = await import('mongoose').then((m) => m.default || m);
  });

  it('should connect if not already connected', async () => {
    const db = await import('../../../../src/utils/db');
    await db.connectToDatabase();
    expect(mongoose.connect).toHaveBeenCalledWith('mongodb://localhost:27017/testdb');
  });

  it('should not connect again if already connected', async () => {
    const db = await import('../../../../src/utils/db');
    await db.connectToDatabase(); 
    await db.connectToDatabase(); 
    expect(mongoose.connect).toHaveBeenCalledTimes(1);
  });
/*
  it('should throw error if MONGO_URI is not set', async () => {
    delete process.env.MONGO_URI;
    await expect(() => import('../../../../src/utils/db')).rejects.toThrow(
      'MONGO_URI not defined in .env file'
    );
  });
*/
  it('should close the connection if connected', async () => {
    const db = await import('../../../../src/utils/db');
    await db.connectToDatabase();
    await db.closeConnection();
    expect(mongoose.connection.close).toHaveBeenCalledTimes(1);
  });

  it('should not close if not connected', async () => {
    (mongoose.connection.readyState as number) = 0;
    const db = await import('../../../../src/utils/db');
    await db.closeConnection();
    expect(mongoose.connection.close).not.toHaveBeenCalled();
  });

});
