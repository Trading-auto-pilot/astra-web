import { type FormEvent, useEffect, useState } from "react";
import { authenticate } from "../../../api/auth";
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

  useEffect(() => {
    const saved = localStorage.getItem("astraai:login:username");
    if (saved) {
      setUsername(saved);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { token, user } = await authenticate({ username, password });
      if (token) {
        localStorage.setItem("astraai:auth:token", token);
      }
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
      window.location.hash = "/dashboard";
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
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
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
          />
        </FormControl>

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

        <BaseButton type="submit" className="w-full" loading={loading} disabled={loading}>
          Login
        </BaseButton>
      </form>
    </AuthLayout>
  );
}
