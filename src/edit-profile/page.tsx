"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Camera,
  CheckCircle2,
  LoaderCircle,
  User,
  X,
} from "lucide-react";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useState,
} from "react";

import "./edit-profile.css";

export default function EditProfilePage() {
  const router = useRouter();

  const {
    data: session,
    status,
    update,
  } = useSession();

  const [name, setName] = useState("");
  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (session?.user) {
      setName(session.user.name || "");
      setImagePreview(session.user.image || "");
    }
  }, [session, status, router]);

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG and WEBP images are allowed");
      return;
    }

    const maximumSize = 2 * 1024 * 1024;

    if (file.size > maximumSize) {
      setError("Image must be smaller than 2 MB");
      return;
    }

    setError("");
    setSuccess("");
    setSelectedImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleRemoveSelectedImage = () => {
    if (
      imagePreview &&
      imagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(null);
    setImagePreview(session?.user?.image || "");
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Please enter your name");
      return;
    }

    if (trimmedName.length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", trimmedName);

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await fetch("/api/profile", {
        method: "PATCH",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Profile update failed"
        );
        return;
      }

      setSuccess("Profile updated successfully");

      await update({
        name: data.user.name,
        image: data.user.image,
      });

      setSelectedImage(null);
      setImagePreview(data.user.image || "");

      setTimeout(() => {
        router.replace("/");
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error("Profile update error:", error);

      setError(
        "Unable to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <main className="edit-profile-loading">
        <LoaderCircle className="edit-profile-loading-icon" />
        <p>Loading your profile...</p>
      </main>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <main className="edit-profile-page">
      <div className="edit-profile-shape edit-profile-shape-one" />
      <div className="edit-profile-shape edit-profile-shape-two" />

      <section className="edit-profile-card">
        <button
          type="button"
          className="edit-profile-close"
          onClick={() => router.push("/")}
          aria-label="Close edit profile"
        >
          <X size={20} />
        </button>

        <div className="edit-profile-heading">
          <p>EDIT PROFILE</p>

          <h1>Personalize your account</h1>

          <span>
            Update your display name and profile image.
          </span>
        </div>

        <form
          className="edit-profile-form"
          onSubmit={handleSubmit}
        >
          <div className="edit-profile-image-section">
            <div className="edit-profile-image-preview">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Profile preview"
                  width={140}
                  height={140}
                  unoptimized={imagePreview.startsWith(
                    "blob:"
                  )}
                />
              ) : (
                <User size={55} />
              )}

              <label className="edit-profile-camera-button">
                <Camera size={18} />

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div className="edit-profile-image-text">
              <strong>Profile picture</strong>

              <span>
                JPG, PNG or WEBP. Maximum size 2 MB.
              </span>

              {selectedImage && (
                <button
                  type="button"
                  onClick={handleRemoveSelectedImage}
                >
                  Remove selected image
                </button>
              )}
            </div>
          </div>

          <div className="edit-profile-form-group">
            <label htmlFor="profile-name">
              Display name
            </label>

            <input
              id="profile-name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              maxLength={50}
              required
            />
          </div>

          <div className="edit-profile-form-group">
            <label htmlFor="profile-email">
              Email address
            </label>

            <input
              id="profile-email"
              type="email"
              value={session.user.email || ""}
              disabled
            />

            <small>
              Your email address cannot be changed here.
            </small>
          </div>

          {error && (
            <div className="edit-profile-message edit-profile-error">
              {error}
            </div>
          )}

          {success && (
            <div className="edit-profile-message edit-profile-success">
              <CheckCircle2 size={18} />
              {success}
            </div>
          )}

          <div className="edit-profile-actions">
            <button
              type="button"
              className="edit-profile-cancel-button"
              onClick={() => router.push("/")}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="edit-profile-save-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle className="edit-profile-button-loader" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}