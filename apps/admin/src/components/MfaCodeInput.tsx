import { useRef } from "react";

type MfaCodeInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
};

const codeLength = 6;

function MfaCodeInput({
  id,
  value,
  onChange,
  disabled = false,
  autoFocus = false,
}: MfaCodeInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const digits = Array.from(
    { length: codeLength },
    (_, index) => value[index] ?? "",
  );

  function updateCode(nextDigits: string[]) {
    onChange(nextDigits.join("").slice(0, codeLength));
  }

  function handleChange(index: number, nextValue: string) {
    const nextDigit = nextValue.replace(/\D/g, "").slice(-1);
    const nextDigits = [...digits];

    nextDigits[index] = nextDigit;
    updateCode(nextDigits);

    if (nextDigit && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key !== "Backspace") return;

    if (digits[index]) {
      const nextDigits = [...digits];
      nextDigits[index] = "";
      updateCode(nextDigits);
      return;
    }

    if (index > 0) {
      inputRefs.current[index - 1]?.focus();

      const nextDigits = [...digits];
      nextDigits[index - 1] = "";
      updateCode(nextDigits);
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();

    const pastedCode = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, codeLength);

    onChange(pastedCode);

    const nextIndex = Math.min(pastedCode.length, codeLength - 1);
    inputRefs.current[nextIndex]?.focus();
  }

  return (
    <div
      className="flex gap-2 sm:gap-3"
      role="group"
      aria-labelledby={`${id}-label`}
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          id={index === 0 ? id : undefined}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          value={digit}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          className="size-12 rounded-2xl border border-white/25 bg-white/10 text-center text-2xl font-black text-white outline-none transition focus:border-white disabled:cursor-not-allowed disabled:opacity-40 sm:size-14"
        />
      ))}
    </div>
  );
}

export default MfaCodeInput;
