export const GoogleSignin = {
  configure: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
};

export const isErrorWithCode = jest.fn();
export const isSuccessResponse = jest.fn(() => true);

export const statusCodes = {
  SIGN_IN_CANCELLED: "SIGN_IN_CANCELLED",
  IN_PROGRESS: "IN_PROGRESS",
  PLAY_SERVICES_NOT_AVAILABLE: "PLAY_SERVICES_NOT_AVAILABLE",
};