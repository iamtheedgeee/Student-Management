import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { UScore } from "./api";

export function exportToExcel(data:UScore[], filename = "data.xlsx") {
    const ordered_sheet_data=data.map(({id,student_name,first_assessment,second_assessment,exam_score,total,grade})=>{
        return {id,student_name,first_assessment,second_assessment,exam_score,total,grade}}
    )
    const ws = XLSX.utils.json_to_sheet(ordered_sheet_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, filename);
}
