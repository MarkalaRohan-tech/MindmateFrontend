import React from 'react'
import MoodChart from './MoodChart'

const MoodTrendChart = ({ title }) => (
  <div className="w-[100%] h-fit md:flex-1 flex flex-col border-3 border-orange-400 p-5 rounded-2xl justify-center items-center">
    <h1 className="text-xl font-bold">{title}</h1>
    <p className="my-5">
      Your {title.toLowerCase()} average over the past week.
    </p>
    <MoodChart />
  </div>
);


export default MoodTrendChart