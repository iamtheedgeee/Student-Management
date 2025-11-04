import { deleteData, UScore } from "@/services/api";
import { ChangeEvent, useState } from "react";
import { useDataContext } from "@/services/DataContext";

export default function DataItem({result}:{result:UScore}){
    const {selectedList,setSelectedList,getResults}=useDataContext()
    const selected=selectedList.includes(result.student_name)
    function handleChange(e:React.ChangeEvent<HTMLInputElement>){
        setSelectedList(prev=>
            prev.includes(e.target.value)?
                prev.filter(i=>i!=e.target.value)
            :
                [...prev,e.target.value]
        )
    }
    async function handleDelete(){
        try{
            await deleteData([result.student_name])
            getResults()
        }catch(error){
            alert('something went wrong in deleting')
        }
    }
    return (
        <div>
            <div>{result.id}</div>
            <div>{result.student_name}</div>
            <div>{result.first_assessment}</div>
            <div>{result.second_assessment}</div>
            <div>{result.second_assessment}</div>
            <div>{result.exam_score}</div>
            <div>{result.total}</div>
            <div>{result.grade}</div>
            <div>
                <input type="checkbox" value={result.student_name} checked={selected} onChange={handleChange}/>
            </div>
            <button onClick={handleDelete}>Delete</button>
        </div>
    )
}