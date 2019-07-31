module.exports = {
  roots: ['<rootDir>/client'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  "snapshotSerializers": ["enzyme-to-json/serializer"],
  "setupFilesAfterEnv": ["<rootDir>/setupEnzyme.ts"],
}