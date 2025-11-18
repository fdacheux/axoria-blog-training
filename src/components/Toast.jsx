"use client";
import { useState, useRef, useEffect } from "react";

export default function Toast({ errMsg }) {
  const [isDisplayed, setIsDisplayed] = useState(true);
  const toastRef = useRef(null);
  const errorTxt = errMsg ? errMsg : "";

  function closeToast() {
    setIsDisplayed(false);
    window.location.reload();
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (!toastRef?.current?.contains(event.target)) {
        closeToast();
      }
    }
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <div
      id="toast-default"
      className={`fixed top-20 right-10 flex items-center w-full max-w-xs p-4 text-body bg-red-600/95 rounded-base shadow-xs border border-default ${!isDisplayed && "hidden"}`}
      role="alert"
      ref={toastRef}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="#fff"
        className="size-14"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
        />
      </svg>

      <div className="ms-2.5 text-sm border-s border-default ps-3.5">
        <p className="text-white font-semibold">{errorTxt}</p>
      </div>
      <button
        type="button"
        className="ms-auto flex items-center justify-center text-body hover:text-heading bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded text-sm h-8 w-8 focus:outline-none"
        data-dismiss-target="#toast-default"
        aria-label="Close"
        onClick={closeToast}
      >
        <span className="sr-only">Close</span>
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
            d="M6 18 17.94 6M18 18 6.06 6"
          />
        </svg>
      </button>
    </div>
  );
}
