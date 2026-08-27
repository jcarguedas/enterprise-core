import type { SharedMessages } from "@/lib/i18n/messages";

const knownApiErrorKeys = {
  "Invalid credentials.": "apiErrorInvalidCredentials",
  "The email has already been taken.": "apiErrorEmailAlreadyTaken",
  "The email field must be a valid email address.": "apiErrorEmailInvalid",
  "Your account is inactive.": "apiErrorInactiveAccount",
  "The email field is required.": "apiErrorEmailRequired",
  "The password field is required.": "apiErrorPasswordRequired",
  "The name field is required.": "apiErrorNameRequired",
  "The password field must be at least 8 characters.": "apiErrorPasswordMinLength",
  "The password confirmation field does not match.": "apiErrorPasswordConfirmationMismatch",
  "The password confirmation field is required.": "apiErrorPasswordConfirmationRequired",
  "The password field confirmation does not match.": "apiErrorPasswordConfirmationMismatch",
} as const satisfies Record<string, keyof SharedMessages>;

export function localizeApiErrorMessage(
  rawMessage: string,
  messages: SharedMessages,
) {
  const normalizedMessage = rawMessage.trim();
  const messageKey =
    knownApiErrorKeys[normalizedMessage as keyof typeof knownApiErrorKeys];

  return messageKey ? messages[messageKey] : rawMessage;
}

export function localizeKnownApiErrorMessage(
  rawMessage: string,
  messages: SharedMessages,
) {
  const normalizedMessage = rawMessage.trim();
  const messageKey =
    knownApiErrorKeys[normalizedMessage as keyof typeof knownApiErrorKeys];

  return messageKey ? messages[messageKey] : null;
}

export function localizeApiErrorMessages(
  rawMessages: string[],
  messages: SharedMessages,
) {
  return rawMessages.map((message) =>
    localizeApiErrorMessage(message, messages),
  );
}

export function getSafeLoginApiErrorMessage({
  messages,
  rawMessages,
  status,
}: {
  messages: SharedMessages;
  rawMessages: string[];
  status: number;
}) {
  if (status >= 500 || rawMessages.some(looksLikeInternalError)) {
    return messages.loginGenericError;
  }

  const localizedMessages = rawMessages.map((message) =>
    localizeKnownApiErrorMessage(message, messages),
  );

  if (
    localizedMessages.length === 0 ||
    localizedMessages.some((message) => message === null)
  ) {
    return messages.loginGenericError;
  }

  return localizedMessages.join(" ");
}

function looksLikeInternalError(rawMessage: string) {
  const normalizedMessage = rawMessage.toLowerCase();

  return [
    "sqlstate",
    "pdoexception",
    "queryexception",
    "stack trace",
    "stacktrace",
    "illuminate\\",
    "vendor\\",
    "database",
    "table",
    "column",
    "select ",
    "insert into",
    "update ",
    "delete from",
  ].some((pattern) => normalizedMessage.includes(pattern));
}
