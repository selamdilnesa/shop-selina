"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { user, loading, logout, updateAvatar, updateName } = useAuth();

  const [photoError, setPhotoError] = useState("");
  const [nameError, setNameError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // Change profile picture
  function handlePhotoChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setPhotoError("");

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setPhotoError("Your picture must be smaller than 2 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        try {
          updateAvatar(reader.result);
        } catch {
          setPhotoError(
            "Unable to save your picture. Please try another image."
          );
        }
      }
    };

    reader.onerror = () => {
      setPhotoError("Unable to read the image. Please try again.");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  }

  // Remove profile picture
  function handleRemovePhoto() {
    updateAvatar("");
    setPhotoError("");
  }

  // Start editing the name
  function handleEditName() {
    setEditedName(user?.name || "");
    setNameError("");
    setIsEditing(true);
  }

  // Save the new name
  function handleSaveName() {
    const trimmedName = editedName.trim();

    if (!trimmedName) {
      setNameError("Name cannot be empty.");
      return;
    }

    if (trimmedName.length < 2) {
      setNameError("Name must contain at least 2 characters.");
      return;
    }

    if (trimmedName.length > 60) {
      setNameError("Name cannot exceed 60 characters.");
      return;
    }

    updateName(trimmedName);
    setIsEditing(false);
    setNameError("");
  }

  // Cancel editing
  function handleCancelEdit() {
    setEditedName(user?.name || "");
    setNameError("");
    setIsEditing(false);
  }

  // Log out
  function handleLogout() {
    logout();
    router.replace("/login");
  }

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf7f2]">
        <p className="text-[#402b20]">Loading your account...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf7f2] px-4 py-16">
      <div className="mx-auto max-w-2xl">
        {/* Page heading */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#a78655]">
            My Account
          </p>

          <h1 className="text-3xl font-semibold text-[#402b20] sm:text-4xl">
            Welcome, {user.name}
          </h1>

          <p className="mt-3 text-[#786b60]">
            Manage your Shop Selina account.
          </p>
        </div>

        <section className="rounded-2xl border border-[#e8dfd2] bg-white p-8 shadow-sm sm:p-10">
          {/* Profile picture */}
          <div className="mb-8 flex flex-col items-center">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-[#d4af6a] bg-[#402b20]">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.name}'s profile picture`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-3xl font-semibold text-white">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
              aria-label="Choose a profile picture"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-5 rounded-lg bg-[#402b20] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#5a3c2c]"
            >
              Change Profile Picture
            </button>

            {user.avatar && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="mt-3 text-sm text-[#a78655] underline underline-offset-4 hover:text-[#402b20]"
              >
                Remove Picture
              </button>
            )}

            {photoError && (
              <p
                role="alert"
                className="mt-3 text-center text-sm text-red-600"
              >
                {photoError}
              </p>
            )}

            <p className="mt-3 text-xs text-[#786b60]">
              Choose a picture from your device (maximum 2 MB).
            </p>

            <h2 className="mt-5 text-xl font-semibold text-[#402b20]">
              {user.name}
            </h2>

            <p className="mt-1 text-sm text-[#786b60]">
              Shop Selina Member
            </p>
          </div>

          {/* Account information */}
          <div className="space-y-5 border-t border-[#e8dfd2] pt-6">
            {/* Editable name */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#a78655]">
                  Full Name
                </p>

                {!isEditing && (
                  <button
                    type="button"
                    onClick={handleEditName}
                    className="text-sm font-medium text-[#8b6845] underline underline-offset-4 transition hover:text-[#402b20]"
                  >
                    Edit Name
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(event) =>
                      setEditedName(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleSaveName();
                      }
                      if (event.key === "Escape") {
                        handleCancelEdit();
                      }
                    }}
                    placeholder="Enter your name"
                    maxLength={60}
                    autoFocus
                    className="w-full rounded-lg border border-[#e8dfd2] bg-[#fffdf9] px-4 py-3 text-[#402b20] outline-none transition focus:border-[#a78655] focus:ring-1 focus:ring-[#a78655]"
                  />

                  {nameError && (
                    <p role="alert" className="text-sm text-red-600">
                      {nameError}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleSaveName}
                      className="rounded-lg bg-[#402b20] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#594031]"
                    >
                      Save Changes
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="rounded-lg border border-[#e8dfd2] px-5 py-2.5 text-sm font-medium text-[#402b20] transition hover:bg-[#faf7f2]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-[#402b20]">{user.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#a78655]">
                Email Address
              </p>

              <p className="break-all text-[#402b20]">{user.email}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="flex-1 rounded-lg border border-[#402b20] px-5 py-3 text-center font-medium text-[#402b20] transition hover:bg-[#faf7f2]"
            >
              Continue Shopping
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex-1 rounded-lg bg-[#402b20] px-5 py-3 font-medium text-white transition hover:bg-[#594031]"
            >
              Log Out
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}