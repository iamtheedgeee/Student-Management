"use client";
import { getData, UScore,deleteData } from "@/services/api";
import { useEffect, useState } from "react";
import DataItem from "./DataItem";
import { useDataContext } from "@/services/DataContext";
export default function DataView(){
    const {selectedList,setSelectedList,data,loading,error,getResults}=useDataContext()
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
    async function handleDelete(){
        try{
            await deleteData(selectedList)
            getResults()
        }catch(error){
            alert('something went wrong in deleting')
        }
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