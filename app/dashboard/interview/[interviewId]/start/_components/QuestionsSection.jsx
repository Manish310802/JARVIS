import { Lightbulb, Volume2 } from 'lucide-react'
import React from 'react'

function QuestionsSection({ mockInterviewQuestion = [], activeQuestionIndex }) {

  
    if (!Array.isArray(mockInterviewQuestion)) {
      console.warn("mockInterviewQuestion is not an array:", mockInterviewQuestion);
      return null; // Prevent rendering if it's not an array
    }

    const textToSpeech = (text) => {
        if('speechSynthesis' in window){
            const speech = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech);
        }
        else{
            alert("Your browser doesn't support text to speech feature. Please use latest version of Chrome or Firefox.");
        }
    }
  
    return (
      <div className=" border  shadow-md bg-white  my-6 space-y-5 max-w-4xl mx-auto  flex flex-col mt-20 justify-center items-center rounded-lg p-5">
        
        {/* Top Row: Question Numbers */}
        <div className="flex flex-wrap gap-3 justify-center overflow-x-auto">
          {mockInterviewQuestion.map((_, index) => (
            <h2
              key={index}
              className={`
                flex items-center justify-center
                w-8 h-8 rounded-full
                text-[10px] md:text-xs
                font-semibold cursor-pointer transition-all select-none
                ${activeQuestionIndex === index 
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-muted '
                }
              `}
            >
              Q{index + 1}
            </h2>
          ))}
        </div>
    
        {/* Current Question */}
        <div className="text-center space-y-4">
          <h2 className="text-base md:text-xl font-semibold text-gray-800">
            {mockInterviewQuestion[activeQuestionIndex]?.question}
          </h2>
    
          {/* Speak Button */}
          <button 
            onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)}
            className="flex items-center gap-2 mx-auto px-4 py-2 bg-primary text-white rounded-full hover:bg-blue-700 transition"
          >
            <Volume2 className="h-5 w-5" /> Listen
          </button>
        </div>
    
        {/* Note Section */}
        <div className="p-5 rounded-2xl border-2 border-blue-300 bg-blue-50 mt-10 shadow-sm space-y-2">
          <h2 className="flex items-center gap-2 text-blue-700 font-semibold">
            <Lightbulb /> Important Note
          </h2>
          <p className="text-sm text-blue-600">
            {process.env.NEXT_PUBLIC_QUESTION_NOTE}
          </p>
        </div>
      </div>
    );
    
    
  }
  

export default QuestionsSection