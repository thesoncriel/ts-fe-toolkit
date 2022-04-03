import { validate } from './validate';

/**
 * @description
 * 유효성 여부를 한번에 확인 한다.
 *
 * @example
 * ```ts
 *  import { validate } from 'ts-fe-toolkit';
 *
    interface UserModel {
      name: string;
      phone: string;
      password: string;
    }

    function execValidation(user: UserModel) {
      const result = validate(user, {
        // 한가지 검증일 땐 객체로 넘겨준다.
        name: {
          // check 가 false 일 때 알려줄 메시지
          message: '이름을 채워주세요.',
          // 유효성 검사. 결과가 true 면 유효성이 검증된 것이다.
          check: val => validate.fn.empty(val),
        },
        // phone 이 필수가 아니라면 생략한다.

        // 여러가지 형태를 검증하고 메시지를 다르게 주고 싶을 땐 배열로 넘겨준다.
        password: [
          {
            message: '비밀번호를 입력하세요',
            check: val => validate.fn.empty(val),
          },
          {
            message: '비밀번호가 유효하지 않습니다.',
            check: val => validate.fn.password(val),
          },
        ]
      });

      console.log(result.isValid); // true 면 모든 유효성 통과.
      console.log(result.firstMessage); // 검증 중 가장 첫번째로 나타난 에러 메시지
      console.log(result.results); // 각 필드별 결과
      // 자세한건 `ValidateBulkResultModel` 참고
    }
 * ```
 * @param state 유효성 체크 할 값이 모여있는 객체.
 * @param opt 유효성 체크 옵션.
 *
 * @see ValidateBulkResultModel
 */
const validateFn = validate;

export default validateFn;

export * from './validate.type';
