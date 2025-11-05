"use client"
import {createContext,useState,useContext, ReactNode} from 'react'

interface ModalContextType{
    showModal:(content:ReactNode)=>void;
    hideModal:()=>void

}
const ModalContext=createContext<ModalContextType|undefined>(undefined)

export function ModalProvider({children}:{children:ReactNode}){
    const [modal,setModal]=useState<ReactNode|null>(null)
    function showModal(content:ReactNode){
        setModal(content)
    }
    function hideModal(){
        setModal(null)
    }
    const value={
        showModal,
        hideModal
    }
    return(
        <ModalContext.Provider value={value}>
            {children}
            {modal&&
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50" onClick={hideModal}>
                <div className="bg-white p-6 rounded-xl shadow-lg min-w-[300px]" onClick={(e)=>{e.stopPropagation()}}>
                    {modal}
                </div>
                </div>
            }
        </ModalContext.Provider>

    )
}

export function useModal(){
    const context=useContext(ModalContext)
    if(!context)throw new Error("No context created")
    return context
}