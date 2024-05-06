import { NextRequest, NextResponse } from "next/server";
import { getAssetById } from "../getAssetById/route";
import { AssetsMockData } from "@/Data/AssetData";
import { Asset } from "@/Data/defs";

const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const id = formData.get("id") as string;

    // Preventing modified original data
    const copiedAssetsMockData = structuredClone(AssetsMockData);

    const response = await getAssetById(id);

    if (response.error === undefined && response.data !== undefined) {
      const {
        data: { parentsId },
      } = response;

      let lastFoundChildrenData: Asset | null = null;

      parentsId.forEach((value) => {
        if (lastFoundChildrenData === null) {
          lastFoundChildrenData = copiedAssetsMockData.find((data) => data.id === value)!;
        } else if (Array.isArray(lastFoundChildrenData.children)) {
          lastFoundChildrenData = lastFoundChildrenData.children.find((data) => data.id === value)!;
        }
      });

      const childrenToModify = lastFoundChildrenData as unknown as Asset;

      if (Array.isArray(childrenToModify.children!)) {
        const foundIndex = childrenToModify.children!.findIndex((data) => `${data.id}` === id)!;

        childrenToModify.children!.splice(foundIndex, 1);
      } else {
        delete childrenToModify.children;
      }

      return NextResponse.json({ status: 200, data: copiedAssetsMockData });
    } else {
      throw new Error("Getting data failed");
    }
  } catch (error) {
    return NextResponse.json({ status: 500, error: `${error}` });
  }
};

export { POST };

const deleteAssetById = async (id: string) => {
  const formData = new FormData();

  formData.set(`id`, `${id}`);

  return await fetch(new Request(`${process.env.NEXT_PUBLIC_URL}/api/deleteAssetById`), {
    cache: "no-store",
    method: "POST",
    body: formData,
  }).then(async (response) => await response.json());
};

export { deleteAssetById };
