'use client'
import { ReactEventHandler, useState } from 'react'
import { sendFileForImport } from '@/services/api'
export default function DataImport(){
    const [file,setFile]=useState<File | null>(null)
    const [loading,setLoading]=useState(false)

    function handleFile(e:React.ChangeEvent<HTMLInputElement>){
        setFile(e.target.files?.[0]||null)
    }

    async function handleSubmit(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        setLoading(true)
        if(!file){
            alert("Please select a file")
            return
        }
        const formData= new FormData()
        formData.append("spreadSheetFile",file)
        try{
            const count=await sendFileForImport(formData)
            if(count){
                setLoading(false)
                alert(`Successfully imported ${count} transactions`)
            }
        } catch(error){
            setLoading(false)
            if(error instanceof Error){
                alert(error.message)
            }else{
                alert('Something Went Wrong')
            }
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