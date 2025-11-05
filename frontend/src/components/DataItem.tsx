import { deleteData, UScore } from "@/services/api";
import { ChangeEvent, useState } from "react";
import { useDataContext } from "@/services/DataContext";
import { useModal } from "@/services/ModalContext";
import Confirmation from "./Confirmation";

export default function DataItem({result}:{result:UScore}){
    const {selectedList,setSelectedList,getResults}=useDataContext()
    const {showModal,hideModal}=useModal()
    const selected=selectedList.includes(result.student_name)
    function handleChange(e:React.ChangeEvent<HTMLInputElement>){
        setSelectedList(prev=>
            prev.includes(e.target.value)?
                prev.filter(i=>i!=e.target.value)
            :
                [...prev,e.target.value]
        )
    }
    async function deleteItem(){
        try{
            await deleteData([result.student_name])
            getResults()
        }catch(error){
            alert('something went wrong in deleting')
        }
    }

    function handleDelete(){
        showModal(
            <Confirmation onConfirm={deleteItem} onCancel={hideModal} 
                message="Are you sure you want to delete this Item?"/>
        )
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