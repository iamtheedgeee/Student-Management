interface AlertProps{
    onCancel:()=>any;
    message:string;
}
export default function Alert({onCancel,message}:AlertProps){
   
    return(
        <div>
            <p>{message}</p>
            <div className="flex justify-end gap-2 mt-4">
                <button onClick={onCancel} className="px-3 py-1 border rounded">OK</button>
            </div>
        </div>
    )
}