import { supabase } from "../lib/supabase";

export type MfaStatus = "unenrolled" | "unverified" | "verified";

export type MfaEnrollment = {
  factorId: string;
  qrCode: string;
  secret: string;
};

export async function getMfaStatus(): Promise<MfaStatus> {
  const [
    { data: factors, error: factorsError },
    { data: assurance, error: assuranceError },
  ] = await Promise.all([
    supabase.auth.mfa.listFactors(),
    supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
  ]);

  if (factorsError) throw factorsError;
  if (assuranceError) throw assuranceError;

  const hasVerifiedFactor = factors.totp.some(
    (factor) => factor.status === "verified",
  );

  if (!hasVerifiedFactor) {
    return "unenrolled";
  }

  return assurance.currentLevel === "aal2" ? "verified" : "unverified";
}

export async function enrollMfa(): Promise<MfaEnrollment> {
  const { data: factors, error: factorsError } =
    await supabase.auth.mfa.listFactors();

  if (factorsError) throw factorsError;

  const unfinishedFactors = factors.all.filter(
    (factor) =>
      factor.factor_type === "totp" &&
      factor.status === "unverified" &&
      factor.friendly_name === "Portfolio Admin",
  );

  for (const factor of unfinishedFactors) {
    const { error } = await supabase.auth.mfa.unenroll({
      factorId: factor.id,
    });

    if (error) throw error;
  }

  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
    friendlyName: "Portfolio Admin",
  });

  if (error) throw error;

  return {
    factorId: data.id,
    qrCode: data.totp.qr_code,
    secret: data.totp.secret,
  };
}

export async function verifyMfa(factorId: string, code: string): Promise<void> {
  const { error } = await supabase.auth.mfa.challengeAndVerify({
    factorId,
    code: code.replace(/\s/g, ""),
  });

  if (error) throw error;
}

export async function verifyExistingMfa(code: string): Promise<void> {
  const { data, error } = await supabase.auth.mfa.listFactors();

  if (error) throw error;

  const factor = data.totp.find(
    (currentFactor) => currentFactor.status === "verified",
  );

  if (!factor) {
    throw new Error("No verified TOTP factor found.");
  }

  await verifyMfa(factor.id, code);
}