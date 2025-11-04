"use client"
import {createContext,useContext,useState,ReactNode} from 'react'
import { UScore,getData } from './api';
interface DataContextType{
    selectedList:string[];
    setSelectedList:React.Dispatch<React.SetStateAction<string[]>>;
    data:UScore[];    
    loading:boolean;
    error:string|null;
    getResults:()=>Promise<void>
}

interface ProviderProps{
    children:ReactNode;
}
const DataContext=createContext<DataContextType|undefined>(undefined)
export const DataProvider=({children}:ProviderProps)=>{
    const [selectedList,setSelectedList]=useState<string[]>([])
    const [data,setData]=useState<UScore[]>([])
    const [loading, setLoading]=useState(true)
    const [error,setError]=useState<string|null>(null)

    async function getResults(){
        try{
            setLoading(true)
            setError(null)
            const results= await getData()
            if(results){
                setData(results)
            }
        }catch(error:unknown){
            setError("something went wrong")
        }finally{
            setLoading(false)
        }
        
    }
    const value={
        selectedList,
        setSelectedList,
        data,
        loading,
        error,
        getResults
    }

    return <DataContext.Provider value={value}>
        {children}
    </DataContext.Provider>
}

export function useDataContext(){
    const context=useContext(DataContext)
    if(!context){
        throw new Error('No conext')
    }

    return context
}