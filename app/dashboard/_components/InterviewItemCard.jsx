import { Button } from '@/components/ui/button'
import React from 'react'
import { useRouter } from 'next/navigation'

function InterviewItemCard({interview}) {

    const router=useRouter();

    const onStart=()=>{
        router.push(`/dashboard/interview/${interview.mockId}`)
    }

    const onFeedbackPress=()=>{
       router.push(`/dashboard/interview/${interview.mockId}/feedback`)
    }

  return (
    <div className='border shadow-sm rounded-lg p-3'>
                      <div className="text-center space-y-2">

         <h2 className='font-bold text-primary'>{interview?.jobPosition}</h2>
         </div>
         <div className="text-center space-y-2">

         <h2 className='text-sm text-gray-600'>{interview?.jobExperience} Years of Experince</h2>
         </div>

         <div className="text-center space-y-2">

         <h2 className='text-xs text-gray-400'>Created At:{interview.createdAt}</h2>
         </div>

         <div className="flex justify-center mt-2 gap-5">
            <Button size="sm"  className="px-4 py-2  text-sm " onClick={onFeedbackPress}>View Feedback</Button>
         </div>
    </div>
  )
}

export default InterviewItemCard