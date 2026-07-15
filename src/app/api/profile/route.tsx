import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import type { UploadApiResponse } from "cloudinary";

import authOptions from "@/lib/auth";
import connectDb from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import User from "@/model/user.model";

function uploadToCloudinary(
  buffer: Buffer
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "next-auth-profile-images",
        resource_type: "image",
        transformation: [
          {
            width: 500,
            height: 500,
            crop: "fill",
            gravity: "face",
          },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary upload failed"));
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const formData = await request.formData();

    const nameValue = formData.get("name");
    const imageValue = formData.get("image");

    const name =
      typeof nameValue === "string"
        ? nameValue.trim()
        : "";

    if (!name) {
      return NextResponse.json(
        {
          message: "Name is required",
        },
        {
          status: 400,
        }
      );
    }

    await connectDb();

    const user = await User.findOne({
      email: session.user.email.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    let imageUrl = user.image || "";
    let imagePublicId = user.imagePublicId || "";

    if (imageValue instanceof File && imageValue.size > 0) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(imageValue.type)) {
        return NextResponse.json(
          {
            message:
              "Only JPG, PNG and WEBP images are allowed",
          },
          {
            status: 400,
          }
        );
      }

      const maximumFileSize = 2 * 1024 * 1024;

      if (imageValue.size > maximumFileSize) {
        return NextResponse.json(
          {
            message:
              "Image must be smaller than 2 MB",
          },
          {
            status: 400,
          }
        );
      }

      const arrayBuffer = await imageValue.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult =
        await uploadToCloudinary(buffer);

      if (imagePublicId) {
        try {
          await cloudinary.uploader.destroy(imagePublicId);
        } catch (deleteError) {
          console.error(
            "Old Cloudinary image delete failed:",
            deleteError
          );
        }
      }

      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    user.name = name;
    user.image = imageUrl;
    user.imagePublicId = imagePublicId;
    user.profileCompleted = true;

    await user.save();

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          imagePublicId: user.imagePublicId,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Profile update error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Profile update failed",
      },
      {
        status: 500,
      }
    );
  }
}