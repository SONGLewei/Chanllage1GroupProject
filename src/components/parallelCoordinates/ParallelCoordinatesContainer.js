import './ParallelCoordinates.css';
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ParallelCoordinatesD3 from './ParallelCoordinates-d3';

function ParallelCoordinatesContainer() {
    const visData = useSelector(state => state.dataSet); 
    const dispatch = useDispatch();

    const divContainerRef = useRef(null);
    const visD3Ref = useRef(null);

    const getChartSize = function(){
        let width = 800;
        let height = 500;
        if(divContainerRef.current !== undefined && divContainerRef.current.offsetWidth > 0){
            width = divContainerRef.current.offsetWidth;
            height = divContainerRef.current.offsetHeight;
        }
        return {width: width, height: height};
    }

    useEffect(() => {
        const visD3 = new ParallelCoordinatesD3(divContainerRef.current);
        visD3.create({size: getChartSize()});
        visD3Ref.current = visD3;
        return () => {
            visD3.clear();
        }
    }, []);

    useEffect(() => {
        if(visData && visData.length > 0) {
            const visD3 = visD3Ref.current;
            visD3.renderVis(visData);
        }
    }, [visData, dispatch]); 

    return(
        <div ref={divContainerRef} className="parallelContainer" style={{ width: '100%', height: '600px' }}>
        </div>
    )
}

export default ParallelCoordinatesContainer;