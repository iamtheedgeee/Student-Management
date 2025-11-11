"use client";
import { getData, UScore,deleteData } from "@/services/api";
import { useEffect, useState } from "react";
import DataItem from "./DataItem";
import { useDataContext } from "@/services/DataContext";
import { useModal } from "@/services/ModalContext";
import Confirmation from "./Confirmation";
import DataChart from "./DataChart";
export default function DataView(){
    const {selectedList,setSelectedList,data,loading,setLoading,error,getResults}=useDataContext()
    const [mode,setMode]=useState("T")
    const {showModal,hideModal}=useModal()
    const checked=data.length===selectedList.length
    function handleChange(e:React.ChangeEvent<HTMLInputElement>){
        setSelectedList(prev=>
            data.length===prev.length
            ?[]
            :data.map((result)=>{
                return result.student_name
            })
        )
    }
    async function deleteItems(){
        try{
            setLoading(true)
            await deleteData(selectedList)
            getResults()
        }catch(error){
            if(error instanceof Error)
            alert(error.message)
        }finally{
            setSelectedList([])
            setLoading(false)
        }
    }

    function handleDelete(){
        showModal(
            <Confirmation message={`Are you sure you want to delete ${selectedList.length} Items`}
                onConfirm={deleteItems}
                onCancel={hideModal}
            />
            )
    }
    useEffect(()=>{
        getResults()
    },[])
    if(loading){
       /*if(data.length===0)*/return <div className="h-[400px] w-[400px] flex display-flex justify-center items-center font-medium text-lg border border-black">Loading....</div>
    }

    if(error){
        return <div className="h-[400px] w-[400px] flex display-flex justify-center items-center font-medium text-lg border border-black text-red-700">{error}</div>
    }

    if(data.length>0){
        return(
        <div>
            <div className="border border-blue-300 flex gap-10 justify-between rounded-sm w-fit m-auto p-1">
                <div className=" border-black">Table:<input type="checkbox" checked={mode==="T"} onChange={
                    ()=>{
                        setMode("T")
                    }
                }/></div>
                <div className=" border-black">Chart:<input type="checkbox" checked={mode==="C"} onChange={
                    ()=>{
                        setMode("C")
                    }
                }/></div>
            </div>
            {
            mode==="T"
            ?<div className="flex flex-col gap-y-3 ">
                {selectedList.length>0&&
                    <div className="flex gap-x-8 border border-red-400 rounded-md justify-center items- w-fit m-auto p-[5px]">
                        <input type='checkbox' checked={checked} onChange={handleChange}/>
                        <button onClick={handleDelete}>Delete  {selectedList.length}</button>
                    </div>
                }
                <div className="max-h-[400px] overflow-auto">
                <div className="flex gap-x-8 border border-black rounded-md justify-start items-center">
                    <div className="w-[35px]  text-center">S/N</div>
                    <div className="w-[20%] text-left border">Student Name</div>
                    <div className="w-[35px]  text-center border">CA</div>
                    <div className="w-[35px]  text-center border">CA</div>
                    <div className="w-[35px]  text-center border">Exams</div>
                    <div className="w-[35px]  text-center border">Total</div>
                    <div className="w-[35px]  text-center border">Grade</div>
                </div>
                {data.map((item)=>{
                    return <DataItem result={item} key={item.id}/>
                })}
                </div>
            </div>
            :<DataChart results={data}/>
            }
        </div>      
        )
    }else{
        return <div className="h-[400px] w-[400px] flex display-flex justify-center items-center font-medium text-lg border border-black">No data</div>
    }

}