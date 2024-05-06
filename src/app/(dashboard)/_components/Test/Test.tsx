"use client";

import { deleteAssetById } from "@/app/api/deleteAssetById/route";
import { useRouter } from "next/navigation";

const Test = ({ data }: { data: any }) => {
  const { push } = useRouter();

  return (
    <>
      <button
        onClick={async () => {
          push("http://localhost:3000/");

          console.log(await deleteAssetById("100030"));
        }}>
        Delete this asset
      </button>
    </>
  );
};

export default Test;
