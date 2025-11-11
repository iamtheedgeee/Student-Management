'use client'
import { ReactEventHandler, useState } from 'react'
import {  sendFileForImport } from '@/services/api'
import { useDataContext } from '@/services/DataContext'
export default function DataImport(){
    const [file,setFile]=useState<File | null>(null)
    const [loading,setLoading]=useState(false)
    const {getResults}=useDataContext()


    function handleFile(e:React.ChangeEvent<HTMLInputElement>){
        setFile(e.target.files?.[0]||null)
    }

    async function handleSubmit(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        if(!file){
            alert("Please select a file")
            return
        }
        const formData= new FormData()
        formData.append("spreadSheetFile",file)
        try{
            setLoading(true)
            const count=await sendFileForImport(formData)
            getResults()
            alert(`Successfully imported ${count} transactions`)
        } catch(error){
            if(error instanceof Error){
                alert(error.message)
            }
        } finally{
            setLoading(false)
        }


    }
    return (
            <div>
                <div>Upload a Spreadsheet file</div>
                {!loading?
                    <form onSubmit={handleSubmit} className="flex flex-col gap-y-5 border border-blue-400 p-[5px]">
                        <input
                            id='file'
                            type='file'
                            accept='.xls, .xlsx, .csv'
                            onChange={handleFile}    
                        />
                        <button type="submit">Submit</button>
                    </form>
                :
                    <div>
                        Importing......
                    </div>
                }
            </div>
    )
}