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

  function handleRemovePhoto() {
    updateAvatar("");
    setPhotoError("");
  }

  function handleEditName() {
    setEditedName(user?.name || "");
    setNameError("");
    setIsEditing(true);
  }

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

  function handleCancelEdit() {
    setEditedName(user?.name || "");
    setNameError("");
    setIsEditing(false);
  }

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  if (loading || !user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#faf7f2] px-5 transition-colors dark:bg-[#1c1613]">
        <div className="flex flex-col items-center text-center">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-[#eadfce] border-t-[#a78655] dark:border-[#49372b] dark:border-t-[#c6a16b]" />

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#faf7f2] dark:bg-[#281d18]">
              <img
                src="/logo.webp"
                alt="Shop Selina logo"
                className="h-12 w-12 object-contain dark:hidden"
              />
              <img
                src="/darkLogo.jpg"
                alt="Shop Selina logo"
                className="hidden h-12 w-12 object-contain dark:block"
              />
            </div>
          </div>

          <h2 className="mt-5 font-serif text-2xl font-semibold text-[#402b20] dark:text-[#faf7f2]">
            Your Account
          </h2>

          <p className="mt-2 text-sm text-[#8b796c] dark:text-[#c4b4a7]">
            Just a moment, getting everything ready...
          </p>

          <div className="mt-5 h-px w-24 bg-[#d4af6a] dark:bg-[#c6a16b]" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf7f2] px-4 py-16 transition-colors dark:bg-[#1c1613] dark:text-[#faf7f2]">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#a78655] dark:text-[#c6a16b]">
            My Account
          </p>

          <h1 className="text-3xl font-semibold text-[#402b20] dark:text-[#faf7f2] sm:text-4xl">
            Welcome, {user.name}
          </h1>

          <p className="mt-3 text-[#786b60] dark:text-[#c4b4a7]">
            Manage your Shop Selina account.
          </p>
        </div>

        <section className="rounded-2xl border border-[#e8dfd2] bg-white p-8 shadow-sm transition-colors dark:border-[#49372b] dark:bg-[#30231d] sm:p-10">
          <div className="mb-8 flex flex-col items-center">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-[#d4af6a] bg-[#402b20] dark:border-[#c6a16b] dark:bg-[#281d18]">
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
              className="mt-5 rounded-lg bg-[#402b20] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#5a3c2c] dark:bg-[#c6a16b] dark:text-[#1c1613] dark:hover:bg-[#d6b27c]"
            >
              Change Profile Picture
            </button>

            {user.avatar && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="mt-3 text-sm text-[#a78655] underline underline-offset-4 hover:text-[#402b20] dark:text-[#c6a16b] dark:hover:text-[#faf7f2]"
              >
                Remove Picture
              </button>
            )}

            {photoError && (
              <p
                role="alert"
                className="mt-3 text-center text-sm text-red-600 dark:text-red-300"
              >
                {photoError}
              </p>
            )}

            <p className="mt-3 text-xs text-[#786b60] dark:text-[#c4b4a7]">
              Choose a picture from your device (maximum 2 MB).
            </p>

            <h2 className="mt-5 text-xl font-semibold text-[#402b20] dark:text-[#faf7f2]">
              {user.name}
            </h2>

            <p className="mt-1 text-sm text-[#786b60] dark:text-[#c4b4a7]">
              Shop Selina Member
            </p>
          </div>

          <div className="space-y-5 border-t border-[#e8dfd2] pt-6 dark:border-[#49372b]">
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#a78655] dark:text-[#c6a16b]">
                  Full Name
                </p>

                {!isEditing && (
                  <button
                    type="button"
                    onClick={handleEditName}
                    className="text-sm font-medium text-[#8b6845] underline underline-offset-4 transition hover:text-[#402b20] dark:text-[#c6a16b] dark:hover:text-[#faf7f2]"
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
                    className="w-full rounded-lg border border-[#e8dfd2] bg-[#fffdf9] px-4 py-3 text-[#402b20] outline-none transition focus:border-[#a78655] focus:ring-1 focus:ring-[#a78655] dark:border-[#49372b] dark:bg-[#281d18] dark:text-[#faf7f2] dark:focus:border-[#c6a16b]"
                  />

                  {nameError && (
                    <p role="alert" className="text-sm text-red-600 dark:text-red-300">
                      {nameError}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleSaveName}
                      className="rounded-lg bg-[#402b20] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#594031] dark:bg-[#c6a16b] dark:text-[#1c1613] dark:hover:bg-[#d6b27c]"
                    >
                      Save Changes
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="rounded-lg border border-[#e8dfd2] px-5 py-2.5 text-sm font-medium text-[#402b20] transition hover:bg-[#faf7f2] dark:border-[#49372b] dark:text-[#faf7f2] dark:hover:bg-[#382a22]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-[#402b20] dark:text-[#faf7f2]">{user.name}</p>
              )}
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#a78655] dark:text-[#c6a16b]">
                Email Address
              </p>

              <p className="break-all text-[#402b20] dark:text-[#faf7f2]">{user.email}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="flex-1 rounded-lg border border-[#402b20] px-5 py-3 text-center font-medium text-[#402b20] transition hover:bg-[#faf7f2] dark:border-[#c6a16b] dark:text-[#c6a16b] dark:hover:bg-[#382a22]"
            >
              Continue Shopping
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex-1 rounded-lg bg-[#402b20] px-5 py-3 font-medium text-white transition hover:bg-[#594031] dark:bg-[#c6a16b] dark:text-[#1c1613] dark:hover:bg-[#d6b27c]"
            >
              Log Out
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}