"use client";

import { useEffect, useState, useRef } from "react";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import uniqid from "uniqid";
import imageToSlices from "image-to-slices";
import { default as NextImage } from "next/image";

import { useUser } from "../hooks/useUser";

function BlockInfoInput({ children }) {
  const [selectedBlocks, setSelectedBlocks, setSidebarState, userBlocks] =
    children;

  const [updateXAmount, setUpdateXAmount] = useState(1);
  const [updateYAmount, setUpdateYAmount] = useState(1);
  const [loading, setLoading] = useState<boolean>();
  const [slicedImages, setSlicedImages] = useState([]);

  const lastXAmount = useRef(updateXAmount);
  const lastYAmount = useRef(updateYAmount);

  const supabaseClient = useSupabaseClient();
  const { user } = useUser();
  const router = useRouter();
  let blockArray = [];
  let imgSlice = [];

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      title: "",
      description: "",
      link: "",
      image: null,
    },
  });

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

  function handleImg(data) {
    if (data.target.files[0]) {
      const img = new Image();
      img.src = URL.createObjectURL(data.target.files[0]);
      let short;
      img.onload = () => {
        console.log(img.width, img.height);
        short =
          img.width / updateXAmount < img.height / updateYAmount ? "x" : "y";
        let lineXArray = [];
        let lineYArray = [];
        let sliceSize;
        if (short == "x") {
          sliceSize = img.width / updateXAmount;
          for (let x = 1; x <= updateXAmount; x++)
            lineXArray.push(+(sliceSize * x).toFixed(2));
          for (let y = 1; y <= updateYAmount + 1; y++)
            lineYArray.push(lineXArray[0] * y);
        } else {
          sliceSize = img.height / updateYAmount;
          for (let y = 1; y <= updateYAmount; y++)
            lineYArray.push(+(sliceSize * y).toFixed(2));
          for (let x = 1; x <= updateXAmount + 1; x++)
            lineXArray.push(lineYArray[0] * x);
        }
        console.log(lineXArray, lineYArray);
        if (lineXArray.length > 0 || lineYArray.length > 0)
          imageToSlices(
            img.src,
            lineXArray,
            lineYArray,
            {
              saveToDataUrl: true,
            },
            function (res) {
              console.log(res);
              let tempArray = [];
              res.forEach((img, i) => {
                if ((i + 1) % updateYAmount != 0) tempArray.push(img.dataURI);
              });
              // setSlicedImages(res.map((data) => data.dataURI));
              setSlicedImages(tempArray);
            }
          );
        else setSlicedImages([img.src]);
      };
    }
  }

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setLoading(true);
      const imageFile = values.image?.[0];
      console.log(imageFile);

      if (!imageFile || !user) {
        toast.error("Missing fields");
        return;
      }
      const img = new Image();
      img.src = URL.createObjectURL(imageFile);
      img.onload = () => {
        console.log(img.height);
      };

      // const uniqueID = uniqid();

      // Upload image
      // const { data: imageData, error: imageError } =
      //   await supabaseClient.storage
      //     .from("images")
      //     .upload(`image-${values.title}-${uniqueID}`, imageFile, {
      //       cacheControl: "3600",
      //       upsert: false,
      //     });
      // if (imageError) {
      //   setLoading(false);
      //   console.log(imageError);
      //   return toast.error("Failed image upload");
      // }

      // // Create group
      // const { data: groupData, error: groupError } = await supabaseClient
      //   .from("block_groups")
      //   .insert({
      //     title: values.title,
      //     desc: values.description,
      //     image: imageData.path,
      //     link: values.link,
      //   })
      //   .select();
      // if (groupError) {
      //   console.log(groupError);
      //   return toast.error(groupError.message);
      // }

      // // Select selected block groupID
      // // const { data: selectedBlockData } = await supabaseClient
      // //   .from("blocks")
      // //   .select("*")
      // //   .eq("id", (selectedBlocks[0].x - 1) * 100 + selectedBlocks[0].y);

      // // Update block
      // selectedBlocks.forEach(async (block) => {
      //   const updateId: number = (block.x - 1) * 100 + block.y;
      //   await supabaseClient
      //     .from("blocks")
      //     .update({
      //       image: imageData.path,
      //       group_id: groupData[0].id,
      //     })
      //     .eq("id", updateId);
      // });
      // setLoading(false);
      // toast.success("Block updated!");
      // reset();
      // router.refresh();
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
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
          onChange={handleImg}
        />

        <button className="btn-neutral btn my-5 p-3 px-10" type="submit">
          {loading ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : (
            "UPDATE"
          )}
        </button>
      </form>
      {slicedImages.length > 0 &&
        [...Array(updateYAmount)].map((a, x) => {
          return (
            <div key={x} className="flex">
              {[...Array(updateXAmount)].map((b, y) => {
                const imgPath = slicedImages[x * updateXAmount + y];
                return (
                  <div
                    key={x * updateXAmount + y}
                    className={`relative flex items-center justify-center`}
                    style={{ height: 25, width: 25, margin: 0 }}
                  >
                    {imgPath && (
                      <NextImage
                        src={imgPath}
                        fill
                        quality={20}
                        alt="Pixel picture"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      <div className="flex flex-row">
        {slicedImages.length > 0 &&
          slicedImages.map((img, i) => {
            return (
              <div
                key={i}
                className={`relative flex flex-row items-center justify-center`}
                style={{ height: 25, width: 25, margin: 0 }}
              >
                <NextImage src={img} fill quality={20} alt="Pixel picture" />
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default BlockInfoInput;
