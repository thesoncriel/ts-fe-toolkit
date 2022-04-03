import { validate } from '../validate';

const { _validateSingle } = validate;

describe('validate->_validateSingle', () => {
  const fixture = {
    name: '훗 너란 녀석',
    age: 29,
    desc: '서른 즈음 ㅠㅠ',
  };
  it('제시된 유효성 검증이 통과되면 메시지는 비어있다.', () => {
    const result = _validateSingle(fixture.name, {
      check: (val) => Boolean(val),
      message: '필수입니다.',
    });

    expect(result.result).toBeTruthy();
    expect(result.message).toBe('');
  });
  it('유효성 검증이 통과되지 않으면 메시지를 남긴다.', () => {
    const result = _validateSingle(fixture.age, {
      check: (val) => val < 20,
      message: '아저씨네요 ^^',
    });

    expect(result.result).toBeFalsy();
    expect(result.message).not.toBe('');
  });
  it('유효성 검증 수행 중 예외가 발생되면 그 예외 메시지를 남기고 실패 처리된다.', () => {
    const result = _validateSingle(null, {
      check: (val) => val.length > 0,
      message: '오류가 날 수 밖에 없지요!',
    });

    expect(result.result).toBeFalsy();
    expect(result.message).toMatch('length');
  });
});
