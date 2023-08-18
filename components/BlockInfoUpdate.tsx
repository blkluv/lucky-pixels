import { useEffect, useState } from "react";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "../hooks/useUser";
import { useRouter } from "next/navigation";
import uniqid from "uniqid";

function BlockInfoInput({ children }) {
  const [selectedBlocks, setSelectedBlocks, setSidebarState, soldBlocks] =
    children;

  const [updateXAmount, setUpdateXAmount] = useState(1);
  const [updateYAmount, setUpdateYAmount] = useState(1);
  const [loading, setLoading] = useState<boolean>();

  const supabaseClient = useSupabaseClient();
  const { user } = useUser();
  const router = useRouter();

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
  let blockArray = [];
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
      setSelectedBlocks(blockArray);
    }
  }, [updateXAmount, updateYAmount]);

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setLoading(true);

      const imageFile = values.image?.[0];

      if (!imageFile || !user) {
        toast.error("Missing fields");
        return;
      }

      const uniqueID = uniqid();

      // Upload image
      const { data: imageData, error: imageError } =
        await supabaseClient.storage
          .from("images")
          .upload(`image-${values.title}-${uniqueID}`, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });
      if (imageError) {
        setLoading(false);
        console.log(imageError);
        return toast.error("Failed image upload");
      }

      // Create group
      const { data: groupData, error: groupError } = await supabaseClient
        .from("block_groups")
        .insert({
          title: values.title,
          desc: values.description,
          image: imageData.path,
          link: values.link,
        })
        .select();
      if (groupError) {
        console.log();
        return toast.error(groupError.message);
      }

      // Select selected block groupID
      // const { data: selectedBlockData } = await supabaseClient
      //   .from("blocks")
      //   .select("*")
      //   .eq("id", (selectedBlocks[0].x - 1) * 100 + selectedBlocks[0].y);
      // Update block
      selectedBlocks.forEach(async (block) => {
        const updateId: number = (block.x - 1) * 100 + block.y;
        console.log(updateId);

        await supabaseClient
          .from("blocks")
          .update({
            image: imageData.path,
            group_id: groupData[0].id,
          })
          .eq("id", updateId);
      });

      router.refresh();
      setLoading(false);
      toast.success("Block updated!");
      reset();
    } catch (error) {
      setLoading(false);
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
        />
        <button className="btn-neutral btn my-10 p-3 px-10" type="submit">
          {loading ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : (
            "UPDATE"
          )}
        </button>
      </form>
    </div>
  );
}

export default BlockInfoInput;
