/* eslint-disable @typescript-eslint/no-explicit-any */
import { validate } from '../validate';
import { ValidateBulkResultModel } from '../validate.type';

const { _validateBulk } = validate;

describe('validate->_validateBulk', () => {
  const fixture = {
    name: '훗 너란 녀석',
    age: 29,
    desc: '서른 즈음 ㅠㅠ',
  };
  const validator = {
    check: Boolean,
    message: '필수입니다.',
  };
  const mockSuccess = jest.fn(() => {
    return {
      result: true,
      message: '',
    };
  });
  const mockFail = jest.fn(() => {
    return {
      result: false,
      message: '실패예요!',
    };
  });
  const mockFailOnThird = jest.fn();
  const mockValidateSuccess = jest.fn(() => {
    return {
      isValid: true,
      firstMessage: '',
    } as ValidateBulkResultModel;
  });
  const mockValidateFail = jest.fn(() => {
    return {
      isValid: false,
      firstMessage: '블라블라 오류임',
    } as ValidateBulkResultModel;
  });

  beforeEach(() => {
    mockFailOnThird
      .mockImplementationOnce(() => {
        return {
          result: true,
          message: '',
        };
      })
      .mockImplementationOnce(() => {
        return {
          result: true,
          message: '',
        };
      })
      .mockImplementation(() => {
        return {
          result: false,
          message: '실패예요!',
        };
      });
  });

  afterEach(() => {
    mockSuccess.mockClear();
    mockFail.mockClear();
    mockFailOnThird.mockReset();
    mockValidateSuccess.mockClear();
    mockValidateFail.mockClear();
  });

  describe('단일 검증', () => {
    it('통과되면 전체 결과도 통과.', () => {
      const result = _validateBulk(fixture.name, validator, mockSuccess);

      expect(mockSuccess).toBeCalled();
      expect(result.result).toBeTruthy();
      expect(result.message).toBe('');
    });
    it('실패하면 전체 결과도 실패.', () => {
      const result = _validateBulk(fixture.name, validator, mockFail);

      expect(mockFail).toBeCalled();
      expect(result.result).toBeFalsy();
      expect(result.message).not.toBe('');
    });
  });

  describe('다수 검증', () => {
    it('모든 조건이 통과하면 전체 결과도 통과.', () => {
      const result = _validateBulk(
        fixture.name,
        [validator, validator, validator, validator],

        mockSuccess
      );

      expect(mockSuccess).toBeCalledTimes(4);
      expect(result.result).toBeTruthy();
      expect(result.message).toBe('');
    });
    it('하나의 조건이 실패하면 전체 결과는 실패.', () => {
      const result = _validateBulk(
        fixture.name,
        [validator, validator, validator],

        mockFailOnThird
      );

      expect(mockFailOnThird).toBeCalledTimes(3);
      expect(result.result).toBeFalsy();
      expect(result.message).not.toBe('');
    });
    it('실패했을 경우 이후 검사는 생략한다.', () => {
      const result = _validateBulk(
        fixture.name,
        [validator, validator, validator, validator, validator],

        mockFailOnThird
      );

      expect(mockFailOnThird).toBeCalledTimes(3);
      expect(result.result).toBeFalsy();
      expect(result.message).not.toBe('');
    });
  });
  describe('하위 유효성 검증', () => {
    it('검증 옵션 수행 결과와 메시지만 취하여 전달한다.', () => {
      const result = _validateBulk(
        fixture.name,
        mockValidateSuccess,
        mockSuccess
      );
      expect(mockValidateSuccess).toBeCalledTimes(1);

      const altResult = mockValidateSuccess();

      expect(mockSuccess).not.toBeCalled();
      expect(result.result).toBe(altResult.isValid);
      expect(result.message).toBe(altResult.firstMessage);
    });
    it('실패했다면 유효성 여부와 첫 메시지가 동일하다.', () => {
      const result = _validateBulk(fixture.name, mockValidateFail, mockSuccess);
      expect(mockValidateFail).toBeCalledTimes(1);

      const altResult = mockValidateFail();

      expect(result.result).toBe(altResult.isValid);
      expect(result.message).toBe(altResult.firstMessage);
    });
  });
});
