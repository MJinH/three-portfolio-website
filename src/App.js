import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import House from './House';
import Main from './Main';
import ThreeGallery from './ThreeGallery';

function App() {

  const { page } = useSelector(state => state.page)

  const setPage = () => {
    if (page === 1) {
      return (
      <Main />
      )
    } 
    if (page === 2) {
      return (
      <ThreeGallery />
      )
    }
    if (page === 3) {
      return (
        <House />
      )
    }
  }

  return (
    <Suspense fallback={null}>
      {/* <div className="hi">
        <button>Hi</button>
      </div> */}
      {setPage()}

      {/* <Canvas shadows>
      </Canvas> */}
    </Suspense>
  );
}


export default App;