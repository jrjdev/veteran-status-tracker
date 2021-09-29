import {
  networkExample,
} from './aptitudes';

jest.mock('./aptitudes');
jest.mock('@oliveai/ldk');

const mockIntroShow = jest.fn();
jest.mock('./whispers', () => {
  return {
    VetStatusWhisper: jest.fn().mockImplementation(() => {
      return { show: mockIntroShow };
    }),
  };
});

describe('Project Startup', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should start the Intro whisper and all active aptitudes on startup', () => {
    // eslint-disable-next-line global-require
    require('.');

    expect(mockIntroShow).toBeCalled();
    expect(networkExample.run).toBeCalled();
  });
});
