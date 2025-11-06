import axios, { AxiosError, AxiosInstance } from "axios"

export const api:AxiosInstance=axios.create({
    baseURL:process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
    "Cache-Control": "no-store",
    },
    withCredentials:true
})

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response) {
      const message=(error.response.data as any).error.message ||"An error occurred on the server."
      throw new Error(message)
    }
    throw new Error("Network error. Please try again.")
  }
)


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


export const postResults=async (results:Score):Promise<UScore>=>{
    const res= await api.post('/post-result',results)
    const data:UScore=res?.data.data.recieved
    return data
}

export const sendFileForImport= async(file:FormData)=>{
    const res= await api.post('/import-result',file)
    const count:number=res?.data.data.count
    return count
   
}

export const getData= async()=>{
    const res= await api.get('/get-results')
    const results:UScore[]=res?.data.data.results
    return results
       
   
}

export const editData=async(payload:{name:string,data:string,id:string})=>{
    const res= await api.patch(`/edit-result/${payload.id}`,payload)
}

export const deleteData=async(selected:string[])=>{
    const res= await api.delete('/delete-result',{data:{selected}})
}