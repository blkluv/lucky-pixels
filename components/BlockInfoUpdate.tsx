"use client";

import { useEffect, useState, useRef } from "react";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import uniqid from "uniqid";
import imageToSlices from "image-to-slices";
import { BsFillEyeFill } from "react-icons/bs";

import { useUser } from "../hooks/useUser";
import ImagePreviewModal from "../components/ImagePreviewModal";

import { resizeImg } from "./resizeImg";

let handleImgType;
function BlockInfoInput({ children }) {
  const [selectedBlocks, setSelectedBlocks, setSidebarState, userBlocks] =
    children;

  const [updateXAmount, setUpdateXAmount] = useState(1);
  const [updateYAmount, setUpdateYAmount] = useState(1);
  const [loading, setLoading] = useState<boolean>();
  const [isPreview, setIsPreview] = useState(false);
  const [slicedImages, setSlicedImages] = useState<any>();

  const lastXAmount = useRef(updateXAmount);
  const lastYAmount = useRef(updateYAmount);

  const supabaseClient = useSupabaseClient();
  const { user } = useUser();
  const router = useRouter();

  function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(",")[1]);

    // separate out the mime component
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], { type: mimeString });
    return blob;
  }

  const { register, handleSubmit, reset, getValues } = useForm<FieldValues>({
    defaultValues: {
      title: "",
      description: "",
      link: "",
      image: null,
    },
  });
  ``;
  function changeAmount(direction, amount) {
    if (amount > 0) {
      if (direction === "x" && selectedBlocks[0].y + amount - 1 <= 100) {
        setUpdateXAmount(amount);
      }
      if (direction === "y" && selectedBlocks[0].x + amount - 1 <= 100) {
        setUpdateYAmount(amount);
      }
    }
  }

  useEffect(() => {
    if (updateXAmount != 1 || updateYAmount != 1) {
      let blockArray = [];
      for (let i = 0; i < updateXAmount; i++) {
        blockArray.push(
          ...[...Array(updateYAmount)].map((y, j) => {
            return {
              x: selectedBlocks[0].x + j,
              y: selectedBlocks[0].y + i,
            };
          })
        );
      }
      let nonUserOwnedBlocks = blockArray.filter(
        (block) => !userBlocks[(block.x - 1) * 100 + block.y]
      );
      if (nonUserOwnedBlocks.length == 0) {
        setSelectedBlocks(blockArray);
        lastXAmount.current = updateXAmount;
        lastYAmount.current = updateYAmount;
      } else {
        setUpdateXAmount(lastXAmount.current);
        setUpdateYAmount(lastYAmount.current);
      }

      setSelectedBlocks(blockArray);
    }
  }, [updateXAmount, updateYAmount]);

  useEffect(() => {
    if (slicedImages?.length > 0) {
      if (handleImgType === "preview") setIsPreview(true);
      if (handleImgType === "upload") {
        console.log(slicedImages);
        uploadImage();
      }
    }
  }, [slicedImages]);

  async function uploadImage() {
    try {
      setLoading(true);
      const values = getValues();
      const uniqueID = uniqid();
      const fullImageFile = values.image?.[0];
      //Upload full image
      const { data: imageData } = await supabaseClient.storage
        .from("images")
        .upload(`full-image-${values.title}-${uniqueID}`, fullImageFile, {
          cacheControl: "3600",
          upsert: false,
        });
      // Create group
      const { data: groupData } = await supabaseClient
        .from("block_groups")
        .insert({
          title: values.title,
          desc: values.description,
          image: imageData.path,
          link: values.link,
        })
        .select();
      // Update sliced images and update block
      let sortedArray = selectedBlocks.sort((a, b) => a.x - b.x);
      sortedArray.forEach(async (block, index) => {
        const uuid = uniqid();
        const updateId: number = (block.x - 1) * 100 + block.y;

        const blobImage = dataURItoBlob(slicedImages[index]);
        const resizedImg = await resizeImg(blobImage);
        const resizedBlobImg = dataURItoBlob(resizedImg);

        const { data: sliceData } = await supabaseClient.storage
          .from("images")
          .upload(`block-image-${values.title}-${uuid}`, resizedBlobImg, {
            cacheControl: "3600",
            upsert: false,
          });

        await supabaseClient
          .from("blocks")
          .update({
            image: sliceData.path,
            group_id: groupData[0].id,
          })
          .eq("id", updateId);
      });
      setLoading(false);
      toast.success("Block updated!");
      reset();
      router.refresh();
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleImg(type: any, imageFile: any) {
    handleImgType = type;
    const values = imageFile ?? getValues()?.image;
    if (values?.length > 0) {
      setLoading(true);
      const uploadedImage = new Image();
      uploadedImage.src = URL.createObjectURL(values[0]);
      uploadedImage.onload = () => {
        let sliceSize =
          uploadedImage.width / updateXAmount <
          uploadedImage.height / updateYAmount
            ? Math.floor(uploadedImage.width / updateXAmount)
            : Math.floor(uploadedImage.height / updateYAmount);

        imageToSlices(
          uploadedImage.src,
          [sliceSize * updateYAmount],
          [sliceSize * updateXAmount],
          {
            saveToDataUrl: true,
          },
          function (firstSlice) {
            if (updateXAmount > 1 || updateYAmount > 1) {
              const img = new Image();
              img.src = firstSlice[0].dataURI;
              img.onload = () => {
                let lineXArray = [];
                let lineYArray = [];
                let shortDirection =
                  img.width / updateXAmount < img.height / updateYAmount
                    ? "x"
                    : "y";
                if (shortDirection == "x") {
                  sliceSize = Math.floor(img.width / updateXAmount);
                  for (let x = 1; x < updateXAmount; x++)
                    lineXArray.push(+(sliceSize * x).toFixed(2));
                  for (let y = 1; y < updateYAmount; y++)
                    lineYArray.push(+(sliceSize * y).toFixed(2));
                } else {
                  sliceSize = Math.floor(img.height / updateYAmount);
                  for (let y = 1; y < updateYAmount; y++)
                    lineYArray.push(+(sliceSize * y).toFixed(2));
                  for (let x = 1; x < updateXAmount; x++)
                    lineXArray.push(+(sliceSize * x).toFixed(2));
                }
                imageToSlices(
                  img.src,
                  lineYArray,
                  lineXArray,
                  {
                    saveToDataUrl: true,
                  },
                  function (secondSliceRes) {
                    const imgSlices = secondSliceRes.map(
                      (slice) => slice.dataURI
                    );
                    setSlicedImages(imgSlices);
                    setLoading(false);
                    return imgSlices;
                  }
                );
              };
            } else {
              const imgSlices = [firstSlice[0].dataURI];
              setSlicedImages(imgSlices);
              setLoading(false);
              return imgSlices;
            }
          }
        );
      };
    } else toast("No image uploaded");
  }

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    const imageFile = values.image;
    if (!imageFile || !user) {
      toast.error("Missing fields");
      return;
    }
    handleImg("upload", imageFile);
  };

  return (
    <div className="flex flex-col items-center py-3">
      <h2 className="card-title">
        Pixel#
        {selectedBlocks
          ? (selectedBlocks[0].x - 1) * 100 + selectedBlocks[0].y
          : "00000"}
        <div className="badge badge-accent py-3">YOUR BLOCK</div>
      </h2>
      <button
        onClick={() => setSidebarState("info")}
        className="btn-ghost btn-xs my-3 mb-10 w-fit underline"
      >
        Go to block
      </button>
      <div className="flex w-full justify-between p-3 text-lg">
        Block width:{" "}
        <input
          type="number"
          min={1}
          max={100}
          value={updateXAmount}
          onChange={(e) => changeAmount("x", parseInt(e.target.value))}
        />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <div className="flex w-full justify-between p-3 text-lg">
          Block height:{" "}
          <input
            type="number"
            min={1}
            max={100}
            value={updateYAmount}
            onChange={(e) => changeAmount("y", parseInt(e.target.value))}
          />
        </div>
        <input
          type="text"
          placeholder="Title"
          className="input-bordered input mb-3 w-full max-w-xs"
          {...register("title", { required: true })}
          id="title"
        />
        <textarea
          className="textarea-bordered textarea mb-3 w-full"
          placeholder="Description"
          id="description"
          {...register("description", { required: true })}
        />
        <input
          type="text"
          placeholder="Link"
          className="input-bordered input input-xs mb-3 w-full max-w-xs"
          id="link"
          {...register("link", { required: true })}
        />
        <input
          type="file"
          className="file-input-bordered file-input file-input-xs max-w-xs"
          id="image"
          accept="image/*"
          {...register("image", { required: true })}
        />
        <button
          className="border-1 btn mt-5 border-current p-3 px-10"
          onClick={() => handleImg("preview", null)}
          type="button"
        >
          {loading ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : (
            <>
              PREVIEW IMAGE
              <BsFillEyeFill size={25} />
            </>
          )}
        </button>

        <button className="btn-neutral btn  p-3 px-10" type="submit">
          {loading ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : (
            "UPDATE"
          )}
        </button>
      </form>
      {isPreview && (
        <ImagePreviewModal
          slicedImages={slicedImages}
          amountX={updateXAmount}
          amountY={updateYAmount}
          setIsPreview={setIsPreview}
        />
      )}
    </div>
  );
}

export default BlockInfoInput;
