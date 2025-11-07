"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"
import {UScore} from "@/services/api"
export default function DataChart({results}:{results:UScore[]}){
    const data=results.map((result)=>{
        const {grade,...needed}=result
        return{
            ...needed,
            first_assessment:Math.max((Number(needed.first_assessment)/15)*100,1),
            second_assessment:Math.max((Number(needed.second_assessment)/15)*100,1),
            exam_score:Math.max((Number(needed.exam_score)/70)*100,1),
            total:Math.max((Number(needed.total)),1)
        }
    })
    const barHeight = 100
    const chartHeight = data.length * barHeight + 100
    return (
        <div style={{ width: "100%", height: "400px", overflowY: "auto" }}>
            <BarChart
                layout="vertical"
                width={800}
                height={chartHeight}
                data={data}
                margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="student_name" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="first_assessment" fill="#8884d8" name="1st CA" />
                <Bar dataKey="second_assessment" fill="#82ca9d" name="2nd CA" />
                <Bar dataKey="exam_score" fill="#ffc658" name="Exam" />
                <Bar dataKey="total" fill="#ff7300" name="Total" />
            </BarChart>
        </div>   
    )
}