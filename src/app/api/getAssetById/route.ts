import { AssetsMockData } from "@/Data/AssetData";
import { Asset } from "@/Data/defs";
import { NextRequest, NextResponse } from "next/server";

type ExtendetAssetMockData = { parentsId: number[] } & Asset;

// !!!

const exposeChildrenOfAssets = (asset: Asset, sortedData: ExtendetAssetMockData[], parentsId: number[]) => {
  sortedData.push({ ...asset, parentsId: parentsId });

  if (asset.children) {
    if (Array.isArray(asset.children)) {
      asset.children.forEach((data) => {
        const newParentsId = [...parentsId, asset.id];

        exposeChildrenOfAssets(data, sortedData, newParentsId);
      });
    } else {
      exposeChildrenOfAssets(asset.children, sortedData, [...parentsId, asset.id]);
    }
  }
};

const GET = (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id") as string;

  try {
    // Preventing modified original data
    const copiedAssetsMockData = structuredClone(AssetsMockData);

    const sortedData: ExtendetAssetMockData[] = [];

    copiedAssetsMockData.forEach((data) => {
      exposeChildrenOfAssets(data, sortedData, []);
    });

    const foundData = sortedData.find((data) => `${data.id}` === id);

    return NextResponse.json({ status: 200, data: foundData });
  } catch (error) {
    return NextResponse.json({ status: 500, error: `${error}` });
  }
};

export { GET };

const getAssetById = async (id: string): Promise<{ status: number; data: undefined | ExtendetAssetMockData | undefined; error: any }> => {
  return await fetch(new Request(`${process.env.NEXT_PUBLIC_URL}/api/getAssetById/?id=${id}`), {
    cache: "no-cache",
  }).then(async (response) => await response.json());
};

export { getAssetById };
