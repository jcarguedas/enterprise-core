export const INACTIVE_ACCOUNT_API_MESSAGE = "Your account is inactive.";
export const INACTIVE_ACCOUNT_LOGIN_REASON = "inactive-account";
export const INACTIVE_ACCOUNT_LOGIN_PATH = `/login?reason=${INACTIVE_ACCOUNT_LOGIN_REASON}`;

type ApiMessageResponse = {
  message?: string;
};

export function isInactiveAccountApiResponse(
  response: Response,
  data: ApiMessageResponse,
) {
  return (
    response.status === 403 && data.message === INACTIVE_ACCOUNT_API_MESSAGE
  );
}
