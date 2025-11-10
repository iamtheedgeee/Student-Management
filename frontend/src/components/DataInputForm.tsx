"use client"
import { Formik,Form,Field,ErrorMessage } from "formik"
import * as Yup from 'yup'
import { postResults } from "@/services/api"
import { Score } from "@/services/api"
import { useDataContext } from "@/services/DataContext"
import { useModal } from "@/services/ModalContext"
import DataImport from "./DataImport"

const ScoreSchema=Yup.object().shape({
    student_name:Yup.string()
        .max(30,"Name must not be more than 30 characters")
        .required("Student Name is required"),
    first_assessment:Yup.number()
        .typeError("Numeric Input Only")
        .max(15,"Number must be less than 15")
        .min(0,"Number must be greater than 0")
        .required("First assessment is requried"),
    second_assessment:Yup.number()
        .typeError("Numeric Input Only")
        .max(15,"Number must be less than 15")
        .min(0,"Number must be greater than 0")
        .required("Second assessment is requried"),
    exam_score:Yup.number()
        .typeError("Numeric Input Only")
        .max(70,"Number must be less than 70")
        .min(0,"Number must be greater than 0")
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
        <div className="flex flex-col justify-center items-center border rounded-sm border-black p-[5px] gap-y-<5>">
            <h4 className="text-center border border-black rounded-sm">Input Student Data</h4>
            <Formik
                initialValues={initialValues}
                validationSchema={ScoreSchema}
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
                {({isSubmitting,errors,status})=>(
                        <Form className='flex flex-col items-center border-yellow'>
                            <Field type='text' name='student_name' placeholder='Student Name'/>
                            <ErrorMessage name='student_name'/>

                            <Field type='number' name='first_assessment' placeholder='First Assessment'/>
                            <ErrorMessage name='first_assessment'/>

                            <Field type='number' name='second_assessment' placeholder='Second Assessment'/>
                            <ErrorMessage name='second_assessment'/>

                            <Field type='number' name='exam_score' placeholder='Exam Score'/>
                            <ErrorMessage name='exam_score'/>

                            <button type='submit' disabled={isSubmitting}>{isSubmitting?'submiting....':'Submit'}</button>
                            {status&& <span>{status}</span>}
                        </Form>
                )}
            </Formik>

        </div>
    )
}
