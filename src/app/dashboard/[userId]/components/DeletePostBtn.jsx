"use client";
import { deletePost } from "@/lib/serverActions/blog/postServerActions";

export default function DeletePostBtn({id}) {
    
    
  return (
    <button onClick={() => deletePost(id)} className="bg-red-600 hover:bg-red-700 text-white font-bold min-w-20 py-2 px-4 rounded mr-2 transition-all duration-200" >
      Delete
    </button>
  );
}
