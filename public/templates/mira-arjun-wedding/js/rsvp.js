(() => {
  const form = document.querySelector('#rsvp-form');
  if (!form) return;
  const status = form.querySelector('.form-status');
  const submit = form.querySelector('.submit-button');
  const upload = form.querySelector('#memory-photo');
  const preview = form.querySelector('.upload-preview');
  const previewImage = preview.querySelector('img');
  const previewName = preview.querySelector('span');
  const maxBytes = 5 * 1024 * 1024;
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  const setStatus = (message, error = false) => {
    status.textContent = message;
    status.classList.toggle('error', error);
    status.scrollIntoView({behavior: 'smooth', block: 'nearest'});
  };
  const clearErrors = () => {
    form.querySelectorAll('[aria-invalid="true"]').forEach(el => el.removeAttribute('aria-invalid'));
    form.querySelectorAll('.field-error').forEach(el => el.remove());
    form.querySelectorAll('fieldset[aria-invalid="true"]').forEach(el => el.removeAttribute('aria-invalid'));
  };
  const fieldError = (el, message) => {
    el.setAttribute('aria-invalid', 'true');
    const error = document.createElement('small');
    error.className = 'field-error'; error.textContent = message;
    el.insertAdjacentElement('afterend', error);
  };
  upload.addEventListener('change', () => {
    const file = upload.files?.[0];
    preview.hidden = true;
    if (!file) return;
    if (!allowed.includes(file.type)) { upload.value = ''; setStatus('Please choose a JPG, PNG or WebP image.', true); return; }
    if (file.size > maxBytes) { upload.value = ''; setStatus('That image is larger than 5 MB. Please choose a smaller file.', true); return; }
    previewImage.src = URL.createObjectURL(file);
    previewName.textContent = file.name;
    preview.hidden = false;
    status.textContent = ''; status.classList.remove('error');
  });
  form.querySelector('.remove-upload').addEventListener('click', () => {
    if (previewImage.src.startsWith('blob:')) URL.revokeObjectURL(previewImage.src);
    upload.value = ''; preview.hidden = true; previewImage.removeAttribute('src');
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submit.disabled) return;
    clearErrors(); status.textContent = ''; status.classList.remove('error');
    let firstInvalid = null;
    const attendance = form.querySelector('input[name="attendance"]:checked');
    const source = form.querySelector('input[name="invitationSource"]:checked');
    for (const [name, label] of [['attendance', 'Please let us know if you can attend.'], ['invitationSource', 'Please choose who invited you.']]) {
      const firstChoice = form.querySelector(`input[name="${name}"]`);
      const fieldset = firstChoice.closest('fieldset');
      if (!form.querySelector(`input[name="${name}"]:checked`)) { fieldset.setAttribute('aria-invalid', 'true'); firstInvalid ||= firstChoice; }
    }
    const requiredNames = ['firstName','lastName','email','phone'];
    for (const name of requiredNames) {
      const input = form.elements.namedItem(name);
      if (!input.value.trim()) { fieldError(input, 'This field is required.'); firstInvalid ||= input; }
      else if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) { fieldError(input, 'Enter a valid email address.'); firstInvalid ||= input; }
      else if (name === 'phone' && !/^\+?[\d\s().-]{7,20}$/.test(input.value.trim())) { fieldError(input, 'Enter a valid phone number.'); firstInvalid ||= input; }
    }
    if (!attendance || !source) { setStatus('A couple of quick details are missing. Please check the highlighted fields.', true); firstInvalid?.focus?.(); return; }
    if (firstInvalid) { setStatus('Please check the highlighted fields and try again.', true); firstInvalid.focus(); return; }
    submit.disabled = true;
    const original = submit.querySelector('span').textContent;
    submit.querySelector('span').textContent = 'Preparing…';
    const endpoint = document.querySelector('meta[name="rsvp-endpoint"]')?.content?.trim();
    try {
      if (endpoint) {
        const payload = new FormData(form);
        const response = await fetch(endpoint, {method: 'POST', body: payload, headers: {'Accept': 'application/json'}});
        if (!response.ok) throw new Error(`Submission failed (${response.status}).`);
        form.reset(); preview.hidden = true;
        setStatus('Thank you — your reply has been received. We can’t wait to celebrate with you!');
      } else {
        setStatus('Your reply is valid and ready. This preview has no RSVP server connected, so nothing was sent or saved.');
      }
    } catch (error) {
      setStatus('We couldn’t send your reply just now. Please try again or contact us by email.', true);
    } finally {
      submit.disabled = false;
      submit.querySelector('span').textContent = original;
    }
  });
})();


