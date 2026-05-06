import React, { useState, useEffect } from 'react';

const Controller = () => {
  // --- States ---
  const [directions, setDirections] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });
  const backUrl="blabla.com"

  const [pickRelease, setPickRelease] = useState(false);
  const [moveContinuousBack, setMoveContinuousBack] = useState(false);
  const [moveContinuous, setMoveContinuous] = useState(false);
  const [armMode, setArmMode] = useState(false);

  const [gripperSpeed, setGripperSpeed] = useState(50);
  const [speed, setSpeed] = useState(50);

  // --- Mutually Exclusive Toggle Logic ---
  const handleContinuousToggle = () => {
    setMoveContinuous((prev) => {
      if (!prev) setMoveContinuousBack(false); // Turn off the other
      return !prev;
    });
  };

  const handleContinuousBackToggle = () => {
    setMoveContinuousBack((prev) => {
      if (!prev) setMoveContinuous(false); // Turn off the other
      return !prev;
    });
  };

  // --- Fetch / Data Handling ---
  useEffect(() => {
    const payload = {
      left: directions.left,
      right: directions.right,
      forward: directions.forward,
      backward: directions.backward,
      pick_release: pickRelease,
      move_continuous_back: moveContinuousBack,
      move_continuous: moveContinuous,
      gripper_speed: parseInt(gripperSpeed),
      speed: parseInt(speed),
      arm_mode: armMode,
    };
    fetch(`${backUrl}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)).then((res)=>res.json()).then((data)=>console.log(data)).catch((err)=>console.log("Error in sending the data:",err))

    console.log('Sending payload:', payload);
  }, [directions, pickRelease, moveContinuousBack, moveContinuous, gripperSpeed, speed, armMode]);

  // --- Handlers ---
  const handleDirectionDown = (dir) => setDirections((prev) => ({ ...prev, [dir]: true }));
  const handleDirectionUp = (dir) => setDirections((prev) => ({ ...prev, [dir]: false }));

  return (
    // h-screen ensures it perfectly fits the visible screen without scrolling
    <div className="h-screen w-full bg-[#c4c4c4] flex flex-col relative overflow-hidden font-sans select-none p-2 sm:p-4">
      
      {/* Top Header Row (Optimized for small screens) */}
      <div className="flex justify-between items-start w-full z-10 mb-2">
        {/* Continuous Buttons */}
        <div className="flex space-x-2 sm:space-x-6">
          <button 
            onClick={handleContinuousBackToggle}
            className={`px-3 py-2 sm:px-6 sm:py-3 border-2 sm:border-4 border-black rounded-xl sm:rounded-2xl text-xs sm:text-base font-bold transition-colors ${moveContinuousBack ? 'bg-blue-600 text-white' : 'bg-[#7ba4db] text-black'}`}
          >
            Move Continuous<br/>Back
          </button>
          <button 
            onClick={handleContinuousToggle}
            className={`px-3 py-2 sm:px-6 sm:py-3 border-2 sm:border-4 border-black rounded-xl sm:rounded-2xl text-xs sm:text-base font-bold transition-colors ${moveContinuous ? 'bg-blue-600 text-white' : 'bg-[#7ba4db] text-black'}`}
          >
            Move Continuous
          </button>
        </div>

        {/* Arm Mode Toggle */}
        <div className="flex items-center space-x-2">
          <span className="font-bold text-gray-800 text-xs sm:text-base">Arm Mode</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={armMode} 
              onChange={() => setArmMode(!armMode)} 
            />
            <div className="w-10 h-5 sm:w-14 sm:h-7 bg-gray-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-6 sm:after:w-6 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>
      </div>

      {/* Main Control Area (Sliders and D-Pad) */}
      <div className="flex-1 flex items-center justify-between px-2 sm:px-8 w-full h-full">
        
        {/* Left Slider (Gripper Speed) */}
        <div className="flex flex-col items-center w-16 sm:w-24">
          <div className="h-32 sm:h-48 flex items-center justify-center relative">
            <div className="absolute top-0 w-16 sm:w-20 h-4 sm:h-6 bg-[#8b0000]"></div>
            <input 
              type="range" 
              min="0" max="100" 
              value={gripperSpeed}
              onChange={(e) => setGripperSpeed(e.target.value)}
              className="w-28 sm:w-40 h-3 sm:h-4 bg-gray-300 rounded-lg appearance-none cursor-pointer -rotate-90 z-10"
              style={{ accentColor: '#8b0000' }}
            />
          </div>
          <span className="mt-4 sm:mt-6 font-bold text-[10px] sm:text-sm text-center leading-tight">Gripper Speed<br/>Controller</span>
        </div>

        {/* Center D-Pad (Using CSS Grid for perfect scaling) */}
        <div className="grid grid-cols-3 grid-rows-3 gap-0 w-48 h-48 sm:w-72 sm:h-72">
          {/* Top Row */}
          <div></div>
          <button 
            onMouseDown={() => handleDirectionDown('forward')} onMouseUp={() => handleDirectionUp('forward')} onMouseLeave={() => handleDirectionUp('forward')}
            onTouchStart={() => handleDirectionDown('forward')} onTouchEnd={() => handleDirectionUp('forward')}
            className={`w-full h-full flex items-end justify-center pb-2 sm:pb-4 font-bold text-[10px] sm:text-sm text-black transition-colors ${directions.forward ? 'bg-gray-600' : 'bg-[#808080]'}`}
            style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', borderBottom: '2px solid black' }}
          >
            Forward
          </button>
          <div></div>

          {/* Middle Row */}
          <button 
            onMouseDown={() => handleDirectionDown('left')} onMouseUp={() => handleDirectionUp('left')} onMouseLeave={() => handleDirectionUp('left')}
            onTouchStart={() => handleDirectionDown('left')} onTouchEnd={() => handleDirectionUp('left')}
            className={`w-full h-full flex items-center justify-end pr-2 sm:pr-4 font-bold text-[10px] sm:text-sm text-black transition-colors ${directions.left ? 'bg-gray-600' : 'bg-[#808080]'}`}
            style={{ clipPath: 'polygon(0% 50%, 100% 0%, 100% 100%)' }}
          >
            Left
          </button>
          <div className="flex items-center justify-center scale-125 sm:scale-150 z-20">
            <button 
              onClick={() => setPickRelease(!pickRelease)}
              className={`w-full h-full rounded-[50%] border-2 sm:border-4 border-black font-bold text-[8px] sm:text-[10px] text-black shadow-lg transition-colors ${pickRelease ? 'bg-pink-500' : 'bg-[#ffb6c1]'}`}
            >
              Pick /<br/>Release
            </button>
          </div>
          <button 
            onMouseDown={() => handleDirectionDown('right')} onMouseUp={() => handleDirectionUp('right')} onMouseLeave={() => handleDirectionUp('right')}
            onTouchStart={() => handleDirectionDown('right')} onTouchEnd={() => handleDirectionUp('right')}
            className={`w-full h-full flex items-center justify-start pl-2 sm:pl-4 font-bold text-[10px] sm:text-sm text-black transition-colors ${directions.right ? 'bg-gray-600' : 'bg-[#808080]'}`}
            style={{ clipPath: 'polygon(100% 50%, 0% 0%, 0% 100%)' }}
          >
            Right
          </button>

          {/* Bottom Row */}
          <div></div>
          <button 
            onMouseDown={() => handleDirectionDown('backward')} onMouseUp={() => handleDirectionUp('backward')} onMouseLeave={() => handleDirectionUp('backward')}
            onTouchStart={() => handleDirectionDown('backward')} onTouchEnd={() => handleDirectionUp('backward')}
            className={`w-full h-full flex items-start justify-center pt-2 sm:pt-4 font-bold text-[10px] sm:text-sm text-black transition-colors ${directions.backward ? 'bg-gray-600' : 'bg-[#808080]'}`}
            style={{ clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }}
          >
            Backward
          </button>
          <div></div>
        </div>

        {/* Right Slider (Speed Controller) */}
        <div className="flex flex-col items-center w-16 sm:w-24">
          <div className="h-32 sm:h-48 flex items-center justify-center relative">
            <div className="absolute top-0 w-16 sm:w-20 h-4 sm:h-6 bg-[#159f3d]"></div>
            <input 
              type="range" 
              min="0" max="100" 
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
              className="w-28 sm:w-40 h-3 sm:h-4 bg-gray-300 rounded-lg appearance-none cursor-pointer -rotate-90 z-10"
              style={{ accentColor: '#159f3d' }}
            />
          </div>
          <span className="mt-4 sm:mt-6 font-bold text-[10px] sm:text-sm text-center leading-tight">Speed Controller</span>
        </div>

      </div>
    </div>
  );
};

export default Controller;
