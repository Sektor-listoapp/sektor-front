export interface ApiFieldError {
  /** Field path reported by the API, e.g. "clients.0.name". */
  field?: string;
  message: string;
}

export interface ParsedApiError {
  /** Human readable message, always a string (safe to pass to toast). */
  message: string;
  fieldErrors: ApiFieldError[];
}

type RawGraphQLError = {
  message?: string;
  extensions?: { code?: string; errors?: unknown };
};

const toFieldErrors = (value: unknown, field?: string): ApiFieldError[] => {
  if (value == null) return [];
  if (typeof value === "string") return [{ field, message: value }];
  if (Array.isArray(value)) return value.flatMap((item) => toFieldErrors(item, field));
  if (typeof value === "object") {
    const obj = value as { message?: unknown; field?: unknown };
    if (typeof obj.message === "string") {
      return [
        {
          field: typeof obj.field === "string" && obj.field ? obj.field : field,
          message: obj.message,
        },
      ];
    }
    // Record<field, errors> (shape sent by the API's ZodExceptionFilter)
    return Object.entries(value as Record<string, unknown>).flatMap(([key, errors]) =>
      toFieldErrors(errors, key)
    );
  }
  return [];
};

/**
 * Normalizes an Apollo/GraphQL error into a string message plus per-field
 * errors. The API's validation errors come as
 * `extensions.errors = { field: [{ field, message, ... }] }`; passing those
 * objects straight to `toast.error` renders nothing (react-toastify drops
 * non-renderable content), which made failed saves look like nothing happened.
 */
export const parseApiError = (
  error: unknown,
  fallback = "Ha ocurrido un error, intenta de nuevo más tarde"
): ParsedApiError => {
  const err = error as {
    message?: string;
    graphQLErrors?: RawGraphQLError[];
    networkError?: { result?: { errors?: RawGraphQLError[] } } | null;
  };

  const gqlErrors: RawGraphQLError[] = [
    ...(err?.graphQLErrors || []),
    ...(err?.networkError?.result?.errors || []),
  ];

  const fieldErrors = gqlErrors.flatMap((gqlError) =>
    toFieldErrors(gqlError?.extensions?.errors)
  );

  const first = fieldErrors[0];
  const message = first
    ? first.field && first.field !== "general"
      ? `${first.field}: ${first.message}`
      : first.message
    : gqlErrors.find((e) => typeof e?.message === "string" && e.message)?.message ||
      (typeof err?.message === "string" && err.message) ||
      fallback;

  return { message, fieldErrors };
};

/**
 * Scrolls to and highlights the form control matching an API field path.
 * `locators` maps the first segment of the path (e.g. "clients") to a CSS
 * selector or to the visible text of the control inside the form.
 */
export const focusFieldWithError = (
  form: HTMLFormElement | null,
  field: string | undefined,
  locators: Record<string, { selector?: string; text?: string }> = {}
) => {
  if (!form || !field) return;
  const key = field.split(".")[0];
  const locator = locators[key] || { selector: `[name="${key}"]` };

  let element: HTMLElement | null = null;
  if (locator.selector) {
    element = form.querySelector<HTMLElement>(locator.selector);
  }
  if (!element && locator.text) {
    const text = locator.text;
    element =
      Array.from(form.querySelectorAll<HTMLElement>("span, label, h3, p")).find(
        (node) => node.textContent?.trim() === text
      )?.parentElement || null;
  }
  if (!element) return;

  element.scrollIntoView({ behavior: "smooth", block: "center" });
  if (typeof element.focus === "function") element.focus({ preventScroll: true });

  const target =
    (element.closest(".ant-select") as HTMLElement | null) ||
    (element.closest(".border") as HTMLElement | null) ||
    element;
  const previousOutline = target.style.outline;
  const previousOffset = target.style.outlineOffset;
  target.style.outline = "2px solid #ef4444";
  target.style.outlineOffset = "2px";
  window.setTimeout(() => {
    target.style.outline = previousOutline;
    target.style.outlineOffset = previousOffset;
  }, 4000);
};
