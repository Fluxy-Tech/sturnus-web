import { createAuthClient } from "better-auth/react";

// Mesmo domínio do site — sem baseURL o client usa a origem atual.
export const authClient = createAuthClient();

export const { signIn, signOut, useSession } = authClient;
