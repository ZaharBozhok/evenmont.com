/**
 * Forms: inline validation (text + color), honeypot, fetch submit with an inline success
 * state — no page reload. Without JS the form is a plain POST to the form endpoint.
 * Demo mode (endpoint "demo"): the submit is simulated, nothing leaves the browser.
 */
type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const labelText = (control: Control) =>
  (control.labels?.[0]?.childNodes[0]?.textContent ?? control.name).trim().toLowerCase();

const message = (control: Control) => {
  if (control.dataset.error) return control.dataset.error;
  const v = control.validity;
  if (v.valueMissing) return control.tagName === 'SELECT' ? `Please choose ${labelText(control)}.` : `Please enter your ${labelText(control)}.`;
  if (v.typeMismatch && control.type === 'email') return 'Please enter a valid email address, like name@company.com.';
  if (v.tooLong) return 'This is a little too long.';
  return 'Please check this field.';
};

const showError = (control: Control, text: string) => {
  const error = document.getElementById(`${control.id}-error`);
  if (error) error.textContent = text;
  if (text) control.setAttribute('aria-invalid', 'true');
  else control.removeAttribute('aria-invalid');
};

document.querySelectorAll<HTMLFormElement>('form[data-form]').forEach((form) => {
  form.noValidate = true;
  const wrap = form.closest<HTMLElement>('[data-form-wrap]');
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const controls = () =>
    Array.from(form.elements).filter(
      (el): el is Control => (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) && el.type !== 'hidden' && el.name !== 'website',
    );

  // Re-validate a field once the visitor leaves it or fixes it.
  form.addEventListener('focusout', (e) => {
    const c = e.target as Control;
    if (c.getAttribute?.('aria-invalid') === 'true' || (c.value && !c.checkValidity())) showError(c, c.checkValidity() ? '' : message(c));
  });
  form.addEventListener('input', (e) => {
    const c = e.target as Control;
    if (c.getAttribute?.('aria-invalid') === 'true' && c.checkValidity()) showError(c, '');
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (status) status.textContent = '';
    const invalid = controls().filter((c) => !c.checkValidity());
    controls().forEach((c) => showError(c, c.checkValidity() ? '' : message(c)));
    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    const success = () => {
      const panel = wrap?.querySelector<HTMLElement>('[data-form-success]');
      if (!panel) return;
      form.hidden = true;
      panel.hidden = false;
      panel.focus();
    };

    const data = new FormData(form);
    if (data.get('website')) return success(); // honeypot: quietly drop bots

    const button = form.querySelector<HTMLButtonElement>('[type="submit"]');
    if (form.dataset.demo !== undefined) {
      // Pre-release preview: simulate a short round trip, then show the success state.
      button?.setAttribute('aria-disabled', 'true');
      form.setAttribute('aria-busy', 'true');
      await new Promise((resolve) => setTimeout(resolve, 700));
      form.removeAttribute('aria-busy');
      button?.removeAttribute('aria-disabled');
      return success();
    }

    const endpoint = form.getAttribute('action') ?? '';
    if (endpoint.includes('{{')) {
      // FORM_ENDPOINT is still a placeholder: show the success state in development only.
      if (import.meta.env.DEV) return success();
      if (status) status.textContent = 'This form is not connected yet. Please email us instead.';
      return;
    }

    button?.setAttribute('aria-disabled', 'true');
    form.setAttribute('aria-busy', 'true');
    try {
      const response = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(String(response.status));
      success();
    } catch {
      if (status) status.textContent = 'Something went wrong. Please try again in a minute, or email us.';
    } finally {
      button?.removeAttribute('aria-disabled');
      form.removeAttribute('aria-busy');
    }
  });
});
