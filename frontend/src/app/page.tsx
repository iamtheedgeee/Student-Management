import DataInputForm from "@/components/DataInputForm";
import DataImport from "@/components/DataImport";
import DataView from "@/components/DataView"
import Image from "next/image";

export default function Home() {
  return (
    <div>
      Welcome to Data Entry
      <DataInputForm/>
      <DataView/>
    </div>
  );
}
