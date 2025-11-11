"use client"
import DataInputForm from "@/components/DataInputForm";
import DataImport from "@/components/DataImport";
import DataView from "@/components/DataView"
import Image from "next/image";
import { useDataContext } from "@/services/DataContext";
import { useModal } from "@/services/ModalContext";
import {exportToExcel} from "@/services/services"

export default function Home() {
  const {showModal}=useModal()
  const {data}=useDataContext()
  function handleImport(){
      showModal(<DataImport/>)
  }
  function handleExport(){
      exportToExcel(data)
  }
  return (
    <div className="h-screen">
      <div className="flex justify-between p-4 md:p-6">
          <h3 className="font-large text-2xl">Result Management</h3>
          <div className="flex gap-2">
            <button onClick={handleImport}>Import</button>                   
            <button onClick={handleExport} disabled={data.length===0} className={data.length===0?"bg-gray-500 cursor-auto hover:bg-gray-500":""}>Export</button>
          </div>
      </div>
      <div className="flex justify-between p-2 md:p-4 ">
        <DataInputForm/>
        <DataView/>
      </div>
    </div>
  );
}
