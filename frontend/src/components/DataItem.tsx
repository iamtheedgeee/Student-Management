import { deleteData, editData, UScore } from "@/services/api";
import { ChangeEvent, useState,useRef,useEffect } from "react";
import { useDataContext } from "@/services/DataContext";
import { useModal } from "@/services/ModalContext";
import Confirmation from "./Confirmation";
function Display({name,data,id}:{name:string,data:string,id:string}){
        const {getResults}=useDataContext()
        const [editing,setEditing]=useState(false)
        const [value,setValue]=useState(data)
        const {showModal,hideModal}=useModal()
        const inputRef=useRef<HTMLInputElement>(null)

        const toggle=()=>setEditing(true)
        function handleChange(e:React.ChangeEvent<HTMLInputElement>){
            setValue(e.target.value)
        }
        function handleBlur(){
            setValue(data)
            setEditing(false)
        }
        async function makeEdit(){
            try{
                await editData({name,data:value,id})
                getResults()
            }catch(error){
                if(error instanceof Error){
                    alert(error.message)
                }
            }
        }
        function handleEnter(){
            showModal(
                <Confirmation message="Are you sure you want to make this change?"
                    onConfirm={makeEdit}
                    onCancel={hideModal}
                />
            )
        }
        useEffect(()=>{
            editing && inputRef?.current?.focus()
        },[editing])
        if(editing){
            return <input className="w-full" value={value} onChange={handleChange} onBlur={handleBlur} ref={inputRef}
                    onKeyDown={(e)=>{
                        if (e.key==="Enter"){
                            handleEnter()
                        }
                    }}
                />
        }
        return(
            <div className="w-full" onClick={toggle}>{data}</div>
        )
}
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
            if(error instanceof Error)
            alert(error.message)
        }
    }

    function handleDelete(){
        showModal(
            <Confirmation onConfirm={deleteItem} onCancel={hideModal} 
                message="Are you sure you want to delete this Item?"/>
        )
    }
    return (
        <div className="flex gap-x-8 border border-black rounded-md justify-start items-center">
            <div className="w-[35px]  text-center">{result.id}</div>
            <div className="w-[20%] text-left border border-blue-200"><Display name="student_name" data={result.student_name} id={result.id}/></div>
            <div className="w-[35px]  text-center border border-blue-200"><Display name="first_assessment" data={result.first_assessment} id={result.id}/></div>
            <div className="w-[35px]  text-center border border-blue-200"><Display name="second_assessment" data={result.second_assessment} id={result.id}/></div>
            <div className="w-[35px]  text-center border border-blue-200"><Display name="exam_score" data={result.exam_score} id={result.id}/></div>
            <div className="w-[35px]  text-center border border-blue-200">{result.total}</div>
            <div className="w-[35px]  text-center border border-blue-200">{result.grade}</div>
            <input type="checkbox" value={result.student_name} checked={selected} onChange={handleChange}/>
            <button onClick={handleDelete}>Delete</button>
        </div>
    )
}