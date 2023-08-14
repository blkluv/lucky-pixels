import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";

function BlockInfoAdd() {
  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      title: "",
      description: "",
      link: "",
      image: null,
    },
  });

  useEffect(() => {
    return () => reset();
  });

  return <div>BlockInfoAdd</div>;
}

export default BlockInfoAdd;
