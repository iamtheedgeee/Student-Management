"use client"
import { Formik,Form,Field,ErrorMessage, FormikHelpers } from "formik"
import * as Yup from 'yup'
import { postResults } from "@/services/api"
import { Score } from "@/services/api"
import { useDataContext } from "@/services/DataContext"
import { useModal } from "@/services/ModalContext"
import React from "react"
import DataImport from "./DataImport"

const ScoreSchema=Yup.object().shape({
    student_name:Yup.string()
        .max(25,"Name must not be more than 25 characters")
        .required("Student Name is required"),
    first_assessment:Yup.number()
        .typeError("Numeric Input Only")
        .max(15,"CA must be less than 15")
        .min(0,"CA must be greater than 0")
        .required("First assessment is requried"),
    second_assessment:Yup.number()
        .typeError("Numeric Input Only")
        .max(15,"CA must be less than 15")
        .min(0,"CA must be greater than 0")
        .required("Second assessment is requried"),
    exam_score:Yup.number()
        .typeError("Numeric Input Only")
        .max(70,"Exam must be less than 70")
        .min(0,"Exam must be greater than 0")
        .required("Exam Score is requried")
    
})
const initialValues:Score={
    student_name:'',
    first_assessment:'',
    second_assessment:'',
    exam_score:''
}


export default function DataInputForm(){
    const {getResults}=useDataContext()
    const {showModal}=useModal()
    function handleImport(){
        showModal(<DataImport/>)
    }
    return(
        <div className="flex flex-col justify-center items-center border rounded-sm border-black p-[5px] gap-y-<5> h-fit">
            <div className="font-medium text-lg">Input Student Data</div>
            <Formik
                initialValues={initialValues}
                validationSchema={ScoreSchema}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={async(values,{setSubmitting,setStatus})=>{
                    setStatus('')
                    try{
                        const data=await postResults(values)
                        setStatus('success')
                        getResults()
                    } catch(error){
                        if(error instanceof Error){
                            setStatus(error.message)
                        }
                    } finally{
                        setSubmitting(false)
                    }
                }}
            >
                {({isSubmitting,status,errors,setStatus})=>{
                    React.useEffect(() => {
                        const firstError = Object.values(errors)[0] as string | undefined;
                        if (firstError) setStatus(firstError);
                        }, [errors, setStatus]);
                    return(
                        <Form className='flex flex-col items-center gap-3'>
                            <Field type='text' name='student_name' placeholder='Student Name'/>

                            <Field type='number' name='first_assessment' placeholder='First Assessment'/>

                            <Field type='number' name='second_assessment' placeholder='Second Assessment'/>

                            <Field type='number' name='exam_score' placeholder='Exam Score'/>

                            <button type='submit' disabled={isSubmitting}>{isSubmitting?'submiting....':'Submit'}</button>
                            {status&& <span className={status==="success"?"text-green-500":"text-red-500"}>{status}</span>}
                        </Form>
                )}}
            </Formik>

        </div>
    )
}
