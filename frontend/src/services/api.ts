import axios, { AxiosError, AxiosInstance } from "axios"
console.log(process.env.NEXT_PUBLIC_API_BASE_URL)
export const api:AxiosInstance=axios.create({
    baseURL:process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
    "Cache-Control": "no-store",
    },
    withCredentials:true
})
export interface Score{
    student_name:string;
    first_assessment:string;
    second_assessment:string;
    exam_score:string;
}

export interface UScore extends Score{
    id:string;
    total:number;
    grade:string;
}
export const postResults=async (results:Score):Promise<UScore|undefined>=>{
    try{
        const res= await api.post('/post-result',results)
        const data:UScore=res?.data.recieved
        return data
    } catch(error:unknown){
        console.log(error)
        if(error instanceof AxiosError){
            if(error.response?.status===500){
                throw new Error('Could not add Score')
            }        
        }
        throw new Error("Something Went Horribly Wrong lol")
    }
}

export const sendFileForImport= async(file:FormData)=>{
    try{
        const res= await api.post('/import-result',file)
        const count:number=res?.data.msg
        return count
    } catch(error:unknown){
        console.log(error)
        if(error instanceof AxiosError){
            throw new Error(error.response?.data.error)
        }
        throw new Error('Something Went wrong')
    }
}

export const getData= async()=>{
    try{
        const res= await api.get('/get-results')
        if(res.status===200){
            const results:UScore[]=res?.data.results
            return results
        }
       
    } catch(error:unknown){
        console.log(error)
        if(error instanceof AxiosError){
            throw new Error(error.response?.data.error)
        }
        throw new Error('Something Went wrong')
    }
}

export const editData=async()=>{
    return
}

export const deleteData=async(selected:string[])=>{
    try{
        const res= await api.delete('/delete-result',{data:{selected}})
        if(res.status===200){
            return
        }
    } catch(error:unknown){
        console.log(error)
        throw new Error('something went wrong')
    }
}