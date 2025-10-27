import axios, { AxiosError, AxiosInstance } from "axios"
console.log(process.env.NEXT_PUBLIC_API_BASE_URL)
export const api:AxiosInstance=axios.create({
    baseURL:process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials:true
})
export interface Score{
    student_name:string
    first_assessment:number|''
    second_assessment:number|''
    exam_score:number|''
}
export const postResults=async (results:Score):Promise<Score|undefined>=>{
    try{
        const res= await api.post('/post-result',results)
        const data:Score=res?.data.recieved
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
        throw new Error('Something Went Horribly wrong lol')
    }
}

export const get_data= async()=>{
    try{
        const res= await api.get('/get-results')
        const results:Score[]=res?.data.results
        return results
    } catch(error:unknown){
        console.log(error)
        if(error instanceof AxiosError){
            throw new Error(error.response?.data.error)
        }
        throw new Error('Something Went Horribly wrong lol')
    }
}