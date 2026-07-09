function handleLogoFile(file, onSave) {
  const reader = new FileReader();
  reader.onload = () => onSave({ logoUrl: reader.result, showLogo: true });
  reader.readAsDataURL(file);
}

export default function SettingsSheet({ open, settings, onSave, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-teal-950/40" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-t-[2rem] bg-white p-6 pb-10 safe-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-teal-100" />
        <h2 className="font-display text-xl text-teal-950 italic">Branding</h2>
        <p className="mt-1 text-sm text-teal-700/70">
          Optional — off by default so the quote stays the focus.
        </p>

        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between rounded-2xl border border-teal-100 p-4">
            <div>
              <p className="text-sm font-medium text-teal-950">Show my name</p>
              <input
                value={settings.brandName}
                onChange={(e) => onSave({ brandName: e.target.value })}
                placeholder="Your name or handle"
                className="mt-2 w-full rounded-xl border border-teal-200 bg-paper px-3 py-2 text-sm text-teal-950 placeholder:text-teal-700/40 focus:border-teal-500 focus:outline-none"
              />
            </div>
            <Toggle
              checked={settings.showBrandName}
              onChange={(v) => onSave({ showBrandName: v })}
            />
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-teal-100 p-4">
            <div className="flex flex-1 items-center gap-3">
              {settings.logoUrl && (
                <img
                  src={settings.logoUrl}
                  alt="Your logo"
                  className="h-11 w-11 shrink-0 rounded-lg border border-teal-100 object-contain"
                />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-teal-950">Show logo</p>
                <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-teal-50 px-3 py-2 text-xs font-medium text-teal-700 hover:bg-teal-100">
                  {settings.logoUrl ? "Replace image" : "Upload image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleLogoFile(file, onSave);
                    }}
                  />
                </label>
                {settings.logoUrl && (
                  <p className="mt-1 text-xs text-teal-600">
                    Uploaded — it sits bottom-left on the card.
                  </p>
                )}
              </div>
            </div>
            <Toggle
              checked={settings.showLogo}
              onChange={(v) => onSave({ showLogo: v })}
              disabled={!settings.logoUrl}
            />
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-2xl bg-teal-700 py-3 text-sm font-medium text-teal-50 hover:bg-teal-800"
        >
          Done
        </button>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-40 ${
        checked ? "bg-teal-600" : "bg-teal-100"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
