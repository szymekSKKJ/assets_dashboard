"use server";

import { Title } from "@/components/ui/Title";
import { getAssetById } from "@/app/api/getAssetById/route";
import { deleteAssetById } from "@/app/api/deleteAssetById/route";
import Test from "../../_components/Test/Test";

export default async function Details({ params: { id } }: { params: { id: string } }) {
  // Ze względu na to, że jesteśmy na nowej stronie, nie musimy używać contextu z danymi, tylko pobierami dane z API. Właściwie to na każdej nowej stronie tak powinno być
  const { error, data } = await getAssetById(id);

  const dataAfterRemove = await deleteAssetById(id);

  if (error === undefined && data) {
    return (
      <section className="text-text-light">
        <Test data={dataAfterRemove}></Test>
        <div className="container mx-auto">
          <Title title="Details" />
          Detale
          {Object.keys(data).map((key, index) => {
            if (key === "attributes") {
              return (
                <>
                  {data["attributes"]!.map((data) => {
                    const { key, value } = data;

                    return <p key={key}>{`key: ${key}, value: ${value}`}</p>;
                  })}
                </>
              );
            } else {
              return <p key={index}>{`${key}: ${data[key as keyof typeof data]}`}</p>;
            }
          })}
        </div>
      </section>
    );
  }
}
