"use client";

import { editPost } from "@/lib/serverActions/blog/postServerActions";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { areTagsSimilar } from "@/lib/utils/general/utils";

export default function ClientEditForm({ post }) {
  const [tags, setTags] = useState(post.tags.map((tag) => tag.name));
  const router = useRouter();
  const tagInputRef = useRef(null);
  const submitButtonRef = useRef(null);
  const serverValidationText = useRef(null);
  const imgUploadValidationText = useRef(null);
  function handleFileChange(e) {
    const file = e.target.files[0];
    const validImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!validImageTypes.includes(file.type)) {
      imgUploadValidationText.current.textContent =
        "Please upload a valid image (JPEG, PNG or WEBP)";
      e.target.value = "";
      return;
    } else {
      imgUploadValidationText.current.textContent = "";
    }

    const img = new Image();
    img.addEventListener("load", checkImgSizeOnLoad);
    function checkImgSizeOnLoad() {
      if (img.width > 1280 || img.height > 720) {
        imgUploadValidationText.current.textContent =
          "Image exceeds 1280*720 dimensions";
        e.target.value = "";
        URL.revokeObjectURL(img.src);
        return;
      } else {
        imgUploadValidationText.current.textContent = "";
        URL.revokeObjectURL(img.src);
      }
    }
    img.src = URL.createObjectURL(file);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const readableFormData = Object.fromEntries(formData);
    const areSameTags = areTagsSimilar(tags, post.tags);

    if (
      readableFormData.coverImage.size === 0 &&
      readableFormData.title.trim() === post.title.trim() &&
      readableFormData.markdownArticle.trim() === post.markdownArticle.trim() &&
      areSameTags
    ) {
      serverValidationText.current.textContent =
        "You must make a change before submitting";
      return;
    } else {
      serverValidationText.current.textContent = "";
    }

    formData.set("tags", JSON.stringify(tags));
    formData.set("postToEditStringified", JSON.stringify(post));

    serverValidationText.current.textContent = "";
    submitButtonRef.current.textContent = "Updating Post ...";
    submitButtonRef.current.disabled = true;

    try {
      const result = await editPost(formData);

      if (!result.message && result.success) {
        submitButtonRef.current.textContent = "Post updated ✅";
        let countdown = 3;
        serverValidationText.current.textContent = `Redirecting in ${countdown}...`;
        const interval = setInterval(() => {
          countdown -= 1;
          serverValidationText.current.textContent = `Redirecting in ${countdown}...`;

          if (countdown === 0) {
            clearInterval(interval);
            router.push(`/article/${result.slug}`);
          }
        }, 1000);
      } else {
        serverValidationText.current.textContent = `${result.message}`;
        submitButtonRef.current.textContent = "Submit";
        submitButtonRef.current.disabled = false;
      }
    } catch (err) {
      serverValidationText.current.textContent = `${err.message}`;
      submitButtonRef.current.textContent = "Submit";
      submitButtonRef.current.disabled = false;
    }
  }

  function handleAddTag() {
    const newTag = tagInputRef.current.value.trim().toLowerCase();

    if (newTag !== "" && !tags.includes(newTag) && tags.length <= 4) {
      setTags([...tags, newTag]);
      tagInputRef.current.value = "";
    }
  }

  function handleRemoveTag(tagToRemove) {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  }

  function handleEnterOnTagInput(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  }

  return (
    <main className="u-main-container bg-white p-7 mt-32 mb-44">
      <h1 className="text-4xl mb-4">Edit that article ✍️</h1>
      <form onSubmit={handleSubmit} className="pb-6">
        <label htmlFor="title" className="f-label">
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          defaultValue={post.title}
          placeholder="Title"
          minLength={3}
          className="shadow border rounded w-full p-3 mb-7 text-gray-700 focus:outline-slate-400"
          required
        />
        <label htmlFor="coverImage" className="f-label">
          <span>Cover Image (1280*720 for best quality, or less)</span>
          <span className="block font-normal">
            Updating the cover image is <b>optional</b> in edit mode
          </span>
        </label>
        <input
          type="file"
          name="coverImage"
          id="coverImage"
          placeholder="Article's cover image"
          onChange={handleFileChange}
          className="shadow cursor-pointer border rounded w-full p-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline"
        />
        <p ref={imgUploadValidationText} className="text-red-700 mb-7"></p>
        <div className="mb-10">
          <label className="f-label" htmlFor="tag">
            Add a tag(s) (optional, max5)
          </label>
          <div className="flex">
            <input
              type="text"
              id="tag"
              placeholder="Add a tag"
              ref={tagInputRef}
              onKeyDown={handleEnterOnTagInput}
              className="shadow border rounded p-3 text-gray-700 focus:outline-slate-400"
            />
            <button
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold p-4 rounded mx-4"
              onClick={handleAddTag}
              type="button"
            >
              Add
            </button>
            <div className="flex items-center grow whitespace-nowrap overflow-y-auto shadow border rounded px-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block whitespace-nowrap bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-semibold mr-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-red-500 ml-2"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
        <label htmlFor="markdownArticle" className="f-label">
          Write your article using markdown - do not repeat the already given
          title
        </label>
        <a
          target="_blank"
          href="https://www.markdownguide.org/cheat-sheet/"
          className="block mb-4 text-blue-600"
        >
          {" "}
          How to use the markdown syntax ?{" "}
        </a>
        <textarea
          name="markdownArticle"
          id="markdownArticle"
          defaultValue={post.markdownArticle}
          required
          className="min-h-44 text-xl shadow appearance-none border rounded w-full p-8 text-gray-700 mb-4 focus:outline-slate-400"
        ></textarea>
        <button
          ref={submitButtonRef}
          className="min-w-44 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded border-none mb-4"
        >
          Submit
        </button>
        <p className="text-red-600 italic" ref={serverValidationText}></p>
      </form>
    </main>
  );
}
