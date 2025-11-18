"use client";
import { deletePost } from "@/lib/serverActions/blog/postServerActions";
import Toast from "@/components/Toast";
import { useState } from "react";

export default function DeletePostBtn({ id }) {
  const [error, setError] = useState(null);
  async function handleDelete() {
    const result = await deletePost(id);

    if (result?.message) {
      setError(result.message);
    }
  }

  return (
    <>
      <button
        onClick={() => handleDelete()}
        className="bg-red-600 hover:bg-red-700 text-white font-bold min-w-20 py-2 px-4 rounded mr-2 transition-all duration-200"
      >
        Delete
      </button>
      {error && <Toast errMsg={error} />}
    </>
  );
}
