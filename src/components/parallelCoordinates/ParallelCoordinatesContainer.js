import './ParallelCoordinates.css';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import ParallelCoordinatesD3 from './ParallelCoordinates-d3';

function ParallelCoordinatesContainer() {
    const visData = useSelector(state => state.dataSet); 
    //const dispatch = useDispatch();

    const divContainerRef = useRef(null);
    const visD3Ref = useRef(null);

    const [ageMin, setAgeMin] = useState(18);
    const [ageMax, setAgeMax] = useState(80);
    const [education, setEducation] = useState('All');
    const [haveKids, setHaveKids] = useState('All');
    const [householdSize, setHouseholdSize] = useState('All');

    const getChartSize = function(){
        let width = 800; 
        let height = 600; 
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
            const filteredData = visData.filter(item => {
                if (item.age < ageMin || item.age > ageMax) return false;
                if (education !== 'All' && item.educationLevel !== education) return false;
                
                if (haveKids !== 'All') {
                    const hasKidsBool = haveKids === 'Yes'; 
                    if (item.haveKids !== hasKidsBool) return false;
                }
                
                if (householdSize !== 'All' && String(item.householdSize) !== String(householdSize)) return false;
                return true; 
            });

            const visD3 = visD3Ref.current;
            visD3.renderVis(filteredData, visData);
        }
    }, [visData, ageMin, ageMax, education, haveKids, householdSize]); 

    const labelStyle = { display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555', fontWeight: '500' };
    const inputStyle = { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' };

    return(
        <div className="parallel-wrapper" style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '85vh', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
            
            <div ref={divContainerRef} className="parallelContainer" style={{ flex: 1, height: '100%' }}>
            </div>
            
            <div className="filters-panel" style={{ 
                width: '300px',
                padding: '20px', 
                backgroundColor: '#f1f3f5',
                borderLeft: '1px solid #ddd',
                display: 'flex', 
                flexDirection: 'column', 
                gap: '20px',
                overflowY: 'auto'
            }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
                    Filtres
                </h3>
                
                <div>
                    <label style={labelStyle}>Âge: </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input type="number" value={ageMin} onChange={e => setAgeMin(Number(e.target.value))} style={inputStyle}/>
                        <span style={{color: '#888'}}>-</span>
                        <input type="number" value={ageMax} onChange={e => setAgeMax(Number(e.target.value))} style={inputStyle}/>
                    </div>
                </div>

                <div>
                    <label style={labelStyle}>Niveau d'étude: </label>
                    <select value={education} onChange={e => setEducation(e.target.value)} style={inputStyle}>
                        <option value="All">Tous</option>
                        <option value="Low">Low</option>
                        <option value="HighSchoolOrCollege">HighSchoolOrCollege</option>
                        <option value="Bachelors">Bachelors</option>
                        <option value="Graduate">Graduate</option>
                    </select>
                </div>

                <div>
                    <label style={labelStyle}>Enfants: </label>
                    <select value={haveKids} onChange={e => setHaveKids(e.target.value)} style={inputStyle}>
                        <option value="All">Tous</option>
                        <option value="Yes">Oui</option>
                        <option value="No">Non</option>
                    </select>
                </div>

                <div>
                    <label style={labelStyle}>Taille du foyer: </label>
                    <select value={householdSize} onChange={e => setHouseholdSize(e.target.value)} style={inputStyle}>
                        <option value="All">Tous</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </div>
            </div>
            
        </div>
    )
}

export default ParallelCoordinatesContainer;