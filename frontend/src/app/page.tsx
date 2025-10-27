import DataInputForm from "@/components/DataInputForm";
import DataImport from "@/components/DataImport";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      Welcome to Data Entry
      <DataInputForm/>
      <DataImport/>
    </div>
  );
}
