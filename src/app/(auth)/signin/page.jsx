"use client";

import { useRef } from "react";
import { login } from "@/lib/serverActions/session/sessionServerActions";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/AuthContext";

export default function Signin() {
  const {setIsAuthenticated} = useAuth()
  const serverInfoRef = useRef();
  const submitButtonRef = useRef();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    serverInfoRef.current.classList.add("hidden");
    serverInfoRef.current.textContent = "";
    submitButtonRef.current.disabled = true;
    submitButtonRef.current.textContent = "Signing in...";

    try {
      const result = await login(new FormData(e.target));
      if (result.success) {
        setIsAuthenticated({loading: false, isConnected: true, userId :result.userId })
        router.push("/");
      } else {
        serverInfoRef.current.textContent = `An error has occurred : `;
        console.error("Error during login : ", result.error);
      }
    } catch (err) {
      serverInfoRef.current.classList.remove("hidden");
      console.error("Error during login : ", err);
      submitButtonRef.current.disabled = false;
      submitButtonRef.current.textContent = "Submit";
      serverInfoRef.current.textContent = `${err.message}`;
      serverInfoRef.current.classList;
    }
  }

  return (
    <form onSubmit={handleSubmit} className="f-auth-form">
      <label htmlFor="userName" className="f-label">
        Your pseudo
      </label>
      <input
        type="text"
        name="userName"
        id="userName"
        placeholder="Your pseudo"
        className="f-auth-input"
        required
      />
      <label htmlFor="password" className="f-label">
        Your password
      </label>
      <input
        type="password"
        name="password"
        id="password"
        placeholder="Your password"
        className="f-auth-input"
        required
      />
      <button ref={submitButtonRef} className="f-auth-submit-btn">
        Submit
      </button>
      <p ref={serverInfoRef} className="hidden text-center mb-10"></p>
      <a
        href="/signup"
        className="mb-5 underline text-blue-600 block text-center"
      >
        New here ? Sign up !
      </a>
    </form>
  );
}
