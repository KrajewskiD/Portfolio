#!/usr/bin/env node

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ADMIN_EDGE_FUNCTIONS = [
  {
    name: "translate-text",
    body: {
      text: "Czesc",
      sourceLanguage: "pl",
      targetLanguage: "en",
    },
  },
];

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);

    if (!match) {
      continue;
    }

    const [, key, rawValue] = match;

    if (process.env[key]) {
      continue;
    }

    process.env[key] = rawValue
      .trim()
      .replace(/^['"]|['"]$/g, "");
  }
}

function requiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function createAnonClient(supabaseUrl, publishableKey) {
  return createClient(supabaseUrl, publishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

async function readJsonResponse(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function expectEdgeError({
  supabaseUrl,
  publishableKey,
  functionName,
  body,
  authorization,
  expectedStatus,
  expectedError,
}) {
  const response = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
    method: "POST",
    headers: {
      ...(authorization ? { Authorization: authorization } : {}),
      apikey: publishableKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = await readJsonResponse(response);

  if (response.status !== expectedStatus) {
    throw new Error(
      `${functionName} returned ${response.status}, expected ${expectedStatus}`,
    );
  }

  if (
    expectedError &&
    (!payload || typeof payload !== "object" || payload.error !== expectedError)
  ) {
    throw new Error(
      `${functionName} returned unexpected error body: ${JSON.stringify(
        payload,
      )}`,
    );
  }
}

function isNetworkFailure(message) {
  return /fetch failed|failed to fetch|network|enotfound|econn|etimedout/i.test(
    message,
  );
}

function assertExpectedAccessError(label, error) {
  if (!error) {
    throw new Error(`${label} unexpectedly succeeded`);
  }

  if (isNetworkFailure(error.message)) {
    throw new Error(`${label} failed because of network, not access control`);
  }
}

async function expectSupabaseError(label, operation) {
  const { error } = await operation();

  assertExpectedAccessError(label, error);
}

async function getFirstProject(supabase) {
  const { data, error } = await supabase
    .from("projects")
    .select("id, title_pl")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Public project read failed: ${error.message}`);
  }

  if (!data) {
    throw new Error("No project row available for anon write smoke test");
  }

  return data;
}

async function expectAnonStorageUploadDenied(supabase, bucket) {
  const pathName = `security-smoke/${crypto.randomUUID()}.webp`;
  const file = new Blob(["security-smoke"], { type: "image/webp" });
  const { error } = await supabase.storage.from(bucket).upload(pathName, file, {
    contentType: "image/webp",
    upsert: false,
  });

  if (error) {
    assertExpectedAccessError(`Anon upload to ${bucket}`, error);
    return;
  }

  const { error: cleanupError } = await supabase.storage
    .from(bucket)
    .remove([pathName]);

  throw new Error(
    cleanupError
      ? `Anon upload to ${bucket} succeeded and cleanup failed: ${cleanupError.message}`
      : `Anon upload to ${bucket} unexpectedly succeeded`,
  );
}

async function runTest(name, testFn, results) {
  try {
    await testFn();
    results.push({ name, ok: true });
    console.log(`ok - ${name}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    results.push({ name, ok: false, message });
    console.error(`not ok - ${name}`);
    console.error(`  ${message}`);
  }
}

async function main() {
  loadDotEnv(path.resolve(process.cwd(), ".env.local"));

  const supabaseUrl = requiredEnv("VITE_SUPABASE_URL");
  const publishableKey = requiredEnv("VITE_SUPABASE_PUBLISHABLE_KEY");
  const supabase = createAnonClient(supabaseUrl, publishableKey);
  const results = [];

  for (const edgeFunction of ADMIN_EDGE_FUNCTIONS) {
    await runTest(
      `${edgeFunction.name} rejects missing JWT`,
      () =>
        expectEdgeError({
          supabaseUrl,
          publishableKey,
          functionName: edgeFunction.name,
          body: edgeFunction.body,
          expectedStatus: 401,
          expectedError: "Unauthorized",
        }),
      results,
    );

    await runTest(
      `${edgeFunction.name} rejects invalid JWT`,
      () =>
        expectEdgeError({
          supabaseUrl,
          publishableKey,
          functionName: edgeFunction.name,
          body: edgeFunction.body,
          authorization: "Bearer invalid-token",
          expectedStatus: 401,
        }),
      results,
    );
  }

  await runTest(
    "anon cannot select profiles.email",
    () =>
      expectSupabaseError("Anon profiles.email select", () =>
        supabase.from("profiles").select("email").eq("id", 1).maybeSingle(),
      ),
    results,
  );

  await runTest(
    "anon cannot update projects",
    async () => {
      const project = await getFirstProject(supabase);

      await expectSupabaseError("Anon project update", () =>
        supabase
          .from("projects")
          .update({ title_pl: project.title_pl })
          .eq("id", project.id),
      );
    },
    results,
  );

  for (const bucket of [
    "profile-images",
    "project-images",
    "project-miniatures",
    "project-videos",
  ]) {
    await runTest(
      `anon cannot upload to ${bucket}`,
      () => expectAnonStorageUploadDenied(supabase, bucket),
      results,
    );
  }

  const failed = results.filter((result) => !result.ok);

  console.log("");
  console.log(
    `Security smoke tests: ${results.length - failed.length}/${results.length} passed`,
  );

  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

await main();
