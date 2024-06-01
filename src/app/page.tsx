"use client";

import Script from "next/script";

import { useState } from "react";
import { fabric } from "fabric";
import { v4 as uuidv4 } from "uuid";

import { AWS_S3_BUCKET_NAME, AWS_BASE_URL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import clsx from "clsx";

export default function Home() {
  const [imagePreview, setImagePreview] = useState({
    human: { file: null, objectURL: null },
    pet: { file: null, objectURL: null },
  });
  const [uploading, setUploading] = useState(false);
  const [s3Uploading, setS3Uploading] = useState(false);
  const [finalImageUrl, setFinalImageUrl] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  const [response, setResponse] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false); // to keep track of if payment is done or not
  const [error, setError] = useState("");

  const uploadThing = async (image: any, userId: string, name: string) => {
    setS3Uploading(true);

    try {
      const { awsPath, data } = await (
        await fetch("/api/s3", {
          method: "POST",
          body: JSON.stringify({
            userId: userId,
            name: name,
          }),
        })
      ).json();

      const fields = data.fields;

      const s3Data: { [key: string]: any } = {
        key: fields.key,
        bucket: AWS_S3_BUCKET_NAME,
        Policy: fields["Policy"],
        "X-Amz-Algorithm": fields["X-Amz-Algorithm"],
        "X-Amz-Credential": fields["X-Amz-Credential"],
        "X-Amz-Date": fields["X-Amz-Date"],
        "X-Amz-Signature": fields["X-Amz-Signature"],
        "content-type": "image/",
      };

      const formData = new FormData();
      Object.keys(s3Data).forEach((key) => formData.append(key, s3Data[key]));

      formData.append("file", image);

      // Now you can use the formData to send a fetch request to your server or S3 endpoint.
      const response = await fetch(data.url, {
        method: "POST",
        body: formData,
      });

      const responseData = await response.text();
      console.log(responseData); // If you want to do something with the response

      setS3Uploading(false);
      return awsPath;
    } catch (error) {
      console.error("Error:", error);
      setS3Uploading(false);
    }
  };

  const handleImagePreview = (event: any, type: string) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview((prev) => ({
        ...prev,
        [type]: { file: file, objectURL: URL.createObjectURL(file) },
      }));
    }
  };

  const handleClearImage = (type: string) => {
    setImagePreview((prev) => ({
      ...prev,
      [type]: { file: null, objectURL: null },
    }));
  };

  async function loadImageFromUrl(imageUrl: string): Promise<fabric.Image> {
    return new Promise((resolve, reject) => {
      fabric.Image.fromURL(
        imageUrl,
        function (oImg) {
          resolve(oImg);
        },
        {
          crossOrigin: "Anonymous",
        }
      );
    });
  }

  const mergeImagesAndAddStamp = async (result: string) => {
    if (!result) return;

    let humanImage: fabric.Image, petImage: fabric.Image;

    const userId = localStorage.getItem("userId");

    console.log(userId);

    if (!imagePreview.human.objectURL || !imagePreview.pet.objectURL) {
      console.log("No Preview image ");
      const image1 = `${AWS_BASE_URL}/${userId}/1.png?${Date.now()}`;
      const image2 = `${AWS_BASE_URL}/${userId}/2.png?${Date.now()}`;
      console.log(image1);
      humanImage = await loadImageFromUrl(image1);
      petImage = await loadImageFromUrl(image2);
    } else {
      humanImage = await loadImageFromUrl(imagePreview.human.objectURL!);
      petImage = await loadImageFromUrl(imagePreview.pet.objectURL!);
    }

    // Calculate canvas size
    const maxWidth = Math.max(humanImage.width!, petImage.width!);
    const maxHeight = Math.max(humanImage.height!, petImage.height!);

    // Create canvas to merge images
    const canvasWidth = maxWidth * 2;
    const canvasHeight = maxHeight;

    const canvas = new fabric.Canvas("C", {
      width: canvasWidth,
      height: canvasHeight,
    });

    // Position the human image on the left side of the canvas
    humanImage.left = 0;
    humanImage.top = 0;

    // Position the pet image on the right side of the canvas
    petImage.left = maxWidth;
    petImage.top = 0;

    // Add the images to the canvas
    canvas.add(humanImage);
    canvas.add(petImage);

    // Create a circular stamp with the score
    // const score = 0.75; // Replace with the actual score value

    const scoreMatch = result.match(/(\d+(\.\d+)?)/);
    const score = scoreMatch ? parseFloat(scoreMatch[0]) : 0;

    const stampText = `Score: ${score.toFixed(2)}`;
    const stampColor = score < 0.5 ? "red" : "green";

    const stamp = new fabric.Circle({
      radius: 80,
      fill: stampColor,
      originX: "center",
      originY: "center",
    });

    const text = new fabric.Text(stampText, {
      fontSize: 20,
      fontFamily: "Arial",
      fill: "white",
      originX: "center",
      originY: "center",
      fontWeight: "bold",
    });

    const group = new fabric.Group([stamp, text], {
      left: canvasWidth / 2,
      top: canvasHeight / 2,
      originX: "center",
      originY: "center",
    });

    // Ensure the stamp is centered on the canvas
    group.centerH();
    group.centerV();

    canvas.add(group);

    let u = canvas.toDataURL();
    setFinalImageUrl(u);
  };

  const handleUpload = async () => {
    if (!imagePreview.human.objectURL || !imagePreview.pet.objectURL) {
      alert("Please select both human and pet images to upload.");
      return;
    }
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem("userId", userId);
    }

    try {
      setUploading(true);

      Promise.all([
        uploadThing(imagePreview.human.file, userId, "1.png"),
        uploadThing(imagePreview.pet.file, userId, "2.png"),
      ])
        .then(() => {
          console.log("Success");
        })
        .catch((error) => {
          console.error("Error uploading files:", error);
        });
    } catch (error) {
      console.error("Error:", error);
      setError(
        `An error occurred while uploading the images. Please try again. ${JSON.stringify(
          error
        )}`
      );
    } finally {
      setUploading(false);

      // call payment with UUID
      setPaymentLink(
        `https://rocketship.lemonsqueezy.com/buy/40feff62-118d-4471-b016-8696544f04a6?checkout[custom][user_id]=${userId}`
      );
    }
  };

  const [toggleCanva, setToggleCanva] = useState(false);

  return (
    <div>
      <h1 className="text-center text-2xl mt-4">Dreams</h1>
      <p className="btn">Hello</p>
    </div>
  );
}
