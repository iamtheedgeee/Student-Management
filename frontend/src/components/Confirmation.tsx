interface ConfirmationProps{
    onConfirm:()=>any;
    onCancel:()=>any;
    message:string;
}
export default function Confirmation({onConfirm,onCancel,message}:ConfirmationProps){
    function handleConfirm(){
            onConfirm()
            onCancel()
    }
    return(
        <div>
            <p>{message}</p>
            <div className="flex justify-end gap-2 mt-4">
                <button onClick={onCancel} className="px-3 py-1 border rounded">Cancel</button>
                <button onClick={handleConfirm} className="px-3 py-1 bg-blue-600 text-white rounded">Confirm</button>
            </div>
        </div>
    )
}