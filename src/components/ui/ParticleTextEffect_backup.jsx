import React from "react";

export default function ParticleTextEffect() {
  return (
    <div 
      className="w-screen h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900"
      style={{
        width: '100vw',
        height: '100vh',
        minWidth: '100vw',
        minHeight: '100vh',
        maxWidth: '100vw',
        maxHeight: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        overflow: 'hidden'
      }}
    >
      {/* Simple full screen div with no particle text effects */}
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="text-center max-w-4xl">
          <h1 className="text-8xl font-bold text-white mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            NO PARTICLES
          </h1>
          <p className="text-2xl text-gray-300">
            Clean full screen display without any text particle effects
          </p>
        </div>
      </div>
    </div>
  );
}