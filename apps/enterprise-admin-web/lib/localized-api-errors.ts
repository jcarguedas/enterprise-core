import type { SharedMessages } from "@/lib/i18n/messages";

const knownApiErrorKeys = {
  "Invalid credentials.": "apiErrorInvalidCredentials",
  "The email has already been taken.": "apiErrorEmailAlreadyTaken",
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

export function localizeApiErrorMessages(
  rawMessages: string[],
  messages: SharedMessages,
) {
  return rawMessages.map((message) =>
    localizeApiErrorMessage(message, messages),
  );
}
