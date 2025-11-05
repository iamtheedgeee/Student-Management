"use client";
import { getData, UScore,deleteData } from "@/services/api";
import { useEffect, useState } from "react";
import DataItem from "./DataItem";
import { useDataContext } from "@/services/DataContext";
import { useModal } from "@/services/ModalContext";
import Confirmation from "./Confirmation";
export default function DataView(){
    const {selectedList,setSelectedList,data,loading,error,getResults}=useDataContext()
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
            await deleteData(selectedList)
            getResults()
        }catch(error){
            alert('something went wrong in deleting')
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
        return <div>Loading</div>
    }

    if(error){
        return <div>{error}</div>
    }


    return(
        <>
            {
                data.length>0?
                <div>
                    {selectedList.length>0&&
                        <div>
                            <input type='checkbox' checked={checked} onChange={handleChange}/>
                            <button onClick={handleDelete}>delete</button>
                        </div>
                    }
                    {data.map((item)=>{
                        return <DataItem result={item} key={item.id}/>
                    })}
                </div>
                    :
                <div>No data</div>
        
            }

        </>
    )
}