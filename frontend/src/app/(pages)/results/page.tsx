import { get_data } from "@/services/api";

export default async function response() {
    const results= await get_data()
    console.log(results)
    return (
        <div className="overflow-x-auto">
            {
                results.length>0?
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 text-left text-gray-700 font-semibold border-b">Student Name</th>
                                <th className="py-2 px-4 text-left text-gray-700 font-semibold border-b">First Assessment</th>
                                <th className="py-2 px-4 text-left text-gray-700 font-semibold border-b">Second Assessment</th>
                                <th className="py-2 px-4 text-left text-gray-700 font-semibold border-b">Exam Scores</th>
                            </tr>
                        </thead>
                        <tbody>
                        {results.map((result)=>{
                            return <tr className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b">{result.student_name}</td>
                                        <td className="py-2 px-4 border-b">{result.first_assessment}</td>
                                        <td className="py-2 px-4 border-b">{result.second_assessment}</td>
                                        <td className="py-2 px-4 border-b">{result.exam_score}</td>
                                    </tr>
                        })}
                        </tbody>
                    </table>
                :

                <div>No Results to display</div>
            }
        </div>
    );
}
