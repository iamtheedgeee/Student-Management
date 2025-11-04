import { UScore } from "@/services/api";

export default async function response() {
    let results:UScore[];
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/get-results`, { cache: "no-store" });
    if(res.status===200){
        const data= await res.json();
        results=data.results
    }else{
        const {error}= await res.json()
        throw new Error(error)
    }

    return (
        <>
        <div className="heading-primary">Results</div>
        <div className="overflow-x-auto">
            {
                results?.length>0? 
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 text-left text-gray-700 font-semibold border-b">S/N</th>
                                <th className="py-2 px-4 text-left text-gray-700 font-semibold border-b">Student Name</th>
                                <th className="py-2 px-4 text-left text-gray-700 font-semibold border-b">First Assessment</th>
                                <th className="py-2 px-4 text-left text-gray-700 font-semibold border-b">Second Assessment</th>
                                <th className="py-2 px-4 text-left text-gray-700 font-semibold border-b">Exam Scores</th>
                                <th className="py-2 px-4 text-left text-gray-700 font-semibold border-b">Total</th>
                                <th className="py-2 px-4 text-left text-gray-700 font-semibold border-b">Grade</th>

                            </tr>
                        </thead>
                        <tbody>
                        {results.map((result)=>{
                            return <tr className="hover:bg-gray-50" key={result.id}>
                                        <td className="py-2 px-4 border-b">{result.id}</td>
                                        <td className="py-2 px-4 border-b">{result.student_name}</td>
                                        <td className="py-2 px-4 border-b">{result.first_assessment}</td>
                                        <td className="py-2 px-4 border-b">{result.second_assessment}</td>
                                        <td className="py-2 px-4 border-b">{result.exam_score}</td>
                                        <td className="py-2 px-4 border-b">{result.total}</td>
                                        <td className="py-2 px-4 border-b">{result.grade}</td>
                                    </tr>
                        })}
                        </tbody>
                    </table>
                :

                <div>No Results to display</div>
            }
        </div>
        </>
    );
}
