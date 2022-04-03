/* eslint-disable @typescript-eslint/no-explicit-any */
import fn from './fn';
import {
  ValidateBulkOptionType,
  ValidateBulkResultModel,
  ValidateCheckModel,
  ValidateResultModel,
} from './validate.type';

function _validateSingle<T>(
  val: T,
  item: ValidateCheckModel<T>
): ValidateResultModel {
  try {
    const result = item.check(val);
    const msg = !result ? item.message : '';

    return {
      result,
      message: msg,
    };
  } catch (error) {
    return {
      result: false,
      message: `_validateSingle: ${error.message}`,
    };
  }
}

function _validateBulk<T>(
  val: T,
  opt:
    | ValidateCheckModel<T>
    | ValidateCheckModel<T>[]
    | ((value: T) => ValidateBulkResultModel),
  validateSingle = _validateSingle
): ValidateResultModel {
  let mRes: ValidateResultModel | undefined;

  if (Array.isArray(opt)) {
    opt.every((_opt) => {
      const _mRes = validateSingle(val, _opt);

      if (!_mRes.result) {
        mRes = _mRes;
      }

      return _mRes.result;
    });
  } else if (typeof opt === 'function') {
    const tmpRes = opt(val);
    mRes = {
      result: tmpRes.isValid,
      message: tmpRes.firstMessage,
    };
  } else {
    mRes = validateSingle(val, opt);
  }

  return (
    mRes || {
      result: true,
      message: '',
    }
  );
}

function validateMain<T extends Record<string, any>>(
  state: T,
  opt: ValidateBulkOptionType<T>
): ValidateBulkResultModel;

function validateMain<T extends Record<string, any>>(
  state: T,
  opt: ValidateBulkOptionType<T>,
  validateBulk = _validateBulk
): ValidateBulkResultModel {
  const mRet: Record<string, ValidateResultModel> = {};
  const invalidKeys: string[] = [];
  const validKeys: string[] = [];
  const errorMessages: Record<string, string> = {};
  let isValid = true;
  let firstMessage = '';

  Object.keys(opt).forEach((key) => {
    const val = state[key];
    const items = opt[key];
    const _mRet = validateBulk(val, items);

    mRet[key] = _mRet;
    isValid = isValid && _mRet.result;

    if (_mRet.result) {
      validKeys.push(key);
    } else {
      invalidKeys.push(key);
      errorMessages[key] = _mRet.message;

      if (!firstMessage) {
        firstMessage = _mRet.message;
      }
    }
  });

  return {
    isValid,
    results: mRet,
    validKeys,
    invalidKeys,
    errorMessages,
    firstMessage,
  };
}

export const validate = validateMain as typeof validateMain & {
  fn: typeof fn;
  _validateSingle: typeof _validateSingle;
  _validateBulk: typeof _validateBulk;
};

validate.fn = fn;
validate._validateSingle = _validateSingle;
validate._validateBulk = _validateBulk;
