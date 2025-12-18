import { type FormEvent, useEffect, useState } from "react";
import { fetchCurrentAdmin, login } from "../../../api/auth";
import { updateAdminUser } from "../../../api/users";
import LogoVector from "../../../assets/logo/logo_vector.svg";
import AuthLayout from "../../../layouts/AuthLayout";
import BaseButton from "../../atoms/base/buttons/BaseButton";
import Checkbox from "../../atoms/form/Checkbox";
import FormControl from "../../atoms/form/FormControl";
import FormLabel from "../../atoms/form/FormLabel";
import TextInput from "../../atoms/form/TextInput";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [forcePasswordReset, setForcePasswordReset] = useState(false);
  const [resetUserId, setResetUserId] = useState<string | number | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetError, setResetError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("astraai:login:username");
    if (saved) {
      setUsername(saved);
    }
  }, []);

  const handlePasswordReset = async () => {
    if (!resetUserId) {
      setResetError("Impossibile identificare l'utente per il reset.");
      return;
    }
    if (!newPassword || !confirmPassword) {
      setResetError("Inserisci la nuova password e la conferma.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError("Le password non coincidono.");
      return;
    }

    setLoading(true);
    setResetError(null);
    try {
      await updateAdminUser(resetUserId, { password: newPassword }, authToken);
      setForcePasswordReset(false);
      setResetUserId(null);
      setAuthToken(null);
      setNewPassword("");
      setConfirmPassword("");
      window.location.hash = "/overview";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Impossibile aggiornare la password";
      setResetError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetError(null);

    if (forcePasswordReset) {
      await handlePasswordReset();
      return;
    }

    setLoading(true);

    try {
      const loginResult = await login({ username, password });
      const token = loginResult.token;
      const loginData = loginResult.data as any;

      if (token) {
        localStorage.setItem("astraai:auth:token", token);
        setAuthToken(token);
      }

      const loginUser = loginData?.user ?? {};
      const requiresPasswordReset = !!loginData?.requires_password_reset;
      const loginUserId =
        loginUser?.id ??
        loginUser?.user_id ??
        loginUser?.userId ??
        loginData?.tokenPayload?.sub ??
        null;

      if (requiresPasswordReset) {
        if (!loginUserId) {
          setError("Impossibile identificare l'utente per il reset password.");
          return;
        }
        setForcePasswordReset(true);
        setResetUserId(loginUserId);
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
        return;
      }

      const user = await fetchCurrentAdmin(token);
      if (user && typeof (user as any).username === "string") {
        localStorage.setItem("astraai:auth:username", (user as any).username);
        localStorage.setItem("astraai:login:username", (user as any).username);
      }
      if (user && Array.isArray((user as any).clientNavigation)) {
        localStorage.setItem(
          "astraai:auth:clientNavigation",
          JSON.stringify((user as any).clientNavigation)
        );
      }
      if (remember) {
        localStorage.setItem("astraai:login:username", username);
      } else {
        localStorage.removeItem("astraai:login:username");
      }

      window.location.hash = "/overview";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Accesso non riuscito";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      headerContent={
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <img src={LogoVector} alt="AstraAI" className="h-16 w-auto" />
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-slate-900">Accedi</h1>
            <p className="text-sm text-slate-600">Entra nel tuo account AstraAI.</p>
          </div>
        </div>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {(error || resetError) && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {resetError || error}
          </div>
        )}

        {forcePasswordReset && (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
            Primo accesso: imposta una nuova password per completare il login.
          </div>
        )}

        <FormControl>
          <FormLabel htmlFor="username">Username</FormLabel>
          <TextInput
            id="username"
            type="text"
            placeholder="admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={forcePasswordReset}
          />
        </FormControl>

        {!forcePasswordReset && (
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextInput
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormControl>
        )}

        {forcePasswordReset && (
          <>
            <FormControl>
              <FormLabel htmlFor="new-password">Nuova password</FormLabel>
              <TextInput
                id="new-password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="confirm-password">Conferma password</FormLabel>
              <TextInput
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </FormControl>
          </>
        )}

        {!forcePasswordReset && (
          <div className="flex items-center justify-between">
            <Checkbox
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              label="Ricordami"
            />
            <a href="#/contact" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              Password dimenticata?
            </a>
          </div>
        )}

        <BaseButton type="submit" className="w-full" loading={loading} disabled={loading}>
          {forcePasswordReset ? "Aggiorna password" : "Login"}
        </BaseButton>
      </form>
    </AuthLayout>
  );
}
