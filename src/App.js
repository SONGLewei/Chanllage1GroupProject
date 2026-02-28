import './App.css';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getDataSet } from './redux/DataSetSlice';
import ParallelCoordinatesContainer from './components/parallelCoordinates/ParallelCoordinatesContainer';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(getDataSet()); 
  }, [dispatch]); 

  return (
    <div className="App">
        <div id={"MultiviewContainer"} className={"row"}>
            <ParallelCoordinatesContainer />
        </div>
    </div>
  );
}

export default App;