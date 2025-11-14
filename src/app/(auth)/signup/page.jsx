"use client";

import { register } from "@/lib/serverActions/session/sessionServerActions";
import { useRef } from "react";
import { useRouter } from "next/navigation";

export default function page() {
  const serverInfoRef = useRef();
  const submitButtonRef = useRef();

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    serverInfoRef.current.classList.add("hidden");
    serverInfoRef.current.textContent = "";
    submitButtonRef.current.textContent = "Saving user ...";
    submitButtonRef.current.disabled = true;

    try {
      const result = await register(new FormData(e.target));

      if (result.success) {
        submitButtonRef.current.textContent = "User created ✅";
        let countdown = 3;
        serverInfoRef.current.textContent = `Redirecting in ${countdown}...`;
        const interval = setInterval(() => {
          countdown -= 1;
          serverInfoRef.current.textContent = `Redirecting in ${countdown}...`;

          if (countdown === 0) {
            clearInterval(interval);
            router.push(`/signin`);
          }
        }, 1000);
      }
    } catch (err) {
      serverInfoRef.current.classList.remove("hidden");
      serverInfoRef.current.textContent = `${err.message}`;
      submitButtonRef.current.textContent = "Submit";
      submitButtonRef.current.disabled = false;
    }
  }

  return (
    <form className="f-auth-form pb-6" onSubmit={handleSubmit}>
      <label htmlFor="userName" className="f-label">
        Name or pseudo
      </label>
      <input
        type="text"
        name="userName"
        id="userName"
        placeholder="Name or pseudo"
        className="f-auth-input"
        required
      />
      <label htmlFor="email" className="f-label">
        E-mail
      </label>
      <input
        type="email"
        name="email"
        id="email"
        placeholder="E-mail"
        className="f-auth-input"
        required
      />
      <label htmlFor="password" className="f-label">
        Password 
      </label>
      <small className="italic block mb-2 text-slate-500">
        Password must be between 8-64 chars, contain at least one uppercase
        character, one digit and one special character
      </small>
      
      <input
        type="password"
        name="password"
        id="password"
        placeholder="Your password"
        className="f-auth-input"
        required
      />
      <label htmlFor="confirmPassword" className="f-label">
        Confirm password
      </label>
      <input
        type="password"
        name="confirmPassword"
        id="password"
        placeholder="Confirm password"
        className="f-auth-input"
        required
      />
      <button ref={submitButtonRef} className="f-auth-submit-btn">
        Submit
      </button>
      <p
        ref={serverInfoRef}
        className="hidden text-center mb-10 text-red-400 italic"
      ></p>
      <a
        href="/signin"
        className="mb-5 underline text-blue-600 block text-center"
      >
        Already have an account ? Log in !
      </a>
    </form>
  );
}
