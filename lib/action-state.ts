export type ActionResult<T = unknown> =
  | {
      ok: true;
      message: string;
      data?: T;
    }
  | {
      ok: false;
      message: string;
      errors?: Record<string, string[]>;
    };

export function actionError(
  message: string,
  errors?: Record<string, string[]>,
): ActionResult {
  return {
    ok: false,
    message,
    errors,
  };
}

export function actionSuccess<T>(message: string, data?: T): ActionResult<T> {
  return {
    ok: true,
    message,
    data,
  };
}
