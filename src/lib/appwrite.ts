import { Account, Client, Databases, ID, Query } from "appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID;

if (!endpoint || !projectId) {
  // eslint-disable-next-line no-console
  console.warn(
    "Appwrite client is missing NEXT_PUBLIC_APPWRITE_ENDPOINT or NEXT_PUBLIC_APPWRITE_PROJECT_ID"
  );
}

const client = new Client();

if (endpoint && projectId) {
  client.setEndpoint(endpoint).setProject(projectId);
}

const account = new Account(client);
const databases = new Databases(client);

export type SignupPayload = {
  fullName: string;
  email: string;
  phone?: string;
  eventInterests: string[];
  notes?: string;
  marketingConsent: boolean;
};

export class AppwriteEnvironmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppwriteEnvironmentError";
  }
}

export class DuplicateSignupError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DuplicateSignupError";
  }
}

function assertEnv() {
  if (!endpoint || !projectId) {
    throw new AppwriteEnvironmentError(
      "Missing Appwrite endpoint or project ID. Update your environment variables."
    );
  }

  if (!databaseId || !collectionId) {
    throw new AppwriteEnvironmentError(
      "Missing Appwrite database or collection ID. Update your environment variables."
    );
  }
}

export async function submitSignup(payload: SignupPayload) {
  assertEnv();

  const normalizedEmail = payload.email.toLowerCase();

  const existing = await databases.listDocuments(databaseId!, collectionId!, [
    Query.equal("email", normalizedEmail),
  ]);

  if (existing.total > 0) {
    throw new DuplicateSignupError("This email address is already registered.");
  }

  return databases.createDocument(databaseId!, collectionId!, ID.unique(), {
    fullName: payload.fullName,
    email: normalizedEmail,
    phone: payload.phone ?? "",
    eventInterests: payload.eventInterests,
    notes: payload.notes ?? "",
    marketingConsent: payload.marketingConsent,
    createdAt: new Date().toISOString(),
  });
}

export { client, account, databases };
